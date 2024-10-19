import { useState } from 'react';
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { FaSearch } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";

const FAQItem = ({ question, answer, isOpen, toggleOpen, isLast }) => {
   return (
      <div className={`py-3 sm:py-4 ${!isLast ? 'border-b border-gray-200' : ''}`}>
         <button
            className="flex justify-between items-center w-full text-left"
            onClick={toggleOpen}
         >
            <span className="text-base sm:text-lg font-semibold text-[#093620] pr-2">{question}</span>
            <HiChevronDown
               className={`w-5 h-5 sm:w-6 sm:h-6 text-[#2B6E2B] transform ${isOpen ? 'rotate-180' : ''} flex-shrink-0`}
            />
         </button>
         {isOpen && (
            <div className="mt-2">
               <p className="text-sm sm:text-base text-gray-700">{answer}</p>
            </div>
         )}
      </div>
   );
};

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   const faqItems = [
      {
         question: "What is sustainability?",
         answer: "Sustainability is the practice of meeting current needs without compromising the ability of future generations to meet theirs."
      },
      {
         question: "What are carbon credits?",
         answer: "Carbon credits are permits that allow the holder to emit a certain amount of carbon dioxide or other greenhouse gases."
      },
      {
         question: "What is your product?",
         answer: "Our product is a SaaS solution that performs carbon accounting calculations and enables eligibility determination and carbon credits verification."
      },
      {
         question: "Can I sell carbon credits without standard body verification?",
         answer: "No, carbon credits must be verified by a recognized standard body to be sold."
      },
      {
         question: "What are the costs associated with the carbon credits verification process?",
         answer: "The costs vary depending on the project size and complexity, but generally include validation, verification, and issuance fees and range from 2500 US$ to 8000US$."
      },
      {
         question: "Does my business qualify for carbon credits?",
         answer: "Your business may qualify if it undertakes projects that reduce greenhouse gas emissions and meets the criteria set by standard bodies. We encourage you to create an account and provide us with high level data to determine eligibility."
      }
   ];

   const filteredFAQs = faqItems.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <div className="flex-grow bg-[#E1F3F5] py-8 sm:py-12">
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 font-poppins">
               <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-[#093620] text-center">
                  Frequently Asked Questions
               </h1>
               <div className="mb-6 sm:mb-8 relative">
                  <input
                     type="text"
                     placeholder="What are you looking for?"
                     className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B6E2B] text-sm sm:text-base"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
               </div>
               <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  {filteredFAQs.map((item, index) => (
                     <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        toggleOpen={() => setOpenIndex(openIndex === index ? null : index)}
                        isLast={index === filteredFAQs.length - 1}
                     />
                  ))}
               </div>
               <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-0 sm:mr-2">Can't find what you are looking for?</p>
                  <a href="/contact-us" className="inline-flex items-center justify-center bg-[#2B6E2B] text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-green-800 transition duration-300 text-sm sm:text-base">
                     <span>Contact Us</span>
                  </a>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default FAQ;
