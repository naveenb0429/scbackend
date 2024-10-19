import { Link } from "react-router-dom";
import SustainCredLogo from "../assets/images/logos/sustaincred-logo.svg";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { scrollToElement } from "../utils/scrollHelpers";

const Footer = () => {
  return (
    <footer className="bg-navbarPrimary text-navbarTextColor font-poppins pt-16 pb-4">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between md:pb-4">
          <div className="lg:w-1/3 mb-12 lg:mb-0 flex flex-col items-start">
            <Link to="/" className="inline-block mb-4">
              <img
                src={SustainCredLogo}
                className="w-20"
                alt="SustainCred logo"
                loading="lazy"
              />
            </Link>

            <p className="text-base mb-6 text-center lg:text-left">Where sustainability meets credibility</p>

            {/* Social media icons */}
            <div className="flex space-x-4">
              <a
                href="https://x.com/Sustaincred"
                target="_blank"
                rel="noreferrer"
                aria-label="SustainCred on X"
                className="text-[#e2f4f7] hover:text-white transition-colors duration-200"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/sustaincred"
                target="_blank"
                rel="noreferrer"
                aria-label="SustainCred on LinkedIn"
                className="text-[#e2f4f7] hover:text-white transition-colors duration-200"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/sustaincred"
                target="_blank"
                rel="noreferrer"
                aria-label="SustainCred on Instagram"
                className="text-[#e2f4f7] hover:text-white transition-colors duration-200"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right-aligned columns */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company column */}
            <nav aria-labelledby="company-heading">
              <h2 id="company-heading" className="font-medium text-white text-lg mb-4">
                Company
              </h2>
              <ul className="space-y-4 text-[#e2f4f7] text-sm">
                <li>
                  <a
                    href="#our-approach"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElement("our-approach");
                    }}
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Our Approach
                  </a>
                </li>
                <li>
                  <Link
                    to="/research-and-discovery"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Research and Discovery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Product column */}
            <nav aria-labelledby="product-heading">
              <h2 id="product-heading" className="font-medium text-white text-lg mb-4">
                Product
              </h2>
              <ul className="space-y-4 text-[#e2f4f7] text-sm">
                <li>
                  <a
                    href="#product-overview"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElement("product-overview");
                    }}
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Product Overview
                  </a>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/information-security"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Information Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Cookie Settings column */}
            <nav aria-labelledby="cookie-settings-heading">
              <h2 id="cookie-settings-heading" className="font-medium text-white text-lg mb-4">
                Cookie Settings
              </h2>
              <ul className="space-y-4 text-[#e2f4f7] text-sm">
                <li>
                  <Link
                    to="/general-terms"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    General Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/data-security"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Data Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie-policy"
                    className="hover:text-[#62ac74] transition-colors duration-200 focus:outline-none focus:text-[#62ac74]"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-t border-[#FEFEFE] border-opacity-30 mt-8"></div>

        {/* Copyright and links */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} SustainCred All Rights Reserved</p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link
              to="/terms-and-conditions"
              className="hover:underline transition-colors duration-200 focus:outline-none focus:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:underline transition-colors duration-200 focus:outline-none focus:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;