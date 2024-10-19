import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrivacyNotice = () => {
   const [isOpen, setIsOpen] = useState(true);

   const handleClose = () => {
      setIsOpen(false);
   };

   if (!isOpen) return null;

   return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 p-4 shadow-lg font-poppins mx-2 mb-2 max-w-xs sm:mx-0 sm:mb-0 sm:bottom-2 sm:right-2 sm:left-auto sm:max-w-sm sm:rounded-lg sm:border">
         <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-green-900">Your Privacy</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </button>
         </div>
         <p className="text-sm mb-4 text-gray-900">
            Welcome to Sustaincred! We're glad you're here and want you to know that we respect your privacy and your right to control how we collect, use, and share your personal information. Please read our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> to learn about our privacy practices.
         </p>
         <button
            onClick={handleClose}
            className=" bg-navbarPrimary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
         >
            I understand
         </button>
      </div>
   );
};

export default PrivacyNotice;
