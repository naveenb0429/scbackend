import { Link } from 'react-router-dom';
import Header from '../layouts/Header';

export default function ResearchAndDiscovery() {
   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen">
            <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12 font-poppins">
               <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                  <span className="text-[#093620]">Research and Discovery</span>
               </h1>
               <div className="space-y-6 sm:space-y-8">
                  <section>
                     <p className="text-base sm:text-lg text-gray-700 mb-4">
                        Our Research and Discovery initiatives are currently in progress. We are actively working on developing innovative solutions and insights to drive sustainability and corporate responsibility.
                     </p>
                  </section>

                  <section>
                     <h2 className="text-xl sm:text-2xl font-semibold text-[#093620] mb-3 sm:mb-4">Contact Us</h2>
                     <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                        If you have any questions about our research efforts or potential collaborations, please don't hesitate to reach out:
                     </p>
                     <p className="text-sm sm:text-base text-gray-700">
                        Email: <a href="mailto:research@sustaincred.com" className="text-blue-600 font-semibold hover:underline">research@sustaincred.com</a>
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
