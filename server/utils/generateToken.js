const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, role: user.role };
    const accessToken = jwt.sign(payload,process.env.PRIVATE_KEY, {
      expiresIn: "14m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, {
      expiresIn: "30d",
    });

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await UserToken.deleteOne({ userId: user._id });

    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
