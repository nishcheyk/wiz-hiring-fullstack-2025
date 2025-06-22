import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmation({ to, eventTitle, slotTime }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Booking Confirmation for ${eventTitle}`,
    text: `Your booking for "${eventTitle}" at ${slotTime} is confirmed!`,
    html: `<p>Your booking for <b>${eventTitle}</b> at <b>${slotTime}</b> is confirmed!</p>`
  });
  return info;
}
