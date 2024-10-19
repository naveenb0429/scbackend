import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronRight, HiMenuAlt3, HiX } from "react-icons/hi";
import SustainCredLogo from "../assets/images/logos/sustaincred-logo.svg";

const NavLink = ({ href, children, dropdownContent, className, onClick }) => {
    const [open, setOpen] = useState(false);
    const linkRef = useRef(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };


    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 300);
    };

    return (
        <div
            ref={linkRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative inline-block"
        >
            {onClick ? (
                <button onClick={onClick} className={`${className} relative group`}>
                    {children}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f4e4c5] transform origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 scale-x-0" />
                </button>
            ) : (
                <a href={href} className={`${className} relative group`}>
                    {children}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f4e4c5] transform origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 scale-x-0" />
                </a>
            )}
            {dropdownContent && open && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute bg-white text-black z-50 rounded-md shadow-lg mt-7"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {dropdownContent}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(['authtoken', 'expiry']);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = "px-3 py-2 rounded transition duration-300 ease-in-out hover:text-[#f4e4c5] cursor-pointer";

    const getHeaderOffset = () => {
        return window.innerWidth < 768 ? 64 : 80;
    };


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                const headerOffset = getHeaderOffset();
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            if (location.state?.scrollTo === id) {
                setTimeout(() => scrollToSection(id), 500);
            } else {
                scrollToSection(id);
            }
        }
    }, [location]);

    const handleAboutUsClick = () => {
        navigate('/');
        setTimeout(() => {
            scrollToSection('about');
        }, 100);
    };

    const handleSmoothScroll = (href) => {
        setOpenDropdown(null);
        setIsMenuOpen(false);

        if (href.startsWith('#')) {
            const id = href.slice(1);
            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: id } });
            } else {
                scrollToSection(id);
            }
        } else {
            navigate(href);
        }
    };

    const toggleDropdown = (name, event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenDropdown(prevState => prevState === name ? null : name);
    };

    const last_item = (cookies.authtoken && cookies.expiry && Date.now() < Date.parse(cookies.expiry)) ?
        { name: "My Account", href: "/account", current: false } :
        { name: "Login", href: "/login", current: false };

    const navigation = [
        { name: "About Us", href: "#about", current: false },
        {
            name: "SC-Solutions",
            href: "#sc-solutions",
            current: false,
            dropdown: [
                { name: "Renewable Energy", href: "/renewable-energy" },
                { name: "Waste Management", href: "/waste-management" },
                { name: "Plastic Alternatives", href: "/plastic-alternatives" },
            ]
        },
        { name: "Our Product", href: "#product", current: false },
        {
            name: "Sustain-Mart",
            href: "#sustain-mart",
            current: false,
            dropdown: [
                { name: "Renewable Energy Projects", href: "/renewable-energy-projects" },
                { name: "Waste Management Projects", href: "/waste-management-projects" },
                { name: "Plastic Alternative Projects", href: "/plastic-alternatives-projects" },
            ]
        },
        { name: "Blogs", href: "/blogs", current: false },
        last_item
    ];

    const handleItemClick = (item, event) => {
        event.preventDefault();
        if (item.dropdown) {
            toggleDropdown(item.name, event);
        } else {
            handleSmoothScroll(item.href);
        }
    };

    return (
        <div className="bg-navbarPrimary drop-shadow-navbar font-poppins sticky w-full top-0 z-50">
            <div className="container max-w-7xl mx-auto relative">
                {/* Desktop Header */}
                <div className="md:flex items-center justify-between h-14 lg:h-20 px-10 hidden">
                    <Link to="/"><img src={SustainCredLogo} className="xl:h-[70px] md:h-20" alt="sustaincred-logo" /></Link>
                    <div className="space-x-7 text-navbarTextColor hidden md:block">
                        <NavLink onClick={handleAboutUsClick} className={linkClass}>About Us</NavLink>
                        <NavLink className={linkClass} dropdownContent={
                            <div className="p-4 font-poppins whitespace-nowrap">
                                <Link to="/renewable-energy" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Renewable Energy</Link>
                                <Link to="/waste-management" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Waste Management</Link>
                                <Link to="/plastic-alternatives" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Plastic Alternatives</Link>
                            </div>
                        }>SC-Solutions</NavLink>
                        <NavLink href="/#product" className={linkClass}>Our Product</NavLink>
                        <NavLink className={linkClass} dropdownContent={
                            <div className="p-4 font-poppins whitespace-nowrap">
                                <Link to="/renewable-energy-projects" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Renewable Energy Projects</Link>
                                <Link to="/waste-management-projects" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Waste Management Projects</Link>
                                <Link to="/plastic-alternatives-projects" className="block py-2 px-4 text-sm hover:bg-gray-100 hover:underline">Plastic Alternative Projects</Link>
                            </div>
                        }>Sustain-Mart</NavLink>
                        {(cookies.authtoken && cookies.expiry && Date.now() < Date.parse(cookies.expiry))
                            ? <NavLink href="/account" className={linkClass}>Analytics Dashboard</NavLink>
                            : <Link to='/login' className="bg-transparent border border-white font-semibold text-white px-6 py-2 rounded-full hover:bg-white hover:text-navbarPrimary transition duration-300 ease-in-out shadow-md">Login</Link>}
                    </div>
                </div>

                {/* Mobile Header */}
                <nav className="md:hidden">
                    <div className="px-3 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 top-0 left-0 flex items-center">
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                    <img src={SustainCredLogo} className="h-12" alt="sustaincred-logo" />
                                </Link>
                            </div>

                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="relative inline-flex items-center justify-center rounded-md p-2 text-navbarTextColor font-medium focus:outline-none"
                                >
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {isMenuOpen ? (
                                        <HiX className="h-6 w-6" />
                                    ) : (
                                        <HiMenuAlt3 className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`${isMenuOpen ? 'block' : 'hidden'} px-2 pb-3 pt-2`}>
                        {navigation.map((item) => (
                            <div key={item.name} className="mb-2">
                                <button
                                    onClick={(e) => handleItemClick(item, e)}
                                    className={`w-full text-left flex justify-between items-center rounded-md px-3 py-2 text-base font-medium ${item.current ? "text-navbarTextColor" : "text-gray-300 hover:bg-navbarHover hover:text-navbarHoverText"}`}
                                >
                                    <span>{item.name}</span>
                                    {item.dropdown && (
                                        <HiChevronRight
                                            className={`h-5 w-5 transform transition-transform duration-200 ${openDropdown === item.name ? 'rotate-90' : ''}`}
                                        />
                                    )}
                                </button>
                                {item.dropdown && openDropdown === item.name && (
                                    <div className="pl-4 mt-2 space-y-2">
                                        {item.dropdown.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                to={subItem.href}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-navbarHover hover:text-navbarHoverText"
                                                onClick={() => {
                                                    setOpenDropdown(null);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;