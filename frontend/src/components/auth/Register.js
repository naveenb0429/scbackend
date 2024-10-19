import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_HOST } from "../../constants";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaPhone, FaBuilding, FaMapMarkerAlt, FaCity, FaMapPin, FaGlobe, FaGlobeAmericas, FaUserTie, FaIndustry } from 'react-icons/fa';
import sustaincredLogo from "../../assets/images/logos/sustaincred-white-logo.svg"
import { REGIONS, COUNTRIES_BY_REGION } from "../../constants";

const Register = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [registerButtonText, setRegisterButtonText] = useState("Sign Up");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countries, setCountries] = useState([]);
    let navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        const { firstname, lastname, email, password, mobile, company, location, city, zipCode, country, region, role, industry } = event.target.elements;

        const data = {
            phone_number: mobile.value,
            email: email.value,
            password: password.value,
            first_name: firstname.value,
            last_name: lastname.value,
            company: company.value,
            location: location.value,
            city: city.value,
            zip_code: zipCode.value,
            country: country.value,
            region: region.value,
            job_role: role.value,
            industry: industry.value
        };

        setRegisterButtonText("Creating your account...");

        fetch(`${API_HOST}/accounts/create-user/`, {
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
                        email: json.email,
                        password: json.password,
                        mobile: json.phone_number,
                        firstname: json.first_name,
                        lastname: json.last_name,
                        company: json.company,
                        role: json.job_role || json.non_field_errors,
                    });
                    break;
                case 201:
                case 200:
                    setErrorMessages({});
                    navigate("/verify-otp", { state: { email: email.value } });
                    break;
                case 500:
                default:
                    setErrorMessages({});
                    handleUnexpected({ status, json, ok });
            }
            setRegisterButtonText("Sign Up");
        }).catch(err => {
            handleUnexpected(err);
        });
    };

    const handleUnexpected = (status, json, ok) => {
        setErrorMessages({ "others": `Error registering user. Response Code: ${status}` });
    };

    const renderErrorMessage = (name) =>
        errorMessages[name] && (<div className="text-red-600 text-sm mt-1">{errorMessages[name]}</div>);

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleRegionChange = (event) => {
        const selectedRegion = event.target.value;
        setCountries(COUNTRIES_BY_REGION[selectedRegion] || []);
    };

    return (
        <>
            <div className="bg-[#E1F3F5] min-h-screen md:h-[70vh] flex justify-center py-6 sm:py-10 px-4 overflow-y-auto">
                <div className="flex flex-col md:flex-row w-full max-w-7xl shadow-lg overflow-hidden rounded-lg h-full">
                    {/* Mobile View - Left Side */}
                    <div className="w-full md:w-1/2 bg-[#577451] text-white p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center md:hidden">
                        <Link to="/">
                            <img
                                src={sustaincredLogo}
                                alt="SustainCred Logo"
                                className="w-32 h-auto mb-4 cursor-pointer"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-center mb-2 font-merriweather">SustainCred</h1>
                        <p className="text-lg text-center mb-6">Where Sustainability meets Credibility</p>
                    </div>
                    {/* Desktop View - Left Side */}
                    <div className="hidden md:block md:w-1/2 relative bg-[#577451] text-white">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                            <Link to="/">
                                <img
                                    src={sustaincredLogo}
                                    alt="SustainCred Logo"
                                    className="w-40 h-auto mb-6 cursor-pointer"
                                />
                            </Link>
                            <h1 className="text-3xl font-bold text-center mb-2 font-merriweather">SustainCred</h1>
                            <p className="text-xl text-center">Where Sustainability meets Credibility</p>
                        </div>
                    </div>
                    {/* Registration Form */}
                    <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 lg:p-12 overflow-y-auto scrollbar-hide h-full">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Create an account</h2>
                            <p className="mb-8 text-sm text-gray-800">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#2558E5] font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* First and Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstname"
                                            name="firstname"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="First Name"
                                            required
                                        />
                                        {renderErrorMessage("firstname")}
                                    </div>
                                    <div>
                                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastname"
                                            name="lastname"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Last Name"
                                            required
                                        />
                                        {renderErrorMessage("lastname")}
                                    </div>
                                </div>
                                {/* Email Address */}
                                <div className="relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Email Address"
                                            required
                                        />
                                    </div>
                                    {renderErrorMessage("email")}
                                </div>
                                {/* Password */}
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="block w-full pl-10 pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Password"
                                            required
                                            minLength="8"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('password')}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                                    {renderErrorMessage("password")}
                                </div>
                                {/* Confirm Password */}
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Re-type Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="block w-full pl-10 pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Re-type Password"
                                            required
                                            minLength="8"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Mobile Number */}
                                <div className="relative">
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                        Mobile Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Mobile Number"
                                            required
                                        />
                                    </div>
                                    {renderErrorMessage("mobile")}
                                </div>
                                {/* Company Name */}
                                <div className="relative">
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaBuilding className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Company Name"
                                            required
                                        />
                                    </div>
                                    {renderErrorMessage("company")}
                                </div>
                                {/* Company Location */}
                                <div className="relative">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Company Location
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Company Location"
                                            required
                                        />
                                    </div>
                                    {renderErrorMessage("location")}
                                </div>
                                {/* City */}
                                <div className="relative">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCity className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Zip Code */}
                                <div className="relative">
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                        Zip Code
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaMapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Zip Code"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Region */}
                                <div className="relative">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                                        Region
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="region"
                                            name="region"
                                            className="block w-full pl-10 pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 appearance-none bg-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            required
                                            onChange={handleRegionChange}
                                        >
                                            <option value="" disabled selected>
                                                Select region
                                            </option>
                                            {REGIONS.map(region => (
                                                <option key={region.value} value={region.value}>
                                                    {region.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaGlobeAmericas className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Country */}
                                <div className="relative">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="country"
                                            name="country"
                                            className="block w-full pl-10 pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 appearance-none bg-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            required
                                        >
                                            <option value="" disabled selected>
                                                Select country
                                            </option>
                                            {countries.map((country, index) => (
                                                <option key={index} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaGlobe className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Your Role */}
                                <div className="relative">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Your Role
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUserTie className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="role"
                                            name="role"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Your Role"
                                            required
                                        />
                                    </div>
                                    {renderErrorMessage("role")}
                                </div>
                                {/* Industry Type */}
                                <div className="relative">
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                                        Industry Type
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaIndustry className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="industry"
                                            name="industry"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="Industry Type"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Terms and Conditions */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-600">
                                        By clicking Sign Up, you are indicating that you have read and agree to the Terms of Service and Privacy Policy.
                                    </label>
                                </div>
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#577451] text-white py-2 px-4 rounded-md hover:bg-[#486043] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    {registerButtonText}
                                </button>
                                {/* Other Errors */}
                                {renderErrorMessage("others")}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;