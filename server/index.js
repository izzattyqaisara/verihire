import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

app.get("/", (_req, res) => {
  res.send("Billplz backend is running");
});

app.post("/create-bill", async (req, res) => {
  try {
    const { email, name, amount, description } = req.body;

    if (!email || !name || !amount || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = process.env.BILLPLZ_API_KEY;
    const collectionId = process.env.BILLPLZ_COLLECTION_ID;
    const callbackUrl = process.env.BILLPLZ_CALLBACK_URL;
    const redirectUrl = process.env.BILLPLZ_REDIRECT_URL;

    if (!apiKey || !collectionId) {
      return res.status(500).json({ error: "Billplz credentials not configured" });
    }

    const payload = new URLSearchParams({
      collection_id: collectionId,
      email,
      name,
      amount: String(amount),
      description,
      callback_url: callbackUrl || "",
      redirect_url: redirectUrl || "",
    });

    const response = await axios.post(
      "https://www.billplz-sandbox.com/api/v3/bills",
      payload,
      {
        auth: {
          username: apiKey,
          password: "",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.json({
      billId: response.data.id,
      url: response.data.url,
      raw: response.data,
    });
  } catch (error) {
    console.error("Create bill error:", error?.response?.data || error.message);
    return res.status(500).json({
      error: error?.response?.data || error.message || "Failed to create bill",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});