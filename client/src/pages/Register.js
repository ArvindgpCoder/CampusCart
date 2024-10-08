import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import Design from "../components/Design/Design";
import { toast } from "react-hot-toast";
import axios from "axios";

function Register() {
  const [course, setCourse] = useState("B.Tech");
  const [Btech, setBtech] = useState(true);
  const [Mtech, setMtech] = useState(false);
  const [PhD, setPhD] = useState(false);
  const [data, setData] = useState({
    name: "",
    mail: "",
    year: "",
    address: "",
    phone: "",
    password: "",
    course: "",
  });

  useEffect(() => {
    setData((prev) => {
      return { ...prev, course: course };
    });
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pattern = "manit.ac.in";
    const trimmedEmail = data.mail.trim().toLowerCase();

    if (data.name === "") {
      toast.error("Name field required!");
      return;
    }
    if (!trimmedEmail.includes(pattern)) {
      toast.error("Please enter a valid student mail-id!");
      return;
    }

    if (data.name === "") {
      toast.error("Name field required!");
      return;
    }


    if (data.year === "") {
      toast.error("Please enter which year you're from!");
      return;
    }

    if (data.address === "") {
      toast.error("Address field required!");
      return;
    }

    if (data.phone === "") {
      toast.error("Phone no. field is required!");
      return;
    }

    if (data.phone <= 1000000000 || data.phone >= 9999999999) {
      toast.error("Please enter valid phone no.!");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password should be 8 character long!");
      return;
    } else {
      toast.loading("Processing", {
        duration: 5000,
      });
      // console.log(process.env.REACT_APP_BASEURL);

      axios({
        method: "post",
        baseURL: `https://campuscart-mwy7.onrender.com
`,
        url: "/api/register",
        data: data,
      })
        .then((response) => {
          if (response.data.info === "userExist") {
            toast.error("User already exist with this mail-id!");
          }
          else {
            window.location.href = "/login";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div id="login" className={styles.login}>
      <Design />
      <div id={styles.loginFormContainer}>


        <p>SignUp</p>
        <form id={styles.loginForm} onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="name"
            value={data.name}
            placeholder="name"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="email"
            name="mail"
            value={data.mail}
            placeholder="student mail ID"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <div className={styles.checkboxes} style={{ display: 'flex' }}>
            <label htmlFor="btech">
              <input
                type="radio"
                name="btech"
                onChange={(e) => {
                  setBtech(true);
                  setCourse("B.Tech");
                  setPhD(false);
                  setMtech(false);
                }}
                checked={Btech}
                style={{
                  height: "15px"
                }}
              />
              B.Tech
            </label>

            <label htmlFor="mtech">
              <input
                type="radio"
                name="mtech"
                onChange={(e) => {
                  setMtech(true);
                  setCourse("M.Tech");
                  setPhD(false);
                  setBtech(false);
                }}
                checked={Mtech} style={{
                  height: "15px"
                }}
              />
              M.Tech
            </label>

            <label htmlFor="phd">
              <input
                type="radio"
                name="phd"
                onChange={(e) => {
                  setPhD(true);
                  setCourse("PhD");
                  setBtech(false);
                  setMtech(false);
                }}
                checked={PhD} style={{
                  height: "15px"
                }}
              />
              Ph.D
            </label>
          </div>
          <input
            required
            type="number"
            name="year"
            value={data.year}
            placeholder="year"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required
            type="text"
            name="address"
            value={data.address}
            placeholder="address"
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required={true}
            type="number"
            name="phone"
            maxLength={10}
            minLength={10}
            placeholder="phone no."
            value={data.phone}
            onChange={handleChange}
            autoComplete={"off"}
          />
          <input
            required={true}
            type="password"
            name="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            placeholder="password"
            minLength={8}
            maxLength={16}
            value={data.password}
            onChange={handleChange}
            autoComplete={"off"}
          />
          <span id={styles.registerHere}>
            already a user?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              sign in
            </Link>
          </span>
          <button type="submit" onClick={handleSubmit}>
            Register
          </button>
        </form>


      </div>
    </div>
  );
}

export default Register;
