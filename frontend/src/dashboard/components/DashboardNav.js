import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileTextIcon, BarChartIcon, CreditCardIcon, HomeIcon, SettingsIcon, DatabaseIcon } from "lucide-react";

const DashboardNav = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const path = window.location.pathname.split('/')[1];
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { path: "account", icon: HomeIcon, label: "Account" },
        { path: "documents", icon: FileTextIcon, label: "Documents" },
        { path: "additional-data", icon: DatabaseIcon, label: "Additional Data" },
        { path: "invoice", icon: CreditCardIcon, label: "Invoices" },
        { path: "dashboard", icon: BarChartIcon, label: "Analytics" },
    ];

    return (
        <div className="w-fit min-w-[15%] max-w-[20%] flex flex-col h-screen bg-[#1b211b] text-white overflow-y-auto font-poppins">
            <div className="flex justify-start w-full p-4 items-center">
                <Link to={'/'} className="flex items-center space-x-3">
                    <img
                        src={require("../../assets/images/logos/logo.png")}
                        className="w-10 h-10 rounded-full border border-white"
                        alt="Logo"
                    />
                    <p className="text-2xl font-semibold">Sustaincred</p>
                </Link>
            </div>
            <nav className="flex-grow overflow-y-auto">
                <div className="flex flex-col space-y-2 p-4">
                    {navItems.map(({ path: itemPath, icon: Icon, label }) => (
                        <Link
                            key={itemPath}
                            to={`/${itemPath}`}
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${path === itemPath ? "bg-green-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-green-600"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="mt-auto p-4 relative">
                <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Gray&eyeType=Wink&eyebrowType=Default&mouthType=Smile&skinColor=Light
"
                            alt="User Avatar"
                            onClick={() => navigate('/account')}
                            className="w-8 h-8 rounded-full cursor-pointer object-cover"
                        />
                        <div className="flex-grow cursor-pointer" onClick={() => navigate('/account')}>
                            <p className="font-medium text-sm">Naveen</p>
                            <p className="text-xs text-gray-400">naveen.b@sustaincred.com</p>
                        </div>
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="p-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200"
                        >
                            <SettingsIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {isProfileMenuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute bottom-full left-0 mb-2 w-full bg-[#2c332c] text-white rounded-lg shadow-lg overflow-hidden"
                        style={{ bottom: 'calc(100% - 16px)' }}
                    >
                        {[{ to: "/change-password", label: "Change Password" }, { to: "/logout", label: "Logout" }, { to: "/logout-all", label: "Logout All Devices" }].map(({ to, label }) => (
                            <Link key={to} to={to} className="block px-4 py-2 hover:bg-[#3a423a] text-sm">
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardNav;
