import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Candidate Registration
app.post('/api/auth/candidate/register', async (req, res) => {
  try {
    const { name, email, contact, city, skills, username, password } = req.body;

    const [existingEmail] = await pool.query('SELECT * FROM candidateregister WHERE email = ?', [email]);
    const [existingUsername] = await pool.query('SELECT * FROM candidateregister WHERE username = ?', [username]);

    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (existingUsername.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO candidateregister (name, email, contact, city, skills, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, contact, city, skills, username, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email, username, type: 'candidate' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Candidate Login
app.post('/api/auth/candidate/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM candidateregister WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: rows[0].id, email, type: 'candidate' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recruiter Registration
app.post('/api/auth/recruiter/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existingUser] = await pool.query('SELECT * FROM recruitersregister WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO recruitersregister (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email, type: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recruiter Login
app.post('/api/auth/recruiter/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM recruitersregister WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: rows[0].id, email, type: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all candidates from candidateregister
app.get("/candidates", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query("SELECT id, name, email, skills, contact AS phone, experience, city FROM candidateregister");
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new candidate to candidateregister
app.post("/candidates", authenticateToken, async (req, res) => {
  const { name, email, skills, phone, experience, city } = req.body;
  const sql =
    "INSERT INTO candidateregister (name, email, skills, contact, experience, city) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await pool.query(sql, [name, email, skills, phone, experience, city]);
    res.json({ message: "Candidate added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a candidate from candidateregister
app.delete("/candidates/:id", authenticateToken, async (req, res) => {
  const candidateId = req.params.id;
  const sql = "DELETE FROM candidateregister WHERE id = ?";
  try {
    await pool.query(sql, [candidateId]);
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Fetch all requirements
app.get("/requirements", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM requirements");
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new requirement
app.post("/requirements", authenticateToken, async (req, res) => {
  const { position, location, company, description, salary, skills_required, experience } = req.body;
  const sql =
    "INSERT INTO requirements (position, location, company, description, salary, skills_required, experience) VALUES (?, ?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await pool.query(sql, [position, location, company, description, salary, skills_required, experience]);
    res.json({ message: "Requirement added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a requirement by ID
app.delete("/requirements/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM requirements WHERE id = ?";
  try {
    await pool.query(sql, [id]);
    res.json({ message: "Requirement deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
