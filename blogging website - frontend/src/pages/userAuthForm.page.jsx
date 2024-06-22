import { Link, Navigate, json, useNavigate } from "react-router-dom";
import InputComponent from "../components/input.component";
import GoogleImg from "../imgs/google.png";
import AnimationPage from "../common/page-animation";
import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { userContext } from "../App";

const UserAuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [formData, SetFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const {
    authState: { access_token },
    setAuthState,
  } = useContext(userContext);

  console.log(access_token);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setAuthState(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      });
  };

  const handleChange = (e) => {
    SetFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/sign-in" : "/sign-up";

    // Regex
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let { fullname, email, password } = formData;

    if (type !== "sign-in" && fullname.length < 3) {
      return toast.error("Fullname must be more than 3 characters");
    }

    if (!email.length) {
      return toast.error("Please provide your email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please provide your valid email");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Your password must be greater than 6 and less than 20 characters with a numeric, including atleast 1 uppercase and 1 lowercase character"
      );
    }

    let data =
      type === "sign-in" ? { email, password } : { fullname, email, password };

    userAuthThroughServer(serverRoute, data);
  };

  return access_token ? (
    <Navigate to={"/"} />
  ) : (
    <AnimationPage keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form onSubmit={handleClick} className="w-[80%] max-w-[400px]">
          <h2 className="font-gelasio capitalize text-3xl text-center mb-24">
            {type === "sign-in" ? "Welcome back" : "Join us today"}
          </h2>

          {type === "sign-up" ? (
            <InputComponent
              name={"fullname"}
              id={"fullname"}
              placeHolder={"Full name"}
              type={"text"}
              icon="user"
              value={formData.fullname}
              onChange={handleChange}
            />
          ) : (
            ""
          )}

          <InputComponent
            name={"email"}
            type={"email"}
            id={"email"}
            placeHolder={"Email"}
            icon="envelope"
            value={formData.email}
            onChange={handleChange}
          />

          <InputComponent
            name={"password"}
            type={"password"}
            id={"password"}
            placeHolder={"Password"}
            icon="lock"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn-dark center mt-14 py-2">
            {type.replace("-", " ")}
          </button>

          <div className="w-[90%] flex items-center gap-4 relative my-5 opacity-10 text-black center">
            <hr className="bg-black w-1/2" />
            <p>Or</p>
            <hr className="bg-black w-1/2" />
          </div>

          <button className="btn-dark w-[90%] flex center justify-center items-center gap-4">
            <img src={GoogleImg} alt="googlelogo" className="w-5" />
            <p>Continue with Google</p>
          </button>

          <p className="text-dark-grey underline mt-5 text-center">
            <Link to={type === "sign-in" ? "/sign-up" : "/sign-in"}>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already a member?"}
            </Link>
          </p>
        </form>
      </section>
    </AnimationPage>
  );
};

export default UserAuthForm;
