const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        console.log("attempted refresh token reuse!");
        const hackedUser = await User.findOne({
          phoneNumber: decoded.phoneNumber,
        }).exec();
        hackedUser.refreshToken = [];
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) {
      console.log("expired refresh token");
      foundUser.refreshToken = [...newRefreshTokenArray];
      await foundUser.save();
    }
    if (err || foundUser.phoneNumber !== decoded.phoneNumber)
      return res.sendStatus(403);

    // Refresh token was still valid
    const accessToken = jwt.sign(
      {
        UserInfo: {
          phoneNumber: foundUser.phoneNumber,
          lastName: foundUser.lastName,
          gender: foundUser.gender,
          firstName: foundUser.firstName,
          _id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "10m" }
    );

    const newRefreshToken = jwt.sign(
      {
        phoneNumber: foundUser.phoneNumber,
        lastName: foundUser.lastName,
        gender: foundUser.gender,
        firstName: foundUser.firstName,
        _id: foundUser._id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken }); // Return the new access token in the response
  });
};

module.exports = { handleRefreshToken };
