const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  // for any credentials missing in the request
  const { firstName, lastName, gender, pwd, phoneNumber } = req.body;
  if (!firstName || !lastName || !gender || !pwd || !phoneNumber)
    return res.status(400).json({ message: "All fields are required" });

  // check for duplicate user by email in the db
  const duplicate = await User.findOne({
    phoneNumber,
  }).exec();

  // conflict
  if (duplicate) return res.sendStatus(409); // conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the user
    await User.create({
      lastName,
      firstName,
      gender,
      password: hashedPwd,
      phoneNumber,
    });

    res.status(201).json({
      success: `New user ${firstName} ${lastName} created`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
