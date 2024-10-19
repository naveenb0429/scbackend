/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { API_HOST } from "../constants";
import DashboardNav from "./components/DashboardNav";
import YearSelector from "./components/YearSelector";
import EnergyConsumption from "./document-components/EnergyConsumption";
import FuelConsumption from "./document-components/FuelConsumption";
import CompanyVehicles from "./document-components/CompanyVehicles";
import SupplyChain from "./document-components/SupplyChain/SupplyChain.js";
import Transportation from "./document-components/Transportation";
import EndOfLifeProduct from "./document-components/EndOfLifeProduct";
import Finance from "./document-components/Finance";
import AdditionalQuestion from "./document-components/AdditionalQuestion";

const DASHBOARD_ITEMS = [
    { label: 'Company Vehicles', key: 'company', component: CompanyVehicles, showYearSelector: false },
    { label: 'End Of Life - Product', key: 'end-of-life', component: EndOfLifeProduct, showYearSelector: true },
    { label: 'Fuel Consumption', key: 'fuel', component: FuelConsumption, showYearSelector: true },
    { label: 'Energy Consumption', key: 'energy', component: EnergyConsumption, showYearSelector: true },
    { label: 'Transportation', key: 'transport', component: Transportation, showYearSelector: true },
    { label: 'Supply Chain', key: 'supply', component: SupplyChain, showYearSelector: true },
    { label: 'Finance', key: 'finance', component: Finance, showYearSelector: true },
    { label: 'Additional Question', key: 'additional-question', component: AdditionalQuestion, showYearSelector: false },
];

const MyDashboard = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [eligible, setEligible] = useState(false);
    const [surveyFilled, setSurveyFilled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['authtoken']);
    const [errorMessages, setErrorMessages] = useState({});
    const [activeTab, setActiveTab] = useState('company');
    const [user] = useState({ 'name': 'Naveen' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_HOST}/accounts/check-eligibility/`, {
                    method: "POST",
                    headers: { 'Authorization': 'Token ' + cookies.authtoken }
                });
                const json = await response.json();
                if (response.status !== 200) setErrorMessages(json);
                else {
                    setEligible(json.eligible);
                    setSurveyFilled(json.completed || json.eligible);
                }
            } catch (error) {
                setErrorMessages({ detail: error.message });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cookies.authtoken]);

    const handleSkip = useCallback(() => {
        const currentIndex = DASHBOARD_ITEMS.findIndex(item => item.key === activeTab);
        const nextIndex = (currentIndex + 1) % DASHBOARD_ITEMS.length;
        setActiveTab(DASHBOARD_ITEMS[nextIndex].key);
    }, [activeTab]);

    const activeItem = DASHBOARD_ITEMS.find(item => item.key === activeTab);
    const { component: ActiveComponent, showYearSelector = false } = activeItem || {};

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardNav />
            <div className="flex-1 overflow-y-auto bg-gray-100 text-black p-4 font-poppins">
                <div className="bg-white rounded-xl shadow-lg p-5 mb-5 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Hey <span className="text-lg">👋</span> Welcome {user.name}! </h1>
                    {showYearSelector && (
                        <div className="flex items-center">
                            <span className="mr-3 font-medium text-gray-600">Select Financial Year:</span>
                            <YearSelector onSelect={(_, year) => setSelectedYear(year)} />
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5">
                    <div className="flex border-b mb-6">
                        {DASHBOARD_ITEMS.map(item => (
                            <button
                                key={item.key}
                                className={`px-4 py-2 text-sm mr-2 font-medium transition-all duration-200 ease-in-out rounded-t-md ${activeTab === item.key
                                    ? 'bg-green-700 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => setActiveTab(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8">
                        {ActiveComponent && <ActiveComponent year={selectedYear} onSkip={handleSkip} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDashboard;