const jwt = require("jsonwebtoken");

const verifyToken = async (Token) => {
  const privateKey = "wejhbqjkfb";
  return new Promise((resolve, reject) => {
    jwt.verify(Token, privateKey, (err, tokenDetails) => {
      if (err) {
        return reject({ error: false, message: "Invalid token" });
      }
      resolve({
        tokenDetails,
        error: false,
        message: "Valid token",
      });
    });
  });
};

module.exports = verifyToken;
