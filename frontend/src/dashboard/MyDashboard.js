/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { Chart } from 'react-charts';
import { API_HOST } from "../constants";
import DashboardNav from "../dashboard/components/DashboardNav";
import { renderErrorMessage, renderSubErrorMessage } from "../utils/utils";

const MyDashboard = () => {
    const [data, setData] = useState(null);
    const [eligible, setEligible] = useState(false);
    const [surveyFilled, setSurveyFilled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['authtoken']);
    const [errorMessages, setErrorMessages] = useState({});
    const [user] = useState({ 'name': 'User' });

    useEffect(() => {
        checkEligibility();
    }, []);

    const getData = async () => {
        try {
            const response = await fetch(`${API_HOST}/accounts/dashboards/get/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                }
            });
            const json = await response.json();
            if (response.status !== 200) {
                setErrorMessages(json);
            } else {
                setData(json);
            }
        } catch (error) {
            setErrorMessages({ detail: error.message });
        }
    }

    const checkEligibility = async () => {
        try {
            setLoading(true)
            fetch(`${API_HOST}/accounts/check-eligibility/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                }
            }).then((response) => {
                return new Promise((resolve) => response.json()
                    .then((json) => resolve({
                        status: response.status,
                        json,
                    })));
            }).then(({ status, json }) => {
                if (status !== 200) {
                    setErrorMessages(json)
                } else {
                    if (json.eligible) {
                        setEligible(json.eligible)
                        setSurveyFilled(true)
                        getData();
                    }
                    setSurveyFilled(json.completed)
                }
            });
        } catch (error) {
            setErrorMessages({ detail: error.message });
        } finally {
            setLoading(false);
        }
    };

    const series = React.useMemo(
        () => ({
            type: 'bar'
        }),
        []
    )
    const axes = React.useMemo(
        () => [
            { primary: true, position: 'bottom', type: 'ordinal' },
            { position: 'left', type: 'linear', stacked: true },
        ],
        []
    )

    return (
        <div className="flex">
            <DashboardNav />
            <div className="flex-1 bg-gray-100 min-h-screen text-black p-8 font-poppins">
                <div className="bg-white rounded-xl shadow-lg p-5">
                    {loading ? (
                        <div>Checking Eligibility && Getting Data...</div>
                    ) : !surveyFilled ? (
                        <div>
                            You have not completed the survey to be eligible for carbon credits. Please proceed to
                            <Link to={"/account"} className="text-blue-500 hover:underline"> fill in questionnaire here.</Link>
                        </div>
                    ) : !eligible ? (
                        <div>Sorry! You are not eligible for carbon credits.</div>
                    ) : !(data?.energy && data.energy[0]?.data?.length) && !(data?.fuel && data.fuel[0]?.data?.length) ? (
                        <div>
                            Please submit Your Carbon Consumption in
                            <Link to={"/account"} className="text-blue-500 hover:underline"> My Documents.</Link>
                        </div>
                    ) : (
                        <div>
                            {data.energy && data.energy[0]?.data?.length && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold mb-4">Energy Consumption</h2>
                                    <div className="h-64">
                                        <Chart
                                            data={data.energy}
                                            series={series}
                                            axes={axes}
                                            tooltip
                                            onError={(error) => console.error('Chart error:', error)}
                                        />
                                    </div>
                                </div>
                            )}
                            {data.fuel && data.fuel[0]?.data?.length && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Fuel Consumption</h2>
                                    <div className="h-64">
                                        <Chart data={data.fuel} series={series} axes={axes} tooltip />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {renderErrorMessage('detail', errorMessages)}
                    {renderSubErrorMessage('error', 'user', errorMessages)}
                </div>
            </div>
        </div>
    );
};

export default MyDashboard;