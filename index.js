const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

const db=  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  const secret_key = process.env.SECRET_KEY;

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database");
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  console.log("Verifying token...");
  const token = req.header("Authorization").split(" ")[1];

//   console.log("backend = " + token);

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, secret_key, (err, decoded) => {
    // console.log("Decoded payload:", decoded);
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token expired:", err);
        return res.status(401).send("Token expired");
      } else {
        console.error("Token verification failed:", err);
        return res.status(403).send("Invalid token");
      }
    }
    // Fetch additional user details from the database
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [decoded.userId], (err, result) => {
      if (err || result.length === 0) {
        console.error("Error fetching user details:", err);
        return res.status(403).send("Invalid token");
      }

      req.user = {
        userId: result[0].id,
        isAdmin: result[0].isAdmin,
      };

    //   console.log("User details:", req.user);

      next();
    });
  });
};

// Register a new user
app.post("/register", async (req, res) => {
  const { username, custName, password } = req.body;

  // Validate if the username (email) follows the specified format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res
      .status(400)
      .send("Invalid email format. Please enter a valid email address.");
  }

  // Validate if the password is at least 8 characters long
  if (password.length < 8) {
    return res.status(400).send("Password must be at least 8 characters long.");
  }

  // Check if the username already exists in the database
  const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUsernameQuery, [username], (checkError, checkResults) => {
    if (checkError) {
      console.error("Error checking username:", checkError);
      res.status(500).send("Error checking username");
      return;
    }
    if (checkResults.length > 0) {
      // Username already exists, return an error response
      res
        .status(400)
        .send(
          "Username already registered. Please choose a different username."
        );
    } else {
      // Username is unique, proceed with registration
      const hashedPassword = bcrypt.hashSync(password, 10);

      const registerQuery =
        "INSERT INTO users (username, custName, password) VALUES (?, ?, ?)";
      db.query(
        registerQuery,
        [username, custName, hashedPassword],
        (registerError, registerResult) => {
          if (registerError) {
            console.error("Error registering user:", registerError);
            res.status(500).send("Error registering user");
            return;
          }
          res.status(200).send("User registered successfully");
        }
      );
    }
  });
});

// Login and get a JWT token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      res.status(500).send("Error during login");
      return;
    }

    if (result.length > 0) {
      const match = await bcrypt.compare(password, result[0].password);

      if (match) {
        const { id, isAdmin } = result[0];
        console.log("id = " + id + "admin " + isAdmin);
        const token = jwt.sign({ userId: id, isAdmin }, secret_key);
        res.status(200).json({ token, userId: id, isAdmin });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/diagnostic-options", (req, res) => {
  const sql = "SELECT * FROM diagnostic_options";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching diagnostic options:", err);
      res.status(500).send("Error fetching diagnostic options");
      return;
    }
    res.status(200).json(result);
  });
});

// API to create a new booking
app.post("/bookings", (req, res) => {
  const {
    customerName,
    testName,
    prescription,
    date,
    time,
    phoneNum,
    address,
    userId,
  } = req.body;
  console.log("backend nbp ");
  console.log(req.body);

  const sql =
    "INSERT INTO bookings (customerName, testName, prescription, date, time,phoneNum, address, userId) VALUES (?, ?, ?, ?,?, ?, ?, ?)";
  db.query(
    sql,
    [
      customerName,
      testName,
      prescription,
      date,
      time,
      phoneNum,
      address,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating a new booking:", err);
        res.status(500).send("Error creating a new booking");
        return;
      }
      res.status(201).send("Booking created successfully");
    }
  );
});

// Endpoint to get booking details for a specific user
app.get("/booking-details/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM bookings WHERE userId = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error getting booking details:", err);
      res.status(500).send("Error getting booking details");
      return;
    }

    res.status(200).json(result);
  });
});

app.get("/admin/booking-list", verifyToken, (req, res) => {
  const isAdmin = req.user.isAdmin;

  // Check if the user is an admin
  if (!isAdmin) {
    return res
      .status(403)
      .send("Access Denied. Only admins can view the booking list.");
  }

  const sql = "SELECT * FROM bookings";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting booking list:", err);
      res.status(500).send("Error getting booking list");
      return;
    }

    res.status(200).json(result);
  });
});

app.put("/admin/update-status/:bookingId", verifyToken, (req, res) => {
  const isAdmin = req.user.isAdmin;

  // Check if the user is an admin
  if (!isAdmin) {
    console.log("not admin to update")
    return res
      .status(403)
      .send("Access Denied. Only admins can view the booking list.");
  }

  const { bookingId } = req.params;
  const { isDone } = req.body;

  // Validate the status value
  if (![0, 1, -1].includes(isDone)) {
    return res
      .status(400)
      .send(
        "Invalid status value. Accepted values: 0 (not done), 1 (done), -1 (cancelled)."
      );
  }

  // Update the status in the database
  const sql = "UPDATE bookings SET isDone = ? WHERE id = ?";
  db.query(sql, [isDone, bookingId], (err, result) => {
    if (err) {
      console.error("Error updating test status:", err);
      return res.status(500).send("Error updating test status.");
    }

    res.status(200).send("Test status updated successfully.");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
