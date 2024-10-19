import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { API_HOST } from "../constants";
import DashboardNav from "./components/DashboardNav";

const LogOut = () => {
    const [devices, setDevices] = useState(window.location.pathname.split('/')[1]);
    const [cookies, setCookie] = useCookies(['authtoken']);
    const [errorMessages, setErrorMessages] = useState({});
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    function logout() {
        setCookie("authtoken", null);
        setCookie("expiry", null);
        setCookie("email", null);
        setCookie("name", null);
    }

    useEffect(() => {
        let devices_value = window.location.pathname.split('/')[1];
        setDevices(devices_value);
        let apiName = (devices_value === "logout-all") ? "logout-all" : "logout";
        fetch(`${API_HOST}/accounts/${apiName}/`, {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + cookies.authtoken
            }
        }).then(response => {
            if (response.status === 204) {
                logout();
                navigate("/");
                return;
            }
            response.text().then((body, response) => {
                try {
                    let json = JSON.parse(body);
                    if (json.detail === "Invalid token.") {
                        logout();
                    }
                } catch {
                    setErrorMessages({ "logout": "Error logging you out" })
                }
            });
        });
        setLoading(false);
    }, [location]);

    const renderErrorMessage = (name) =>
        errorMessages[name] && (<div className="text-red-700">{errorMessages[name]}</div>);

    return (
        <div className="flex">
            <DashboardNav />
            <div className="flex-1 bg-[#e1f3f5] min-h-screen text-black p-8 font-poppins">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-xl font-bold mb-4">Logging Out</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <p className="text-lg">
                                Please wait while we are logging you out
                                {devices === "logout-all" ? " of all devices" : ""}...
                            </p>
                            {renderErrorMessage("logout")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogOut;