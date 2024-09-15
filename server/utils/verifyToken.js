const jwt = require("jsonwebtoken");

const verifyToken = async (Token) => {
  const privateKey = process.env.KEY;
  return new Promise((resolve, reject) => {
    jwt.verify(Token, privateKey, (err, tokenDetails) => {
      if (err) {
        return reject({ error: false, message: "Invalid refresh token" });
      }
      resolve({
        tokenDetails,
        error: false,
        message: "Valid refresh token",
      });
    });
  });
};

module.exports = verifyToken;
