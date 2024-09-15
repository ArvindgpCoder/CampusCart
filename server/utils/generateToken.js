const jwt = require("jsonwebtoken");

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };
    const token = jwt.sign(payload, "wejhbqjkfb", {
      expiresIn: "1d",
    });
    console.log(token);

    return token;  
  } catch (err) {
    throw err; 
  }
};

module.exports = generateTokens;
