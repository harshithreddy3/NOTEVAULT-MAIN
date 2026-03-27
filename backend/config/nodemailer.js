import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodeMailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    debug: true,
})

const welcomeEmail = {
    from: `"NoteVault" ${process.env.SMTP_USER}`,
    to: "",
    subject: "",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Welcome to Note-Vault </h1>
      <p>We're excited to have you on board. With NoteVault, managing your thoughts and tasks has never been easier. Here's what you can look forward to:</p>
      <ul>
        <li>Create, edit, and pin notes effortlessly.</li>
        <li>Access your notes anytime, from any device.</li>
        <li>Enjoy a clean and intuitive user interface.</li>
      </ul>
      <p>If you have any questions or need support, feel free to reach us at <a href="mailto:notevault@zohomail.in">notevault@zohomail.in</a>.</p>
      <p>Click below to log in and get started:</p>
      <p><a href="https://note-vault-sand.vercel.app" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Go to NoteVault</a></p>
      <p>Happy note-taking!<br>The NoteVault Team</p>
    </div>
  `,
};



export { welcomeEmail }
export default transporter
