const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const Product = require("../models/products.js");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken.js");
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

    const token = await generateTokens(user);
    return res.status(200).send({
      message: "Logged in successfully",
      token,
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


console.log("kuch to print Ho");
const token = async (req, res) => {
  try {

    const result = await verifyToken(req.body.token);
    console.log("req.body.data.token: ", req.body);
    console.log("result: ", result);

    res.status(200).send({
      error: false,
      userid: result.tokenDetails._id,
      message: "Access token created successfully",
    });
  } catch (error) {
    res.status(401).send({ message: "Invalid token", error: error.message });
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
    await Product.deleteOne({ id: id });
    res
      .status(200)
      .send({ error: false, message: "Account deleted Successfully" });
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
  token,
  profile,
  deletemyprod,
  delAcc,
  update,
  displayProd,
  searchproduct,
  prodData,
  sell,
};
