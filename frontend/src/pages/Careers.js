import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { HiOutlineMail } from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';

export default function Careers() {
   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen flex flex-col items-center p-4 py-8 sm:py-16 relative font-poppins">
            <h1 className="text-3xl sm:text-4xl font-bold py-4 sm:py-8 text-[#174E25] text-center">Careers at SustainCred</h1>
            <div className="max-w-5xl w-full bg-white rounded-lg overflow-hidden shadow-lg">
               <div className="relative h-48 sm:h-80">
                  <img
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                     alt="Careers at SustainCred"
                     className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                  <h2 className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 text-2xl sm:text-3xl font-bold text-white">Join Our Team</h2>
               </div>
               <div className="p-4 sm:p-8">
                  <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                     We currently do not have any open positions, but we are always looking for talent. If you're passionate about sustainability and want to make a difference, we'd love to hear from you!
                  </p>
                  <div className="bg-[#F0F8FF] border-l-4 border-[#174E25] p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
                     <h3 className="text-xl font-semibold mb-3 sm:mb-4 text-[#174E25]">How to Apply</h3>
                     <p className="text-gray-700 mb-3 sm:mb-4">
                        Please send us a quick note along with your CV, and we'll add you to our talent pool.
                     </p>
                     <div className="flex items-center space-x-2 text-[#174E25]">
                        <HiOutlineMail className="text-xl sm:text-2xl" />
                        <a href="mailto:team@cred4future.com" className="hover:underline text-sm sm:text-base">team@cred4future.com</a>
                     </div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-[#174E25]">Connect with us</h3>
                     <a href="https://www.linkedin.com/company/sustaincred" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-[#0077b4] text-white rounded-full">
                        <FaLinkedinIn className="text-xl sm:text-2xl" />
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
}
