const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import endpoint handlers
const submitFormHandler = require('./submitForm').default;
const submitServiceFormHandler = require('./submitServiceForm').default;

// Use endpoint handlers
app.post('/api/submit-form', submitFormHandler);
app.post('/api/submit-service-form', submitServiceFormHandler);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
