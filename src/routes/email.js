const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { validateEmailRequest } = require('../middleware/validation');
const { emailLimiter } = require('../middleware/rateLimiter');
const { sendEmail } = require('../utils/emailService');
const HTTP_STATUS = require('../utils/httpStatus');

const router = express.Router();

/**
 * Send email endpoint with rate limiting
 */
router.post('/send-email', 
  emailLimiter, // Apply email-specific rate limiting first
  validateEmailRequest, 
  catchAsync(async (req, res) => {
  const { name, comment, email } = req.body;
  // Get transporter from app locals (set in main app)
  const transporter = req.app.locals.transporter;
  
  if (!transporter) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Email service not available'
    });
  }

  const emailOptions = {
    text: `You have received a new comment from ${name} (${email}): ${comment}`,
    html: `
      <h3>New Portfolio Contact</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${comment}</p>
      <hr>
      <p><small>Sent at: ${new Date().toISOString()}</small></p>
    `
  };

  const info = await sendEmail(transporter, emailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Email sent successfully:', info.messageId);
  }
  
  res.status(HTTP_STATUS.OK).json({ 
    success: true,
    message: 'Email sent successfully'
  });
}));

module.exports = router;