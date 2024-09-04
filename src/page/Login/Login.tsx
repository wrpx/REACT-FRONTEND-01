import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { loginUser } from "../../api/userService";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
      const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("เข้าสู่ระบบล้มเหลว:", error);
      // แสดงข้อความแจ้งเตือนให้ผู้ใช้ทราบ
    } finally {
      setLoading(false);
    }
  };

  const IonIcon = ({
    name,
    className,
  }: {
    name: string;
    className?: string;
  }) => {
    return React.createElement("ion-icon", { name, className });
  };

  return (
    <div className="screen-1">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader loading={loading} size={50} />
        </div>
      )}
      <svg
        className="logo"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="300"
        height="300"
        viewBox="0 0 640 480"
        xmlSpace="preserve"
      >
        <g transform="matrix(3.31 0 0 3.31 320.4 240.4)">
          <circle style={{ fill: "rgb(61,71,133)" }} cx="0" cy="0" r="40" />
        </g>
        <g transform="matrix(0.98 0 0 0.98 268.7 213.7)">
          <circle style={{ fill: "rgb(255,255,255)" }} cx="0" cy="0" r="40" />
        </g>
        <g transform="matrix(1.01 0 0 1.01 362.9 210.9)">
          <circle style={{ fill: "rgb(255,255,255)" }} cx="0" cy="0" r="40" />
        </g>
        <g transform="matrix(0.92 0 0 0.92 318.5 286.5)">
          <circle style={{ fill: "rgb(255,255,255)" }} cx="0" cy="0" r="40" />
        </g>
        <g transform="matrix(0.16 -0.12 0.49 0.66 290.57 243.57)">
          <polygon
            style={{ fill: "rgb(255,255,255)" }}
            points="-50,-50 -50,50 50,50 50,-50 "
          />
        </g>
        <g transform="matrix(0.16 0.1 -0.44 0.69 342.03 248.34)">
          <polygon
            style={{ fill: "rgb(255,255,255)" }}
            points="-50,-50 -50,50 50,50 50,-50 "
          />
        </g>
      </svg>
      <form onSubmit={handleLogin}>
        <div className="email">
          <label htmlFor="email">Email Address</label>
          <div className="sec-2">
            <IonIcon name="mail-outline" />
            <input type="email" name="email" placeholder="username@gmail.com" />
          </div>
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <div className="sec-2">
            <IonIcon name="lock-closed-outline" />
            <input
              className="pas"
              type="password"
              name="password"
              placeholder="············"
            />
            <IonIcon className="show-hide" name="eye-outline" />
          </div>
        </div>
        <button type="submit" className="login">
          Login
        </button>
      </form>
      <div className="footer">
        <span>Sign up</span>
        <span>Forgot Password?</span>
      </div>
    </div>
  );
};

export default Login;
