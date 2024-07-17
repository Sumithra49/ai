const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  // Read the uploaded file content
  const fileContent = fs.readFileSync(filePath, "utf8");

  try {
    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    // Send the content to Google Cloud Natural Language API for sentiment analysis
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        document: {
          content: fileContent,
          type: "PLAIN_TEXT",
        },
      }
    );

    // Extract and send back the summary and insights
    const { documentSentiment, sentences } = response.data;
    const summary = documentSentiment;
    const insights = sentences;

    res.json({ summary, insights });
  } catch (error) {
    console.error(
      "Error processing file:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error processing file" });
  } finally {
    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
