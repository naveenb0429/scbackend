import { useState, useCallback } from 'react';
import { MdEmail } from 'react-icons/md';

const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }) => {
   const [email, setEmail] = useState('');

   const handleSubmit = useCallback((e) => {
      e.preventDefault();
      onSubmit(email);
   }, [email, onSubmit]);

   const handleOverlayClick = useCallback((e) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   }, [onClose]);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
         <div className="bg-white max-w-md w-full h-auto min-h-[30vh] flex flex-col justify-between p-4 sm:p-8 m-3 lg:m-0 rounded-lg shadow-lg">
            <div>
               <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
               <form onSubmit={handleSubmit}>
                  <div className="mb-4 sm:mb-8">
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                     <div className="relative">
                        <input
                           type="email"
                           id="email"
                           className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 pl-12 text-base focus:outline-none focus:ring-green-500 focus:border-green-500"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                        />
                        <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                     </div>
                  </div>
                  <button
                     type="submit"
                     className="w-full bg-[#297D55] text-white py-2 sm:py-3 px-4 rounded-md text-base font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                     SUBMIT
                  </button>
               </form>
            </div>
            <div className="mt-8 text-center text-base">
               <p>Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></p>
            </div>
         </div>
      </div>
   );
};

export default ForgotPasswordModal;