import DataUriParser from "datauri/parser.js";
import path from "path";
import nodemailer, { createTransport } from "nodemailer";

export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer);
};

export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();
  return res
    .status(statusCode)
    .cookie("token", token, {
      ...cookieOption,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .json({ success: true, message: message });
};

export const cookieOption = {
  httpOnly: process.env.NODE_ENV === "development" ? false : true,
  secure: process.env.NODE_ENV === "development" ? false : true,
  sameSite: process.env.NODE_ENV === "development" ? false : "none",
};

export const sendEmail = async (subject, to, text) => {
  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0f850f439baa2a",
      pass: "b90d6000d2849f",
    },
  });

  await transporter.sendMail({
    subject,
    to,
    text,
  });
};
