const express = require("express");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = "whatsapp:+14155238886";
const toNumber = "whatsapp:+31686426972";

const client = new twilio(accountSid, authToken);

app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: message,
    });

    res.json({ success: true, messageId: response.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// تعديل الرسالة لتكون على المنفذ الصحيح
app.listen(3000, () => console.log("🚀 Server running on port 3001"));
