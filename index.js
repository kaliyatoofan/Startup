const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors()); // Use { origin: "https://kalyaxxtoofan.serv00.net" } later for security
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://kalyaxxtoofan.serv00.net",
        "X-Title": "StartupNest",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2)); // Debug output

    if (data.choices && data.choices.length > 0) {
      res.json({ message: data.choices[0].message.content });
    } else if (data.error) {
      res.status(500).json({ error: data.error.message });
    } else {
      res.status(500).json({ error: "No valid response received from OpenRouter." });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
