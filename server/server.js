const buyNsellRouter = require("./routes/buyNsell");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config();

const cors = require("cors");
const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 10MB or any size you prefer
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
// require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.DB_MONGO);

const PORT = 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server is running at port ${PORT}`);
});

app.use("/api", buyNsellRouter);
