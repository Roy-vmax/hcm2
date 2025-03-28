require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"; // Twilio WhatsApp Number

// Send a message to a specific number
app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body;
    const to = "+31686426972"; // Target phone number

    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required." });
    }

    const twilioResponse = await client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log("Message sent:", twilioResponse.sid);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Handle incoming WhatsApp messages and reply automatically
app.post("/whatsapp", async (req, res) => {
  try {
    const { Body, From } = req.body;

    let replyMessage = "👋 Hello! How can I assist you?";

    if (Body.toLowerCase().includes("موعد")) {
      replyMessage = "أهلا و سهلا. هل تريد مساعدتك في حجز موعد؟";
    } else if (Body.toLowerCase().includes("شكرا")) {
      replyMessage = "عفوا. أهلا و سهلا بكم دائما. نتمنى الشفاء لكم";
    } else if (Body.toLowerCase().includes("تاريخ")) {
      replyMessage = "هل تقصد اختيار تاريخ لحجز موعد؟";
    } else if (Body.toLowerCase().includes("مساعدة")) {
      replyMessage = "أهلا و سهلا. هل تريد مساعدتك في حجز موعد؟";
    } else {
      replyMessage =
        "❓ I'm sorry, I didn't quite understand that. Could you clarify?";
    }

    // Send the reply via Twilio
    await client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: From,
      body: replyMessage,
    });

    console.log(`Replied to ${From}: ${replyMessage}`);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error("Error responding to message:", err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
