const express = require("express");
const app = express();
const router = express.Router();
const dotenv = require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const fromNumber = "+14159513490";
const toNumber = "+919326977048";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle the response from Twilio
router.post("/handleResponse", (req, res) => {
  const digits = req.body.Digits;

  if (digits === "1") {
    client.messages
      .create({
        to: toNumber,
        from: fromNumber,
        body: "Thank you for your interest. Here is your interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test",
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.error(err));
  }

  res.send("<Response><Say>Thank you!</Say></Response>");
});

// Health check endpoint
router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server running fine on port 3000" });
});

app.use("/api/v1", router);

// Starting server and making call
app.listen(3000, () => {
  console.log(`Server running fine at PORT 3000.`);

  client.calls
    .create({
      to: toNumber,
      from: fromNumber,
      twiml: `<Response><Gather action="https://39dd-110-235-219-182.ngrok-free.app/api/v1/handleResponse" method="POST"><Play>https://raw.githubusercontent.com/shamshubham/Tiwillio-Assignment/master/Fara%20interview%20audio.mp3</Play></Gather></Response>`,
    })
    .then((call) => console.log(call.sid))
    .catch((err) => console.error(err));
});
