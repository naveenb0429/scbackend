import { useState } from "react";
import Countdown from "react-countdown-simple";
import { API_HOST } from "../../constants"
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import OTPInput from "../../components/auth/OTPInput";
import treeMD from "../../assets/images/logos/logo.png";

//Supports 2 types of fucntionalities
const VerifyOTP = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [verifyButtonText, setVerifyButtonText] = useState("Verify OTP");
    const [otp, setOTP] = useState("");
    const [resendCountdown, setResendCountdown] = useState(false);
    let navigate = useNavigate();
    const { email } = useLocation().state;
    const handleUnexpected = (param) => {

    };
    const resendOtp = () => {
        const data = {
            email: email
        }
        fetch(`${API_HOST}/accounts/resend-otp/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                setErrorMessages({ otp_form: "OTP has been resent." })
                setResendCountdown(true);
            } else {
                response.text().then((body, response) => {
                    if (body.indexOf("Max OTP") >= 0) {
                        setErrorMessages({ otp_form: body })
                    } else {
                        setErrorMessages({ otp_form: "Failed to send OTP" })
                    }
                });
            }
        });
    }
    const renderErrorMessage = (name) =>
        errorMessages[name] && (<div className="text-red-700">{errorMessages[name]}</div>);

    const handleVerifyOtp = (one_time_pw) => {
        if (one_time_pw) setOTP(one_time_pw);
        if (!otp || otp.length < 4) {
            setVerifyButtonText("Verify OTP")
            return;
        }
        setVerifyButtonText("Verifying OTP...")
        const data = {
            email: email,
            otp: otp,
        }
        fetch(`${API_HOST}/accounts/verify-otp/`, {
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
                    setErrorMessages({
                        otp_form: json.otp || json.detail
                    });
                    break;
                case 404:
                    setErrorMessages({
                        otp_form: "Unable to verify your email address"
                    });
                    break;
                case 201:
                case 200:
                    setErrorMessages({})
                    navigate("/login?verified=true");
                    break;
                case 500:
                default:
                    setErrorMessages({})
                    handleUnexpected({ status, json, ok });
            }
            setVerifyButtonText("Verify OTP")
        });
    }

    return (
        <>
            <div className="bg-fixed -z-50">
                <Header radius="xl:rounded-bl-full xl:rounded-br-full" />
                <div className="flex">
                    <div className="login-form m-auto grid grid-flow-col auto-cols-max  mt-28 mb-10 rounded-3xl registration">
                        <div
                            className="absolute -mt-12 md:-mt-16 -ml-12 md:-ml-16 left-1/2 rounded-full">
                            <img src={treeMD} className="w-24 h-24 md:w-32 md:h-32" alt="Logo" />
                        </div>
                        <div className="form bg-white rounded-3xl">
                            <div className="p-12 pb-2 md:p-24 md:pb-4">
                                <h1 className="font-bold text-xl m-auto">Input OTP</h1>
                                <p>Please enter OTP sent to your email</p>
                                <OTPInput
                                    length={4}
                                    className="otpContainer"
                                    inputClassName="otpInput"
                                    isNumberInput
                                    autoFocus
                                    onChangeOTP={otp => handleVerifyOtp(otp)}
                                />

                                <Countdown
                                    resend={setResendCountdown}
                                    targetDate={new Date(new Date().setSeconds(new Date().getSeconds() + 29)).toISOString()}
                                    renderer={({ days, hours, minutes, seconds }) => (
                                        <div>
                                            {(seconds === 0)
                                                ? (<button className="underline text-violet-900"
                                                    onClick={() => resendOtp()}>Resend
                                                    OTP</button>)
                                                : (<p>Resend otp in {seconds} Seconds</p>)}
                                        </div>
                                    )}
                                    formatType="d_h_m_s" disableTypes={true} />
                                {renderErrorMessage("otp_form")}
                                <input
                                    className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded"
                                    type="submit" value={verifyButtonText} onClick={() => handleVerifyOtp()} />
                                <p className="text-center text-sm text-gray-500 mt-4">Want to go Back?
                                    <Link to={"/"}
                                        className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">
                                        Go to Home</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyOTP;