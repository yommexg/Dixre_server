const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client, also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No Content
  const refreshToken = cookies.jwt;

  // is refershToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in the db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();
  console.log(
    `User ${foundUser.firstName} ${foundUser.lastName} is logged out`
  );
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
