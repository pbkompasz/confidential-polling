const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const { ethers } = require("ethers");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const uri = process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase";
const client = new MongoClient(uri);
let db, collection;

// TODO Pull events from SC, set batches, etc. and watch if evaluation is needed

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

// OFFCHAIN DATA STORAGE

const contractAddress = "";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi = [];

const entrypointContract = new ethers.Contract(contractAddress, abi, provider);
const contractWithSigner = entrypointContract.connect(wallet);

const batch = [];

/**
 * Submit data
 */
app.post("/submit", async (req, res) => {
  let {  dataHash, data, eventAddress, formId } = req.body.data;
  if (!dataHash || !data || !eventAddress || !formId) {
    return res.status(400).json({ error: "Missing data" });
  }
  let storageId;
  // Set status to received onchain

  if (data.storageType === "ONCHAIN") {
    if (!db || !collection) {
      res.status(500).json({ error: "Database error!" });
    }

    // Save in db locally
    const insertResult = await collection.insertOne({
      message: data,
    });
    console.log("Inserted encrypted data:", insertResult.insertedId);

    if (!dataHash) {
      const serialized = JSON.stringify(data);
      dataHash = crypto.createHash("sha256").update(serialized).digest("hex");
    }

    await contractWithSigner.createDataEntry(
      eventAddress,
      formId,
      owner,
      dataHash,
      insertResult.insertedId,
      {
        gasLimit: 1_000_000,
      }
    );
  }

  res.json({
    message: "Submitted",
    tx,
    storageId,
  });
});

// Check every minute if BATCH_SIZE is met if the event validation, evaluation is set to eager
// cron.schedule("*/5 * * * * *", () => {
//   // console.log(`${new Date().toLocaleString()}: Checking emails...`);
//   // console.log(
//   //   `Expecting ${emailVerifications.filter((ev) => !ev.status).length} emails`
//   // );
//   checkEmails();
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db("mydatabase");
    collection = db.collection("confidentialPolling");

    // Find the document
    const findResult = await collection.findOne({
      _id: insertResult.insertedId,
    });
    console.log("Found document:", findResult);
  } catch (err) {
    console.error("MongoDB error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
})();

// EMAIL VEFIFICATION

const emailVerifications = [];

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
