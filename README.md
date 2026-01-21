# Portfolio Contact Form API

A robust Node.js/Express API for handling portfolio contact form submissions with email notifications. Built with production-ready features including input validation, security headers, error handling, and structured architecture.

## 🚀 Features

- **Email Integration**: Send contact form submissions via Gmail SMTP
- **Input Validation**: Comprehensive validation for name, email, and message fields
- **Rate Limiting**: Multiple layers of rate limiting to prevent spam and abuse
- **Security**: CORS protection, security headers, and input sanitization
- **Error Handling**: Global error handling with detailed logging
- **Production Ready**: Environment-based configuration and graceful shutdown
- **Structured Architecture**: Modular design with separate routes, middleware, and utilities

## 📁 Project Structure

```
├── src/
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handling
│   │   ├── rateLimiter.js     # Rate limiting configurations
│   │   ├── security.js        # Security headers
│   │   └── validation.js      # Input validation
│   ├── routes/
│   │   ├── email.js          # Email sending routes
│   │   └── health.js         # Health check endpoint
│   ├── utils/
│   │   ├── catchAsync.js     # Async error wrapper
│   │   ├── emailService.js   # Email service utilities
│   │   ├── httpStatus.js     # HTTP status constants
│   │   └── validation.js     # Validation utilities
│   ├── app.js               # Express app configuration
│   └── server.js            # Server startup
├── .env                     # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-contact-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   ALLOWED_ORIGIN=*
   ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
   ALLOWED_HEADERS=Content-Type,Authorization
   
   # Rate Limiting Configuration
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   EMAIL_RATE_LIMIT_WINDOW_MS=3600000
   EMAIL_RATE_LIMIT_MAX_REQUESTS=5
   
   # Email Configuration
   EMAIL_SERVICE=Gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   SENDER_EMAIL=your-email@gmail.com
   
   # Email Template Configuration
   EMAIL_SUBJECT=New Submission from Portfolio website
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 📧 Gmail Setup

To use Gmail SMTP, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-01-21T17:13:45.123Z",
  "environment": "development"
}
```

### Send Email
```http
POST /send-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "comment": "Hello! This is a test message."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Rate Limited Response (429):**
```json
{
  "success": false,
  "message": "Too many email requests from this IP. Please wait before sending another message.",
  "retryAfter": "1 hour",
  "limit": 5,
  "windowMs": "1 hour"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Missing required fields: name, comment, and email are required"
}
```

## 🧪 Testing

### Using Postman

1. **Health Check**
   - Method: `GET`
   - URL: `http://localhost:3001/health`

2. **Send Email**
   - Method: `POST`
   - URL: `http://localhost:3001/send-email`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "comment": "This is a test message!"
     }
     ```

### Using cURL

```bash
# Health check
curl http://localhost:3001/health

# Send email
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "comment": "This is a test message!"
  }'
```

### Using the Test Page

Open `test-api.html` in your browser for a simple web interface to test the API.

## 🔒 Security Features

- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: Multiple layers of protection:
  - General: 100 requests per 15 minutes per IP
  - Email: 5 email requests per hour per IP
  - Health: 30 requests per minute per IP
- **Security Headers**: XSS protection, content type options, frame options
- **Input Validation**: Email format validation and required field checks
- **Input Sanitization**: Removes potentially harmful characters
- **Error Handling**: Secure error messages without exposing internals

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Vercel (Serverless)
This project is optimized for Vercel deployment. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Vercel Deploy:**
```bash
npm i -g vercel
vercel
```

### Traditional Server Deployment

#### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
EMAIL_RATE_LIMIT_WINDOW_MS=3600000
EMAIL_RATE_LIMIT_MAX_REQUESTS=3
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
SENDER_EMAIL=your-production-email@gmail.com
```

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server

### Adding New Routes

1. Create route file in `src/routes/`
2. Import and use in `src/app.js`
3. Add appropriate middleware if needed

### Error Handling

All async routes should use the `catchAsync` wrapper:

```javascript
const catchAsync = require('../utils/catchAsync');

router.post('/example', catchAsync(async (req, res) => {
  // Your async code here
  // Errors will be automatically caught and handled
}));
```

## 📝 Validation Rules

- **Name**: Required, non-empty string
- **Email**: Required, valid email format
- **Comment**: Required, non-empty string

All inputs are automatically sanitized to remove potentially harmful characters.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change PORT in .env file or kill existing process
   netstat -ano | findstr :3001
   ```

2. **Email not sending**
   - Check Gmail app password
   - Verify EMAIL_USER and EMAIL_PASSWORD in .env
   - Ensure 2FA is enabled on Gmail account

3. **CORS errors**
   - Update ALLOWED_ORIGIN in .env
   - For development, use `ALLOWED_ORIGIN=*`

4. **Validation errors**
   - Ensure all required fields (name, email, comment) are provided
   - Check email format is valid

5. **Rate limiting errors**
   - Wait for the specified time in the error message
   - Reduce request frequency
   - Check rate limit headers in response for remaining quota

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions, please create an issue in the repository or contact the maintainer.