const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.USER, 
    pass: process.env.PASSWORD 
  }
});

app.post('/send-email', (req, res) => {
  const { name, comment, email } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Request body is empty' });
  }

  const mailOptions = {
    from: email,
    to: process.env.SENDEREMAIL, 
    subject: 'New Submission from Portfolio website',
    text: `You have received a new comment from ${name} (${email}): ${comment}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: 'Error sending email', error });
    }
    res.status(200).send({ message: 'Email sent successfully', info });
  });
});

app.get("*", (req, res) => {
  res.send("No page found 404");
});

app.listen(port, () => {
  console.log(`Server running`);
});
