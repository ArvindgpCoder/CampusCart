import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import dust from "../assets/dustbin.png";

function Profile() {
  const navigate = useNavigate();
  const [myProds, setMyProds] = useState(
    Array({
      id: "",
      pname: "",
      pprice: "",
      pimage: "",
      preg: "",
    })
  );
  const [logout, setLogout] = useState(false);
  const [del, setDelete] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({
    name: "",
    mail: "",
    year: "",
    course: "",
    address: "",
    phone: "",
  });

  const handleUpdate = () => {
    toast.loading("Processing", {
      duration: 5000,
    });
    axios({
      method: "post",
      baseURL: `http://localhost:5000`,
      url: "/api/update",
      data: { newData: data, id: id },
    })
      .then((response) => {
        toast.success("Updated Successfully");
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    setLogout(true);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token === "") {
      navigate("/");
    }
    axios({
      method: "post",
      baseURL: `http://localhost:5000`,
      url: "/api",
      data: { token: token },
    })
      .then((response) => {
        const myid = response.data.userid;
        setId(myid);
        axios({
          method: "post",
          baseURL: `http://localhost:5000`,
          url: "/api/profile",
          data: { id: myid },
        })
          .then((res) => {
            console.log(res);
            console.log(res.data);
            setData(res.data.data);
            setMyProds(res.data.myproducts);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCancel = () => {
    setLogout(false);
    setDelete(false);
  };

  const handleDelete = () => {
    setDelete(true);
  };

  const handleLogoutAcc = () => {
    localStorage.setItem("token", JSON.stringify(""));
    navigate("/");
  };

  const handleDeleteAcc = () => {
    axios({
      method: "post",
      baseURL: `http://localhost:5000`,
      url: "/api/deleteAccount",
      data: { id: id },
    })
      .then((response) => {
        localStorage.setItem("token", JSON.stringify(""));
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id={styles.profilePage}>
      <div id={styles.profileContainer}>
        <div
          id={styles.logoutblur}
          onClick={() => {
            setLogout(false);
            setDelete(false);
          }}
          style={logout || del ? { display: "block" } : { display: "none" }}
        />
        <div
          id={styles.logout}
          style={logout || del ? { display: "block" } : { display: "none" }}
        >
          <div id={styles.logoutTitle}>
            {del ? "Delete " : "Log out from "}your Account
          </div>
          <div id={styles.logoutContext}>
            Are you sure you want to{" "}
            {del ? "delete your account permanently?" : "logout?"}
          </div>
          <div id={styles.logoutBTNS}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={logout ? handleLogoutAcc : handleDeleteAcc}>
              {del ? "Delete" : "Logout"}
            </button>
          </div>
        </div>

        <span id={styles.profileTitle}>
          <span>Profile</span>
          <Link to="/">{"<-"} back</Link>
        </span>
        <div className={styles.profileAttribute}>
          <span>Name</span>
          <span>:</span>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Mail</span>
          <span>:</span>
          <input
            style={{ cursor: "default" }}
            name="mail"
            value={data.mail}
            defaultValue={data.mail}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Year</span>
          <span>:</span>
          <input
            type="number"
            name="year"
            value={data.year}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Course</span>
          <span>:</span>
          <input
            type="text"
            name="course"
            value={data.course}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Address</span>
          <span>:</span>
          <input name="address" value={data.address} onChange={handleChange} />
        </div>
        <div className={styles.profileAttribute}>
          <span>Phone</span>
          <span>:</span>
          <input
            name="phone"
            type="number"
            value={data.phone}
            onChange={handleChange}
          />
        </div>
        <div id={styles.profileBtns}>
          <button type="button" onClick={handleUpdate}>
            Update
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div>
          <div className={styles.mybidtitle}>My Products</div>
          <div className={styles.mybidcontainer}>
            {myProds.length !== 0 ? (
              myProds.map((ele) => {
                return (
                  <div key={ele.pname} className={styles.mybidele}>
                    <Link
                      to={`/product/${ele.id}`}
                      className="flex flex-row items-center"
                    >
                      <img src={ele.pimage} alt="" />
                      <div className={styles.mybidinform}>
                        <p className={styles.mybidname}>{ele.pname}</p>
                        <p>registered on : {ele.preg.slice(0, 10)}</p>
                        <p>price : Rs. {ele.pprice}</p>
                      </div>
                    </Link>
                    <div
                      className={styles.mybidx}
                      onClick={(e) => {
                        axios({
                          method: "post",
                          baseURL: `http://localhost:5000`,
                          url: "/api/deletemyprod",
                          data: { pid: ele.id },
                        })
                          .then((res) => {
                            toast.success("Product deleted successfully!");
                            window.location.reload();
                          })
                          .catch((err) => console.log(err));
                      }}
                    >
                      <img src={dust} alt="" />
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
