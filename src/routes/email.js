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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Portfolio Contact
        </h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
            ${comment}
          </div>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Sent via Portfolio Contact Form at ${new Date().toLocaleString()}
        </p>
      </div>
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