const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();
app.use(express.json());
app.use(cors());

const routes = {
  "Auth Issue": "Auth Team",
  "Bug Report": "Engineering",
  "Feature Request": "Product",
  Billing: "Finance",
  Other: "General Support",
};

app.post("/support", async (req, res) => {
  const ticket = req.body?.ticket?.trim();

  if (!ticket) {
    return res.status(400).json({ error: "A ticket is required." });
  }

  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TYPESAFE_API_KEY is not configured." });
  }

  try {
    const response = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "jev-latest",
        state: { ticket_text: ticket },
        questions: {
          category: {
            type: "choice",
            instructions: "Which single category best describes this support ticket?",
            criteria: {
              "Auth Issue":
                "Login, password, account access, or authentication problems",
              "Bug Report":
                "Something in the product is broken or behaving incorrectly",
              "Feature Request": "Requests functionality that does not exist yet",
              Billing:
                "Charges, invoices, refunds, subscriptions, or payments",
              Other: "Does not clearly fit any category above",
            },
          },
        },
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("TypeSafe request failed with status:", response.status);
      return res.status(502).json({ error: "Ticket classification failed." });
    }

    const category = data?.answers?.category?.choice;
    const route = routes[category];

    if (!route) {
      console.error("TypeSafe returned an unexpected response shape.");
      return res.status(502).json({ error: "No valid category was returned." });
    }

    return res.json({
      ticket,
      category,
      route,
      confidence: data.answers.category.confidence,
    });
  } catch (error) {
    console.error("Support classification failed:", error.message);
    return res.status(500).json({ error: "Could not classify the ticket." });
  }
});

app.listen(3000, () => {
  console.log("Support backend listening on port 3000");
});