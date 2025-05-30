import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const {
    first_name,
    last_name,
    project_description,
    interests = [],
    budget,
    message,
    email,
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: 'New Form Submission',
    html: `
      <h2>New Project Inquiry</h2>
      <p><strong>First Name:</strong> ${first_name}</p>
      <p><strong>Last Name:</strong> ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Interests:</strong> ${interests.join(', ')}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Project Description:</strong><br/>${project_description}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
}
