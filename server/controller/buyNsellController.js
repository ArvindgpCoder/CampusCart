const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcrypt");
const Product = require("../models/products");
const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const generateTokens = require("../utils/generateToken.js");

const login = async (req, res) => {
  try {
    const user = await User.findOne({ mail: req.body.mail });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(200).send({
      message: "logged in successfully",
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  try {
    if (!req.body.mail) {
      return res.status(400).send({ message: "Email is required" });
    }
    let user = await User.findOne({ mail: req.body.mail });
    if (user) {
      return res.status(400).send({ message: "User with given email already exists" });
    }

    const salt = await bcrypt.genSalt(Number(10));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    res.status(201).send({
      message: "User registered successfully.",
      info: "userRegistered",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.deleteOne({ userId: user._id });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const token = async (req, res) => {
  verifyRefreshToken(req.body.token)
    .then(async ({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, role: tokenDetails.role };
      const accessToken = jwt.sign(payload, process.env.PRIVATE_KEY, {
        expiresIn: "14m",
      });


      res.status(200).send({
        error: false,
        userid: tokenDetails._id,
        role: tokenDetails.role,
        message: "Access token created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

const delToken = async (req, res) => {
  try {
    const usertoken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!usertoken)
      return res
        .status(200)
        .send({ error: false, message: "Logged Out Sucessfully" });

    await usertoken.remove();
    res.status(200).send({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

const profile = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ _id: id });

    var arr = [];



    const mydata = await Product.find({ id: id });

    var myprodData = [];
    for (let i = 0; i < mydata.length; i++) {
      const temp = {
        id: mydata[i]._id,
        pname: mydata[i].pname,
        pprice: mydata[i].pprice,
        pimage: mydata[i].pimage,
        preg: mydata[i].preg,
      };
      myprodData.push(temp);
    }
    if (!user) {
      res.status(400).send({
        error: true,
        message: "User not found",
        data: user,

        myproducts: myprodData,
      });
    }
    res
      .status(200)
      .send({ erro: false, data: user, myproducts: myprodData });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const deletemyprod = async (req, res) => {
  try {
    const { pid } = req.body;
    await Product.deleteOne({ _id: pid });
    res.status(200).send({ error: false });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};

const delAcc = async (req, res) => {
  try {
    const id = req.body.id;
    await User.deleteOne({ _id: id });
    await UserToken.deleteOne({ userId: id });
    await Product.deleteOne({ id: id });
    res
      .status(200)
      .send({ error: false, message: "Account deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const logout = async (req, res) => {
  try {
    const id = req.body.id;
    await UserToken.deleteOne({ userId: id });
    res.status(200).send({ error: false, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const update = async (req, res) => {
  try {
    const newData = req.body.newData;
    const id = req.body.id;
    await User.updateOne({ _id: id }, newData);
    res.status(200).send({ error: false, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const displayProd = async (req, res) => {
  try {
    const data = await Product.find({}).lean();
    res.status(200).send({ error: false, details: data });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send({ error: true });
  }
};

const searchproduct = async (req, res) => {
  try {
    const { searchval } = req.body;
    const data = await Product.find({ pname: searchval });
    res.status(200).send({ mysearchdata: data });
  } catch (error) {
    res.status(400).send({ error: true });
  }
};

const prodData = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const data = await Product.findById(id);
    const { name, mail, phone } = await User.findById(data.id);
    res
      .status(200)
      .send({ error: false, details: { data, name, mail, phone } });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true });
  }
};

const sell = async (req, res) => {
  try {
    const { pdata, id } = req.body;
    pdata[id] = id;
    await Product.create(pdata);
    res
      .status(200)
      .send({ error: false, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true, message: "Product wasn't added" });
  }
};

module.exports = {
  login,
  register,
  verify,
  token,
  delToken,
  profile,
  deletemyprod,
  delAcc,
  logout,
  update,
  displayProd,
  searchproduct,
  prodData,
  sell,
};
