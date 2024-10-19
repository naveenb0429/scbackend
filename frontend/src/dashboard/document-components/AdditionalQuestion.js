import { useState } from "react";

export default function AdditionalQuestion() {
   const [showMessage, setShowMessage] = useState(null);

   const handleResponse = (response) => {
      setShowMessage(response);
   };

   return (
      <div className="text-left p-2">
         <div className="p-4 border rounded bg-white shadow-md">
            {showMessage === null && (
               <div className="mt-8 mb-6 p-6">
                  <p className="text-center mb-4 text-lg font-medium text-gray-700">
                     Do you have data other than FY 2024 relevant for making of the product?
                  </p>
                  <div className="flex justify-center space-x-4">
                     <button
                        onClick={() => handleResponse(true)}
                        className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-[#157F3D] hover:text-white transition duration-300 ease-in-out flex items-center"
                     >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Yes
                     </button>
                     <button
                        onClick={() => handleResponse(false)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded hover:bg-gray-400 transition duration-300 ease-in-out flex items-center"
                     >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        No
                     </button>
                  </div>
               </div>
            )}

            {showMessage === true && (
               <div className="text-center mt-4 p-4 bg-blue-100 border border-blue-300 rounded-md">
                  <p className="text-lg text-blue-700 font-medium">
                     Thank you for submitting the documents!
                  </p>
                  <p className="mt-2 text-blue-600">
                     Please proceed to the <span className="font-bold">Additional Data</span> tab to provide your additional data.
                  </p>
               </div>
            )}

            {showMessage === false && (
               <div className="text-center mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
                  <p className="text-lg text-green-700 font-medium">
                     Thank you for submitting the documents!
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
