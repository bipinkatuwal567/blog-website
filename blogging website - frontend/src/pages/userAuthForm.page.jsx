import { Link } from "react-router-dom";
import InputComponent from "../components/input.component";
import GoogleImg from "../imgs/google.png";

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px]">
        <h2 className="font-gelasio capitalize text-3xl text-center mb-24">
          {type === "sign-in" ? "Welcome back" : "Join us today"}
        </h2>

        {type !== "sign-in" ? (
          <InputComponent
            name={"fullname"}
            id={"fullname"}
            placeHolder={"Full name"}
            type={"text"}
            icon="user"
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
        />

        <InputComponent
          name={"password"}
          type={"password"}
          id={"password"}
          placeHolder={"Password"}
          icon="lock"
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
  );
};

export default UserAuthForm;
