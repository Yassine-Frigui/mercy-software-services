const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import Brevo SDK
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(bodyParser.json());

// Path to drafts file
const draftsFile = path.join(__dirname, 'drafts.json');

// Helper to read drafts
const readDrafts = () => {
  if (!fs.existsSync(draftsFile)) {
    return [];
  }
  const data = fs.readFileSync(draftsFile, 'utf8');
  return JSON.parse(data);
};

// Helper to write drafts
const writeDrafts = (drafts) => {
  fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
};

//health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API to save/update draft
app.post('/api/drafts/save', (req, res) => {
  const { sessionId, formData, timestamp } = req.body;

  if (!sessionId || !formData) {
    return res.status(400).json({ error: 'Session ID and form data required' });
  }

  // Validate minimum data: phone number
  if (!formData.phone) {
    return res.status(400).json({ error: 'Phone number is required for draft' });
  }

  const drafts = readDrafts();
  const existingIndex = drafts.findIndex(d => d.sessionId === sessionId && d.status === 'draft');

  const draft = {
    sessionId,
    formData,
    timestamp: timestamp || new Date().toISOString(),
    status: 'draft',
    createdAt: existingIndex >= 0 ? drafts[existingIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }

  writeDrafts(drafts);
  res.json({ success: true, message: 'Draft saved' });
});

// API to load draft
app.get('/api/drafts/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const drafts = readDrafts();
  const draft = drafts.find(d => d.sessionId === sessionId && d.status === 'draft');
  if (draft) {
    res.json(draft);
  } else {
    res.status(404).json({ error: 'Draft not found' });
  }
});

// Path to quotes file
const quotesFile = path.join(__dirname, 'quotes.json');

// Helper to read quotes
const readQuotes = () => {
  if (!fs.existsSync(quotesFile)) {
    return [];
  }
  const data = fs.readFileSync(quotesFile, 'utf8');
  return JSON.parse(data);
};

// Helper to write quotes
const writeQuotes = (quotes) => {
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
};

// Function to send quote email
const sendQuoteEmail = async (quoteData) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "New Quote Request - Mercy Software Services";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Quote Request</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">Client Information</h3>
          <p><strong>Email:</strong> ${quoteData.email}</p>
          <p><strong>Phone:</strong> ${quoteData.phone}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">Project Details</h3>
          <p><strong>Website Type:</strong> ${quoteData.websiteType || 'Not specified'}</p>
          <p><strong>Design Level:</strong> ${quoteData.designLevel || 'Not specified'}</p>
          <p><strong>CMS:</strong> ${quoteData.cms || 'Not specified'}</p>
          <p><strong>Extra Features:</strong> ${quoteData.extraFeatures && quoteData.extraFeatures.length > 0 ? quoteData.extraFeatures.join(', ') : 'None'}</p>
          <p><strong>Estimated Price:</strong> $${quoteData.totalEstimatedPrice || 'Not calculated'}</p>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4CAF50;">
          <p style="margin: 0;"><strong>Quote ID:</strong> ${quoteData.id}</p>
          <p style="margin: 5px 0 0 0;"><strong>Submitted:</strong> ${new Date(quoteData.submittedAt).toLocaleString()}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This quote request was submitted through the Mercy Software Services website.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = { "name": "Mercy Software Services", "email": "noreply@mercy-software-services.duckdns.org" };
    sendSmtpEmail.to = [{ "email": "yassinefrigui9@gmail.com", "name": "Yassine Frigui" }];
    sendSmtpEmail.replyTo = { "email": quoteData.email, "name": "Client" };
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


// API to submit quote
app.post('/api/quotes/submit', async (req, res) => {
  const { websiteType, designLevel, cms, extraFeatures, totalEstimatedPrice, email, phone, sessionId } = req.body;

  // Basic Validation
  if (!email || !phone) {
    return res.status(400).json({ error: 'Email and Phone are required' });
  }

  const quotes = readQuotes();

  const newQuote = {
    id: Date.now().toString(), // Simple ID generation
    sessionId: sessionId || null,
    websiteType,
    designLevel,
    cms,
    extraFeatures,
    totalEstimatedPrice,
    email,
    phone,
    status: 'pending', // pending, reviewed, accepted, rejected
    submittedAt: new Date().toISOString()
  };

  quotes.push(newQuote);
  writeQuotes(quotes);

  // Optional: If sessionId is present, maybe update the draft status to 'submitted'
  if (sessionId) {
    const drafts = readDrafts();
    const draftIndex = drafts.findIndex(d => d.sessionId === sessionId);
    if (draftIndex !== -1) {
      drafts[draftIndex].status = 'submitted';
      writeDrafts(drafts);
    }
  }

  // Send email notification
  const emailSent = await sendQuoteEmail(newQuote);
  if (!emailSent) {
    console.warn('Quote submitted but email failed to send');
  }

  // Here you would typically trigger an email notification
  console.log('New Quote Submitted:', newQuote);

  res.json({ success: true, message: 'Quote submitted successfully', quoteId: newQuote.id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});