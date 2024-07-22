const express = require("express");
const router = express.Router();
const campusmart = require("../controller/campusmartController");

router.post("/login", campusmart.login);
router.post("/register", campusmart.register);
router.post("/", campusmart.token);
router.delete("/", campusmart.delToken);
router.post("/profile", campusmart.profile);
router.post("/deleteAccount", campusmart.delAcc);
router.get("/users/:id/verify/:token", campusmart.verify);
router.post("/logout", campusmart.logout);
router.post("/allprod", campusmart.displayProd);
router.post("/sell", campusmart.sell);
router.post("/update", campusmart.update);
router.post("/prodData", campusmart.prodData);
router.post("/searchproduct", campusmart.searchproduct);
router.post("/deletemyprod", campusmart.deletemyprod);

module.exports = router;
