const { isValidEmail, sanitizeString } = require('../utils/validation');
const HTTP_STATUS = require('../utils/httpStatus');

/**
 * Validate email request middleware
 */
const validateEmailRequest = (req, res, next) => {
  const { name, comment, email } = req.body;
  
  // Check if required fields exist
  if (!name || !comment || !email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      message: 'Missing required fields: name, comment, and email are required' 
    });
  }
  
  // Validate name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      message: 'Name must be a non-empty string' 
    });
  }
  
  // Validate comment
  if (typeof comment !== 'string' || comment.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      message: 'Comment must be a non-empty string' 
    });
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      message: 'Invalid email format' 
    });
  }
  
  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.comment = sanitizeString(comment);
  req.body.email = email.trim().toLowerCase();
  
  next();
};

module.exports = {
  validateEmailRequest
};