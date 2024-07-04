import React, { useState } from "react";
import { useEffect } from "react";
import styles from "./Product.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import { LoaderIcon } from "react-hot-toast";

function Product() {
  const [loading, setLoading] = useState(true);
  const [prodExist, setProdExist] = useState(false);
  const [valid, setValid] = useState(false);
  const [sname, setSname] = useState("");
  const [smail, setSmail] = useState("");
  const [sphone, setPhone] = useState("");
  const [data, setData] = useState({
    sname: "",
    _id: "314",
    id: "",
    sellerId: "",
    pname: "NAME",
    pprice: 0,
    pdetail:
      "KSEMFJKLERFN OEJFOEJFEF:E FO JFEHFUIFHFUIFYEFNIUFY ksffnrnfk shurf smfifr n0f jhuf fbf iufefnviu fn  yvyrvrjhg iurfhr wjhrwuifrwu fhrwif yfk viyrbyurwnrkjh rwif ryw rifrwhuivwr iwrfhoqo eldmnkdjcalefn vourlksfnvuhf h feuf fnejf hiqjdnkehfean kjiofjeafjief oefeijf ",
    pdate: "2020-20-20",
    pimage: "HI",
    pcat: "CYCLE",
    preg: "2932-23-21",
    __v: 0,
  });

  useEffect(() => {
    const href = window.location.href.split("/");
    const ppid = href[href.length - 1];
    const token = JSON.parse(localStorage.getItem("token"));

    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_BASEURL}`,
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        setValid(true);
        axios({
          method: "post",
          baseURL: `${process.env.REACT_APP_BASEURL}`,
          url: "/api/prodData",
          data: { id: ppid },
        })
          .then(function (response) {
            setData(response.data.details.data);
            setSname(response.data.details.name);
            setSmail(response.data.details.mail);
            setPhone(response.data.details.phone);
            setLoading(false);
            setProdExist(true);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
        setValid(false);
      });
  }, []);

  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>CampusCart</div>
        <div id={styles.searchBox}>
          <input placeholder="I am looking for ..." />
          <span>
            <img src={search} alt="search" />
          </span>
        </div>
        {valid ? (
          <div id={styles.navLinks}>
            <div>
              <Link to="/sell">Sell</Link>
            </div>
            <div>
              <Link id={styles.registerNav} to="/profile">
                Profile
              </Link>
            </div>
          </div>
        ) : (
          <div id={styles.navLinks}>
            <div>
              <Link to="/login">Login</Link>
            </div>
            <div>
              <Link id={styles.registerNav} to="/register">
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>
      {loading ? (
        <div className={styles.loadingIcon}>
          <LoaderIcon />
        </div>
      ) : !prodExist ? (
        <div className={styles.loadingIcon}>
          404 Error | Product Doesn&apos;t exist
        </div>
      ) : (
        <>
          <div id={styles.productInformation}>
            <div id={styles.imageContainer}>
              <img src={data.pimage} id={styles.pimage} alt={data.pname} />
            </div>
            <div id={styles.productInfocon}>
              <div>
                <p id={styles.pname}>{data.pname}</p>
                <p id={styles.pcat}> {data.pcat}</p>
                <p id={styles.pdetail}>{data.pdetail}</p>
                <p className={styles.pbought}>
                  bought on : {data.pdate.slice(0, 10)}
                </p>
                <p className={styles.pbought}>
                  sold by : {sname} {valid ? smail : ""}
                </p>
                {valid ? (
                  <p className={styles.pbought}>phone : {sphone}</p>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.pricecon}>
                <div id={styles.pprice}>Rs.{data.pprice}/-</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Product;
