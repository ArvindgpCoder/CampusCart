import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import table from "../assets/table.svg";
import cycle from "../assets/bicycle.svg";
import setsquare from "../assets/setsquare.svg";
import chair from "../assets/chair.svg";
import coat from "../assets/coat.svg";
import all from "../assets/all.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";
import { LoaderIcon, toast } from "react-hot-toast";

function Home() {
  const [loading, setLoading] = useState(true);
  const [searchval, setsearchval] = useState("");
  const [allProd, setAllProd] = useState([]);
  const [disProd, setDisProd] = useState([]);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    axios({
      method: "post",
      baseURL: `http://localhost:5000`,
      url: "/api",
      data: { token: token },
    })
      .then((response) => {
        setValid(true);
      })
      .catch((error) => {
        console.log(error);
        console.log("error caught in frontend from backend");
      });
    axios({
      method: "post",
      baseURL: `http://localhost:5000`,
      url: "/api/allprod",
      data: {},
    })
      .then((response) => {
        setAllProd(response.data.details);
        setDisProd(response.data.details);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        console.log("error caught in frontend from backend");
      });
  }, []);

  const colorArray = [
    "#e1fff8",
    "#cefff4",
    "#d2f8fa",
    "#cefff4",
    "#bdfff1",
    "#d6cfff",
  ];

  const images = [table, cycle, setsquare, chair, coat, all];
  const [category, setCategory] = useState("all");
  const catId = ["table", "cycle", "drafter", "chair", "coat", "all"];
  const handleDisProd = (id) => {
    if (id === "all") {
      setDisProd(allProd);
      return;
    }
    const result = [];
    allProd.forEach((ele) => {
      if (ele.pcat === id) {
        result.push(ele);
      }
    });
    setDisProd(result);
  };
  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>CampusCart</div>
        <div id={styles.searchBox}>
          <input
            value={searchval}
            onChange={(e) => {
              const val = e.target.value;
              setsearchval(val);
            }}
            placeholder="I am looking for ..."
          />
          <span
            onClick={() => {
              console.log("Clicked");
              axios({
                method: "post",
                baseURL: `http://localhost:5000`,
                url: "/api/searchproduct",
                data: { searchval: searchval },
              })
                .then((response) => {
                  setAllProd(response.data.mysearchdata);
                  setDisProd(response.data.mysearchdata);
                })
                .catch((error) => {
                  toast.error("Internal Error");
                  console.log(error);
                });
            }}
          >
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
                <span  >
                  Profile
                </span>

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
      <div id="home" className={styles.homePage}>
        <div id={styles.categories}>
          {images.map((element, index) => {
            return (
              <div
                key={index}
                className={styles.bannerImg}
                style={{ background: `${colorArray[index]}` }}
              >
                <img
                  id={catId[index]}
                  onClick={(e) => {
                    const id = e.target.id;
                    setCategory(id);
                    handleDisProd(id);
                  }}
                  src={images[index]}
                  alt={`${images[index]}`}
                />
              </div>
            );
          })}
        </div>
        <div id={styles.productTitle}>
          <span>Products : {category}</span>
        </div>
        <div id={styles.productsContainer}>
          {!loading ? (
            disProd.map((ele, ind) => {
              return <Card key={ind} ele={ele} />;
            })
          ) : (
            <div className={styles.loadingIc}>
              <LoaderIcon />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
