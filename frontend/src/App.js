import "./styles/App.css";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Blog from "./pages/Blog";
import Login from "./components/auth/Login";
import MyDashboard from "./dashboard/MyDashboard";
import Register from "./components/auth/Register";
import VerifyOTP from "./components/auth/VerifyOTP";
import Private from "./components/auth/ProtectedRoute";
import MyAccount from "./dashboard/MyAccount";
import MyDocuments from "./dashboard/MyDocuments";
import MyInvoice from "./dashboard/MyInvoice";
import AdditionalData from './dashboard/AdditionData';
import LogOut from "./dashboard/LogOut";
import ChangePassword from "./dashboard/ChangePassword";
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import Careers from "./pages/Careers";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import GeneralTerms from "./pages/GeneralTerms";
import DataSecurity from "./pages/DataSecurity";
import InformationSecurity from "./pages/InformationSecurity";
import ResearchAndDiscovery from "./pages/ResearchAndDiscovery";
import RequestDemo from './pages/RequestDemo';
import RenewableEnergy from './pages/RenewableEnergy';
import WasteManagement from './pages/WasteManagement';
import PlasticAlternatives from "./pages/PlasticAlternatives";
import RenewableEnergyProjects from './pages/RenewableEnergyProjects';
import WasteManagementProjects from "./pages/WasteManagementProjects";
import PlasticAlternativeProjects from "./pages/PlasticAlternativesProjects";

const App = () => {
    const ScrollTop = () => {
        const { pathname } = useLocation();
        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);
        return null;
    };
    return (
        <>
            <ScrollTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<Blog />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                <Route path="/login" element={<Private Component={Login} isLoginPage={true} />} />
                <Route path="/register" element={<Register />} isLoginPage={true} />
                <Route path="/verify-otp" element={<VerifyOTP />} isLoginPage={true} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/general-terms" element={<GeneralTerms />} />
                <Route path="/data-security" element={<DataSecurity />} />
                <Route path="/information-security" element={<InformationSecurity />} />
                <Route path="/research-and-discovery" element={<ResearchAndDiscovery />} />

                <Route path="/account" element={<Private Component={MyAccount} />} />
                <Route path="/dashboard" element={<Private Component={MyDashboard} />} />
                <Route path="/documents" element={<Private Component={MyDocuments} />} />
                <Route path="/invoice" element={<Private Component={MyInvoice} />} />
                <Route path="/additional-data" element={<Private Component={AdditionalData} />} />
                <Route path="/change-password" element={<Private Component={ChangePassword} />} />
                <Route path="/logout" element={<Private Component={LogOut} />} />
                <Route path="/logout-all" element={<Private Component={LogOut} />} />
                <Route path="/request-demo" element={<RequestDemo />} />
                <Route path="/renewable-energy" element={<RenewableEnergy />} />
                <Route path="/waste-management" element={<WasteManagement />} />
                <Route path="/plastic-alternatives" element={<PlasticAlternatives />} />
                <Route path="/renewable-energy-projects" element={<RenewableEnergyProjects />} />
                <Route path="/waste-management-projects" element={<WasteManagementProjects />} />
                <Route path="/plastic-alternatives-projects" element={<PlasticAlternativeProjects />} />
                <Route
                    path="*"
                    element={
                        <div className="flex items-center justify-center min-h-screen md:text-xl lg:text-3xl">
                            404 | Not Found
                        </div>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
