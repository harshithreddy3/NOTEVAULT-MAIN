import express from "express";
import { z } from "zod"
import User from "../models/userModel.js"
import Note from "../models/noteModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import authMiddleware from "../middleware.js"
import transporter from "../config/nodemailer.js"
import { welcomeEmail } from "../config/nodemailer.js";
import Folder from "../models/folderModel.js";

const saltRounds = 10;
const signupInput = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string()
})

const signinInput = z.object({
    email: z.string().email(),
    password: z.string()
})

const router = express.Router();

router.post("/signup", async (req, res) => {
    const details = req.body;
    const { success } = signupInput.safeParse(details)
    if (!success) {
        return res.json({
            error: "Invalid Inputs"
        })
    }
    try {
        // Check if the user already exists
        const isUser = await User.findOne({ email: details.email });
        if (isUser) {
            return res.json({ error: "User already exists! Please Sign in" });
        }
        const encrptedPassword = await bcrypt.hash(details.password, saltRounds)
        const newUser = {
            fullName: details.fullName,
            email: details.email,
            password: encrptedPassword,
        };

        welcomeEmail.to = details.email
        welcomeEmail.subject = ` Welcome to NoteVault ,${details.fullName}`
        await transporter.sendMail(welcomeEmail)

        const user = await User.create(newUser);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        return res.json({
            fullName: user.fullName,
            email: user.email,
            _id: user._id,
            createdOn: user.createdOn,
            isAccountVerified: user.isAccountVerified,
            token: token
        });
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
});

router.post("/signin", async (req, res) => {
    const details = req.body;
    const { success } = signinInput.safeParse(details)
    if (!success) {
        return res.json({
            error: "Invalid Inputs"
        })
    }
    try {
        const isUser = await User.findOne({ email: details.email });
        if (!isUser) {
            return res.json({ error: "User doesn't exist" });
        }
        const passwordMatch = await bcrypt.compare(details.password, isUser.password);
        if (passwordMatch) {
            const token = jwt.sign({ userId: isUser._id }, process.env.JWT_SECRET);
            return res.json({
                token,
            })
        } else {
            return res.json({
                error: "Incorrect Password"
            })
        }
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
});

router.post("/send-verify-otp", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: `"NoteVault" ${process.env.SMTP_USER}`,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Your OTP Code</h1>
            <p>Hi ${user.fullName},</p>
            <p>Your OTP code for accessing your NoteVault account is:</p>
            <h2 style="color: #4CAF50; text-align: center;">${otp}</h2>
            <p>This code is valid for the next 10 minutes. Please do not share it with anyone for security reasons.</p>
            <p>If you didn’t request this code, ignore this email.</p>
            <p>Thank you for using NoteVault!<br>The NoteVault Team</p>
            </div>
            `,
        }

        await transporter.sendMail(mailOptions)

        return res.json(
            { message: "OTP sent successfully" }
        );
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
})

router.post("/verify-otp", authMiddleware, async (req, res) => {
    const { otp } = req.body;
    const userId = req.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({ error: "User not found" });
        }

        if (user.verifyOtp === otp && user.verifyOtpExpireAt > Date.now()) {
            user.isAccountVerified = true;
            await user.save();
            return res.json({ message: "Account verified successfully" });
        } else if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ error: "OTP expired" });
        }
        else {
            return res.json({ error: "Invalid OTP" });
        }
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
})

router.post("/password-reset-otp", async (req, res) => {
    const { email } = req.body;

    if (!email)
        return res.json({ error: "Email is required" });
    try {
        const user = await User.findOne({ email: email })
        if (!user)
            return res.json({ error: "User doesn't exist" });

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Your OTP Code</h1>
            <p>Hi ${user.fullName},</p>
            <p>Your OTP code for resetting your NoteVault account password is:</p>
            <h2 style="color: #4CAF50; text-align: center;">${otp}</h2>
            <p>This code is valid for the next 10 minutes. Please do not share it with anyone for security reasons.</p>
            <p>If you didn’t request this code, ignore this email</p>
            <p>Thank you for using NoteVault!<br>The NoteVault Team</p>
            </div>
            `,
        }
        await transporter.sendMail(mailOptions)
        return res.json({
            message: "OTP send successfuly"
        })
    } catch (error) {
        return res.json({ error: "Internal Server Error" });
    }
})

router.post('/set-new-password', async (req, res) => {
    const { email, password, otp } = req.body;
    if (!otp)
        return res.json({ error: "OTP not provided" })
    else if (password === "")
        return res.json({ error: "Enter a password" })
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({ error: "User doesn't exist" });
        }
        if (user.resetOtp === otp && user.resetOtpExpireAt > Date.now()) {
            const match = await bcrypt.compare(password, user.password)
            if (match)
                return res.json({ error: "It cannot be same as old one" });
            user.password = await bcrypt.hash(password, saltRounds);
            user.resetOtp = '';
            user.resetOtpExpireAt = 0;
            await user.save();
            return res.json({ message: "Password reset successful" });
        } else if (user.resetOtp !== otp) {
            return res.json({ error: "Invalid OTP" });
        }
        else {
            return res.json({ error: "OTP expired" });
        }
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }


})

router.get("/get-user", authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.json({ error: "Unauthorized access" });
        }
        const isUser = await User.findOne({ _id: req.userId });

        if (!isUser) {
            return res.json({ error: "User not found" });
        }

        return res.json({
            fullName: isUser.fullName,
            _id: isUser._id,
            isAccountVerified: isUser.isAccountVerified
        });
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
});

router.delete('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const password = req.body.password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            await Note.deleteMany({ userId: req.userId });
            await Folder.deleteMany({ userId: req.userId });
            await User.deleteOne({ _id: req.userId });
            return res.json({
                msg: 'Deletion Successful'
            });
        } else {
            return res.json({
                error: "Incorrect Password"
            })
        }
    } catch (error) {
        return res.json({ error: "Internal server error" });
    }
})

export default router