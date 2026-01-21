const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * @returns {Object} - Nodemailer transporter
 */
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error.message);
    throw error;
  }
};

/**
 * Send email
 * @param {Object} transporter - Nodemailer transporter
 * @param {Object} options - Email options
 * @returns {Promise} - Send mail promise
 */
const sendEmail = async (transporter, options) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.SENDER_EMAIL,
    subject: options.subject || process.env.EMAIL_SUBJECT || 'New Submission from Portfolio website',
    text: options.text,
    html: options.html
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  createTransporter,
  sendEmail
};