// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();

// allow your frontend to call this server (adjust ports as needed)
app.use(cors({ origin: ['http://localhost:3000','http://localhost:5173'], credentials: false }));
app.use(express.json({ limit: '15mb' })); // allow big base64 images

// ensure data folders exist
const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const applicationsFile = path.join(dataDir, 'applications.json');

function loadApplications() {
  try {
    return JSON.parse(fs.readFileSync(applicationsFile, 'utf-8') || '[]');
  } catch {
    return [];
  }
}
function saveApplications(list) {
  fs.writeFileSync(applicationsFile, JSON.stringify(list, null, 2));
}

function genRegNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 hex chars
  return `NSIC-OKH-${y}${m}${d}-${rand}`;
}

// simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// create/save application (generates a registration number)
app.post('/api/applications', (req, res) => {
  const { student, course, photo } = req.body || {};
  if (!student?.name || !student?.email || !student?.phone || !student?.address || !course || !photo) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  // decode photo data URL
  const match = String(photo).match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return res.status(400).json({ success: false, error: 'Bad photo format.' });
  const ext = match[1].toLowerCase();
  const b64 = match[2];

  const registrationNo = genRegNo();
  const imgPath = path.join(uploadDir, `${registrationNo}.${ext === 'jpeg' ? 'jpg' : ext}`);
  fs.writeFileSync(imgPath, Buffer.from(b64, 'base64'));

  const list = loadApplications();
  const doc = {
    registrationNo,
    student,
    course,
    photoPath: imgPath,
    paymentMethod: null,
    submittedAt: new Date().toISOString()
  };
  list.push(doc);
  saveApplications(list);

  res.json({ success: true, registrationNo });
});

// set/update payment method after submission
app.post('/api/applications/:reg/payment', (req, res) => {
  const { method } = req.body || {};
  if (!method) return res.status(400).json({ success: false, error: 'No payment method.' });

  const list = loadApplications();
  const idx = list.findIndex(a => a.registrationNo === req.params.reg);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Registration not found.' });

  list[idx].paymentMethod = method;
  saveApplications(list);
  res.json({ success: true });
});

// list all applications (basic admin)
app.get('/api/applications', (req, res) => {
  const list = loadApplications().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json(list);
});

// serve uploaded images (so you can preview if needed)
app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Backend running at http://localhost:${PORT}`));
