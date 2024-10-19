/* eslint-disable no-unused-vars */
import { useState } from "react";
import { API_HOST } from "../../constants"
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri'
import sustaincredLogo from "../../assets/images/logos/sustaincred-white-logo.svg"
import ForgotPasswordModal from "../../components/common/ForgotPasswordModal";

const Login = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [cookies, setCookie] = useCookies(['authtoken', 'expiry', 'email', 'name']);
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [resetMessage, setResetMessage] = useState({ type: '', text: '' });

    let navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const verified = searchParams.get('verified');
    const passwordChanged = searchParams.get('password-change');
    const temporary = searchParams.get('temporary');

    const handleUnexpected = ({ status }) => {
        setErrorMessages({ "others": `An unexpected error occurred. Please try again later. Response Code: ${status}` });
    };

    const handleLogin = (event) => {
        event.preventDefault();

        const { uname, pass } = document.forms['login'];

        const data = {
            email: uname.value,
            password: pass.value
        }
        if (temporary === "true") {
            data.temporary_password = pass.value
        }

        fetch(`${API_HOST}/accounts/login/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return new Promise((resolve) => response.json()
                .then((json) => resolve({
                    status: response.status,
                    ok: response.ok,
                    json,
                })));
        }).then(({ status, json, ok }) => {
            switch (status) {
                case 400:
                case 404:
                    setErrorMessages({
                        pass: json.detail || json.non_field_errors,
                    });
                    break;
                case 201:
                case 200:
                    setErrorMessages({});
                    setCookie("authtoken", json.token);
                    setCookie("expiry", json.expiry);
                    setCookie("email", json.user.email);
                    setCookie("name", json.user.first_name);
                    navigate(temporary === "true" ? "/change-password?reset=true" : "/account");
                    break;
                case 500:
                default:
                    setErrorMessages({})
                    handleUnexpected({ status, json, ok });
            }
        });
    };

    const handleForgotPasswordSubmit = (email) => {
        fetch(`${API_HOST}/accounts/forgot-password/`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Password reset email sent');
                setIsForgotPasswordModalOpen(false);
                setResetMessage({ type: 'success', text: 'A password reset email has been sent to your email address.' });
            })
            .catch(error => {
                console.error('Error sending password reset email:', error);
                setResetMessage({ type: 'error', text: 'There was an error sending the password reset email. Please try again.' });
            });
    };

    const renderErrorMessage = (name) =>
        errorMessages[name] && (<div className="text-red-700 mt-1 text-sm">{errorMessages[name]}</div>);

    return (
        <>
            <div className="bg-[#E1F3F5] min-h-screen flex items-center justify-center py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-xl overflow-hidden rounded-lg bg-white md:h-[70vh]">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 bg-[#577451] text-white p-6 sm:p-8 lg:p-12 md:flex flex-col items-center justify-center hidden">
                        <div className="flex flex-col items-center text-center">
                            <Link to="/">
                                <img
                                    src={sustaincredLogo}
                                    alt="SustainCred Logo"
                                    className="w-40 h-auto mb-6"
                                />
                            </Link>
                            <h1 className="text-3xl font-bold mb-3 font-merriweather">SustainCred</h1>
                            <p className="text-xl">Where Sustainability meets Credibility</p>
                        </div>
                    </div>
                    {/* Mobile Top Section */}
                    <div className="flex flex-col md:hidden w-full bg-[#577451] text-white p-6 sm:p-8 lg:p-12 items-center justify-center">
                        <div className="flex flex-col items-center text-center">
                            <Link to="/">
                                <img
                                    src={sustaincredLogo}
                                    alt="SustainCred Logo"
                                    className="w-24 h-auto mb-4"
                                />
                            </Link>
                            <h1 className="text-2xl font-bold mb-2 font-merriweather">SustainCred</h1>
                            <p className="text-lg">Where Sustainability meets Credibility</p>
                        </div>
                    </div>
                    {/* Right Section */}
                    <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 lg:p-12 overflow-y-auto flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">Login to SustainCred</h2>
                            {temporary === "true" && (
                                <p className="text-red-700 mb-4 text-sm sm:text-base text-center">An email has been sent to your email. Please login using instructions in the email.</p>
                            )}
                            {verified === "true" && (
                                <p className="text-green-700 mb-4 text-sm sm:text-base text-center">Registration completed successfully. Please log in now.</p>
                            )}
                            {passwordChanged === "true" && (
                                <p className="text-green-700 mb-4 text-sm sm:text-base text-center">Password changed successfully. Please log in again.</p>
                            )}
                            {resetMessage.text && (
                                <div className={`mb-4 p-3 rounded ${resetMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {resetMessage.text}
                                </div>
                            )}
                            <form onSubmit={handleLogin} name="login">
                                <div className="mb-4">
                                    <label htmlFor="uname" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="uname"
                                            id="uname"
                                            required
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 pl-12 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                                            placeholder="Enter your email"
                                        />
                                        <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    </div>
                                    {renderErrorMessage("uname")}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="pass"
                                            id="pass"
                                            required
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                                            placeholder="Enter your password"
                                        />
                                        <RiLockPasswordLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-4 flex items-center focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {renderErrorMessage("pass")}
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <div></div>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPasswordModalOpen(true)}
                                        className="text-sm text-[#2558E5] hover:underline focus:outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#577451] text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-[#486043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                >
                                    Sign In
                                </button>
                            </form>
                            <p className="mt-6 text-center text-sm text-gray-700">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-[#2558E5] hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={() => setIsForgotPasswordModalOpen(false)}
                onSubmit={handleForgotPasswordSubmit}
            />
        </>
    );
};

export default Login;