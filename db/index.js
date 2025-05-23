const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
const PORT = 3000;

// Config
// EMAIL_ENABLED=false for hardhat
// DEFAULT_BATCH_SIZE=20

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const emailVerifications = [];

const batch = [];

const createVerificationRequest = () => {
  const min = 100000;
  const max = 999999;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;

  const ver = {
    otp: rand,
    status: false,
    created: new Date(),
  };
  emailVerifications.push(ver);

  return ver;
};

const createProof = (email) => {};

const checkEmails = () => {
  const proof = createProof();
};

// cron.schedule("*/5 * * * * *", () => {
//   // console.log(`${new Date().toLocaleString()}: Checking emails...`);
//   // console.log(
//   //   `Expecting ${emailVerifications.filter((ev) => !ev.status).length} emails`
//   // );
//   checkEmails();
// });

app.get("/email-verification", (req, res) => {
  const data = req.body;
  res.json({
    message: "One-time password",
    otp: createVerificationRequest().otp,
    received: data,
  });
});

/**
 * Register users
 */
app.post("/register", (req, res) => {
  const data = req.body;
  res.json({
    message: "One-time password",
    otp: createVerificationRequest().otp,
    received: data,
  });
});

/**
 * Submit data
 */
app.post("/submit", (req, res) => {
  const data = req.body;
  let tx, storageId;
  // Set status to received onchain

  if (data.storageType === "OFFCHAIN") {
    // Save locally
    // Hash it
  } else {
    // Send data directly to onchain in a batch
    batch.push(data.data);
    if (batch.length == DEFAULT_BATCH_SIZE) {
      // await contract.submitBatch(batch);
      batch = [];
    }
  }

  res.json({
    message: "Submitted",
    tx,
    storageId,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
