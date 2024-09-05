const express = require("express");
const app = express();
const router = express.Router();
const dotenv = require("dotenv").config();

const twilio = require("twilio");
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = new twilio(accountSid, authToken);

const fromNumber = +14159513490;
const toNumber = +919326977048;

client.calls
  .create({
    to: toNumber,
    from: fromNumber,
    twiml:
      '<Response><Gather action="/handleResponse" method="POST"><Play>https://onedrive.live.com/?authkey=%21AEm9E0JuXEPP2EE&id=6D834994D9580DCB%21245717&cid=6D834994D9580DCB&parId=root&parQt=sharedby&o=OneUp</Play><Say>Press 1 if you are interested in an interview and 2 to cancel it.</Say></Gather></Response>',
  })
  .then((call) => console.log(call.sid))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.status(200).json({ message: `Health check is successfull` });
});

app.use("/api/v1", router);

app.listen(3000, (req, res) => {
  console.log(`Server runnig fine at PORT 3000.`);
});

// Create an endpoint to handle the response
// This should be a separate express route
router.post("/handleResponse", (req, res) => {
  const digits = req.body.Digits;

  if (digits === "1") {
    client.messages
      .create({
        to: toNumber,
        from: fromNumber,
        body: "Thank you for your interest. Here is your interview link: [Your Interview Link]",
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.error(err));
  }

  res.send("<Response><Say>Thank you!</Say></Response>");
});
