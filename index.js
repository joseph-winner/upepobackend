const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Allowed origins
const allowedOrigins = [
  'https://upepotourandtravelsv1.vercel.app',
  'https://upepotravelsug.com'
];

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other email providers here
  auth: {
    user: 'upepotravelsug@gmail.com', // Replace with your email
    pass: 'uhqu qgcc qhko ezcy',  // Replace with your email password or app-specific password
  },
});

// Endpoint to handle form submission for SearchFilter
app.post('/submit-form', (req, res) => {
  const { destination, checkinDate, checkoutDate, numberOfGuests, email } = req.body;

  // Ensure the email field is included
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Email message setup for website owner
  const ownerMailOptions = {
    from: email, // Use the client's email as the sender
    to: 'upepotravelsug@gmail.com', // Use the fixed email as the recipient
    subject: 'New Travel Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Travel Request Received</h2>
        <p>Dear Upepo Travels Team,</p>
        <p>You have received a new travel request. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Destination:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${destination}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Check-in Date:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${checkinDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Check-out Date:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${checkoutDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Number of Guests:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${numberOfGuests}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">User Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
        </table>
        <p>Please follow up with the client as soon as possible.</p>
        <p>Best regards,</p>
        <p><strong>Upepo Travels System</strong></p>
        <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777;">Upepo Travels, Kampala, Uganda</p>
          <p style="font-size: 12px; color: #777;">Phone: +256 778 304 486 | Email: info@upepotravels.com</p>
        </footer>
      </div>
    `,
  };

  // Email message setup for client confirmation
  const clientMailOptions = {
    from: 'upepotravelsug@gmail.com', // Use the fixed email as the sender
    to: email, // Send to the client's email
    subject: 'Travel Request Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Thank you for your submission!</h2>
        <p>Dear Customer,</p>
        <p>We have received your travel request. Here are the details you provided:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Destination:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${destination}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Check-in Date:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${checkinDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Check-out Date:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${checkoutDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Number of Guests:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${numberOfGuests}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">User Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
        </table>
        <p>We will get back to you shortly with more details.</p>
        <p>Best regards,</p>
        <p><strong>Upepo Travels Team</strong></p>
        <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777;">Upepo Travels, Kampala, Uganda</p>
          <p style="font-size: 12px; color: #777;">Phone: +256 778 304 486 | Email: info@upepotravels.com</p>
        </footer>
      </div>
    `,
  };

  // Send email to website owner
  transporter.sendMail(ownerMailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email to owner', error });
    } else {
      // Send email to client
      transporter.sendMail(clientMailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: 'Error sending confirmation email to client', error });
        } else {
          // Notify user form submission was successful
          res.status(200).json({ message: 'Form submitted successfully', info });
        }
      });
    }
  });
});

// Endpoint to handle form submission for service details
app.post('/submit-service-form', (req, res) => {
  const { name, phone_number, destination, email, message } = req.body;

  // Ensure the email field is included
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Email message setup for website owner
  const ownerMailOptions = {
    from: email, // Use the client's email as the sender
    to: 'upepotravelsug@gmail.com', // Use the fixed email as the recipient
    subject: 'New Service Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">New Service Request Received</h2>
        <p>Dear Upepo Travels Team,</p>
        <p>You have received a new service request. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Full Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Phone Number:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone_number}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Destination:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${destination}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">User Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Message:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <p>Please follow up with the client as soon as possible.</p>
        <p>Best regards,</p>
        <p><strong>Upepo Travels System</strong></p>
        <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777;">Upepo Travels, Kampala, Uganda</p>
          <p style="font-size: 12px; color: #777;">Phone: +256 778 304 486 | Email: info@upepotravels.com</p>
        </footer>
      </div>
    `,
  };

  // Email message setup for client confirmation
  const clientMailOptions = {
    from: 'upepotravelsug@gmail.com', // Use the fixed email as the sender
    to: email, // Send to the client's email
    subject: 'Service Request Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Thank you for your submission!</h2>
        <p>Dear Customer,</p>
        <p>We have received your service request. Here are the details you provided:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Full Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Phone Number:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone_number}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Destination:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${destination}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">User Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Message:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <p>We will get back to you shortly with more details.</p>
        <p>Best regards,</p>
        <p><strong>Upepo Travels Team</strong></p>
        <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777;">Upepo Travels, Kampala, Uganda</p>
          <p style="font-size: 12px; color: #777;">Phone: +256 778 304 486 | Email: info@upepotravels.com</p>
        </footer>
      </div>
    `,
  };

  // Send email to website owner
  transporter.sendMail(ownerMailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email to owner', error });
    } else {
      // Send email to client
      transporter.sendMail(clientMailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: 'Error sending confirmation email to client', error });
        } else {
          // Notify user form submission was successful
          res.status(200).json({ message: 'Form submitted successfully', info });
        }
      });
    }
  });
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
