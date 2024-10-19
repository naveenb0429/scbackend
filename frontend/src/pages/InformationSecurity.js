import { Link } from 'react-router-dom';
import Header from '../layouts/Header';

export default function InformationSecurity() {
   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen">
            <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-12 font-poppins">
               <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                  <span className="text-[#093620]">Information Security Policy</span>
               </h1>
               <div className="space-y-6 sm:space-y-8">
                  <section>
                     <p className="text-base sm:text-lg text-gray-700 mb-4">
                        Our Information Security Policy is currently under development. We are working diligently to create a comprehensive policy that will ensure the protection of our systems, data, and users.
                     </p>
                  </section>

                  <section>
                     <h2 className="text-xl sm:text-2xl font-semibold text-[#093620] mb-3 sm:mb-4">Contact Us</h2>
                     <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                        If you have any questions or concerns about our information security practices, please don't hesitate to reach out:
                     </p>
                     <p className="text-sm sm:text-base text-gray-700">
                        Email: <a href="mailto:security@sustaincred.com" className="text-blue-600 font-semibold hover:underline">team@sustaincred.com</a>
                     </p>
                  </section>
               </div>

               <div className="mt-8 sm:mt-12">
                  <Link to="/" className="inline-flex items-center bg-[#2B6E2B] text-white 
                  font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-green-800 transition 
                  duration-300 text-xs sm:text-sm">
                     Back to Home
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
}
