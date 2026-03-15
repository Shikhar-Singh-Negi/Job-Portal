import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserLogin = () => {
    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const { setShowUserLogin, backendUrl, setUserToken, setUserData } =
        useContext(AppContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (state === "Login") {
                const { data } = await axios.post(backendUrl + "/api/user/login", {
                    email,
                    password,
                });

                if (data.success) {
                    setUserData(data.user);
                    setUserToken(data.token);
                    localStorage.setItem("userToken", data.token);
                    setShowUserLogin(false);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + "/api/user/register", {
                    name,
                    email,
                    password,
                });

                if (data.success) {
                    setUserData(data.user);
                    setUserToken(data.token);
                    localStorage.setItem("userToken", data.token);
                    setShowUserLogin(false);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white p-10 rounded-xl text-slate-500"
            >
                <h1 className="text-center text-2xl text-neutral-700 font-medium">
                    User {state}
                </h1>
                <p className="text-sm">Welcome! Please {state === "Login" ? "sign in" : "create account"} to continue</p>

                {state !== "Login" && (
                    <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img src={assets.person_icon} alt="" />
                        <input
                            className="outline-none text-sm"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                )}

                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                    <img src={assets.email_icon} alt="" />
                    <input
                        className="outline-none text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Email ID"
                        required
                    />
                </div>
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                    <img src={assets.lock_icon} alt="" />
                    <input
                        className="outline-none text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 w-full text-white py-2 rounded-full mt-6"
                >
                    {state === "Login" ? "Login" : "Create Account"}
                </button>

                {state === "Login" ? (
                    <p className="mt-5 text-center">
                        Don't have an account?{" "}
                        <span
                            onClick={() => setState("Sign Up")}
                            className="text-blue-600 cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>
                ) : (
                    <p className="mt-5 text-center">
                        Already have an account?{" "}
                        <span
                            onClick={() => setState("Login")}
                            className="text-blue-600 cursor-pointer"
                        >
                            Login
                        </span>
                    </p>
                )}

                <img
                    onClick={() => setShowUserLogin(false)}
                    className="absolute top-5 right-5 cursor-pointer"
                    src={assets.cross_icon}
                    alt=""
                />
            </form>
        </div>
    );
};

export default UserLogin;
