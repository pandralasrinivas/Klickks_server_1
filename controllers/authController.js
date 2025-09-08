const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = (req, res) => {
  const { username,email,password } = req.body;

  const findQuery = "SELECT * FROM users WHERE username = ?";
  db.get(findQuery, [username], (err, user) => {
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertQuery = "INSERT INTO users (username,email,password) VALUES (?, ?, ?)";

    db.run(insertQuery, [username,email,hashedPassword], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "User registered successfully", userId: this.lastID });
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], (err, user) => {
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    res.json({ username: user.username, email: user.email,token});
  });
};

const dashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, this is your dashboard!` });
};

module.exports = { register, login, dashboard };