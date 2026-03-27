import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        createdOn: { type: Date, default: Date.now },
        verifyOtp: { type: String, default: '' },
        verifyOtpExpireAt: { type: String, default: '' },
        isAccountVerified: { type: Boolean, default: false },
        resetOtp: { type: String, default: '' },
        resetOtpExpireAt: { type: Number, default: 0 },
    });

const User = mongoose.model("User", userSchema);
export default User
