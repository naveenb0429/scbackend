import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import DashboardNav from "./components/DashboardNav";
import { renderErrorMessage } from "../utils/utils";
import { API_HOST } from "../constants";

const ChangePassword = () => {
    const [cookies, setCookie] = useCookies(['authtoken']);
    const [errorMessages, setErrorMessages] = useState({});
    let navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const reset = searchParams.get('reset');

    function logout() {
        setCookie("authtoken", null);
        setCookie("expiry", null);
        setCookie("email", null);
        setCookie("name", null);
    }

    const handleForgotPassword = (event) => {
        event.preventDefault()
        const { old_password, new_password } = document.forms['change-password'];

        const data = {
            old_password: old_password.value,
            new_password: new_password.value,
            reset: reset === "true"
        }
        fetch(`${API_HOST}/accounts/change-password/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + cookies.authtoken
            }
        }).then((response) => {
            return new Promise((resolve) => response.json()
                .then((json) => resolve({
                    status: response.status,
                    ok: response.ok,
                    json,
                })));
        }).then(({ status, json, ok }) => {
            if (status === 200) {
                logout();
                navigate("/login?password-change=true");
            }
            setErrorMessages(json);
        });
    }

    return (
        <div className="flex">
            <DashboardNav />
            <div className="flex-1 bg-[#e1f3f5] min-h-screen text-black p-8 font-poppins">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-xl font-bold mb-6 text-center">Change Password</h1>
                    <form name="change-password" onSubmit={handleForgotPassword} className="max-w-md mx-auto">
                        {reset === "true" && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="old_password">
                                    Old Password
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 11H5V21H19V11Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        type="password"
                                        name="old_password"
                                        className="bg-gray-200 rounded pl-12 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Old Password"
                                    />
                                </div>
                                {renderErrorMessage("old_password", errorMessages)}
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password">
                                New Password
                            </label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5V21H19V11Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="password"
                                    name="new_password"
                                    className="bg-gray-200 rounded pl-12 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="New Password"
                                />
                            </div>
                            {renderErrorMessage("new_password", errorMessages)}
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button
                                className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md py-2 px-6 text-base transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
                                type="submit"
                            >
                                Change Password
                            </button>
                        </div>
                        {renderErrorMessage("detail", errorMessages)}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;