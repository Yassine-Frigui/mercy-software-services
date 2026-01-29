const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

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


// API to submit quote
app.post('/api/quotes/submit', (req, res) => {
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

  // Here you would typically trigger an email notification
  console.log('New Quote Submitted:', newQuote);

  res.json({ success: true, message: 'Quote submitted successfully', quoteId: newQuote.id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});