const twilio = require("twilio");
const bcrypt = require("bcrypt");

const User = require("../model/User");

const client = twilio(
  process.env.TWILO_ACCOUNT_SID,
  process.env.TWILO_AUTH_TOKEN
);

const handleTwilioForget = async (req, res) => {
  const { email } = req.body;
  const foundUser = await User.findOne({ email });
  const otp = generateOTP();
  if (!foundUser) return res.sendStatus(401);

  // Send OTP via SMS
  client.messages
    .create({
      body: `Your OTP is: ${otp}. Do not share with anyone`,
      from: process.env.TWILO_PHONE_NUMBER,
      to: foundUser.phoneNumber,
    })
    .then(() => {
      res.send(otp);
    })

    .catch((error) => {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    });

  // Helper function to generate OTP
  function generateOTP() {
    const digits = "0123456789";
    let generatedOTP = "";

    for (let i = 0; i < 6; i++) {
      generatedOTP += digits[Math.floor(Math.random() * 10)];
    }

    return generatedOTP;
  }
};

const handleResetPassword = async (req, res) => {
  const { email, pwd } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.sendStatus(401);
  const hashedPwd = await bcrypt.hash(pwd, 10);
  try {
    foundUser.password = hashedPwd;
    await foundUser.save();
    res
      .status(201)
      .json({ success: `${foundUser.username} Password was Changed` });
  } catch (error) {
    res.status(404);
    res.json({ message: `an error occured: ${error}` });
  }
};

module.exports = { handleTwilioForget, handleResetPassword };
