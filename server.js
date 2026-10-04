import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      instructions:
        "তুমি Akash AI। বাংলায় বন্ধুসুলভভাবে উত্তর দেবে। ব্যবহারকারী কোনো সিদ্ধান্ত নিতে চাইলে ভালো-মন্দ বুঝিয়ে সৎ ও বাস্তব পরামর্শ দেবে। স্বাস্থ্য বা নিরাপত্তার বিষয়ে প্রয়োজন হলে সতর্ক করবে।",
      input: message
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI response failed" });
  }
});

app.use((req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Akash AI running on port ${PORT}`);
});
