import Header from "../layout/Header";
import { useState } from "react";
import treeMD from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import user from "../assets/icons/user.svg";
import { API_HOST } from "../../constants";

const ForgotPassword = () => {
    const [errorMessages, setErrorMessages] = useState({});

    let navigate = useNavigate();

    const handleForgotPassword = (event) => {
        event.preventDefault()
        const { email } = document.forms['forgot'];
        setErrorMessages({ detail: "Sending OTP" })
        fetch(`${API_HOST}/accounts/reset-password/`, {
            method: "POST",
            body: JSON.stringify({
                email: email.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                navigate("/login?temporary=true")
                setErrorMessages({})
            } else {
                response.json().then((body, response) => {
                    setErrorMessages(response.json())
                });
            }
        });
    }

    const renderErrorMessage = (name) =>
        errorMessages[name] && (<div className="text-red-700">{errorMessages[name]}</div>);

    return (
        <>
            <div className="bg-fixed -z-50">
                <Header radius="xl:rounded-bl-full xl:rounded-br-full" />
                <div className="flex">
                    <div className="login-form m-auto grid grid-flow-col auto-cols-max  mt-28 mb-10 rounded-3xl">
                        <div
                            className="absolute -mt-12 md:-mt-16 -ml-12 md:-ml-16 left-1/2 rounded-full">
                            <img src={treeMD} className="w-24 h-24 md:w-32 md:h-32" alt="Logo" />
                        </div>
                        <div className="form bg-white rounded-3xl registration">
                            <form className="p-12 pb-2 md:p-24 md:pb-4" name="forgot" onSubmit={handleForgotPassword}>
                                <div className="flex flex-col items-center text-2xl p-3">
                                    <p className="w-auto">Forgot Password?</p>
                                </div>
                                <div className="flex items-center text-lg ">
                                    <img className="absolute ml-3" src={user} width="24" height="24" alt="" />
                                    <input type="text" name="email"
                                        className="bg-gray-200 rounded pl-12 py-2 md:py-4 focus:outline-none w-full"
                                        placeholder="Email Address" />
                                </div>
                                {renderErrorMessage("uname")}
                                <div className="mt-6">
                                    <input
                                        className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded"
                                        type="submit" />
                                    {renderErrorMessage("detail")}
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-4">Remembered your password?
                                    <Link to={"/login"}
                                        className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">
                                        Log in</Link>
                                </p>
                                <p className="text-center text-sm text-gray-500 mt-4">Don&#x27;t have an account yet?
                                    <Link to={"/register"}
                                        className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">
                                        Register</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;