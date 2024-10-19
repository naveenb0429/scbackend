import { Link } from 'react-router-dom';
import Header from '../layouts/Header';

const PlasticAlternativeProjects = () => {
   return (
      <>
         <Header />
         <div className="bg-gradient-to-b from-[#E1F3F5] to-[#C5E8ED] min-h-screen">
            <div className="container max-w-4xl mx-auto px-4 py-12 font-poppins">
               <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                  <span className="text-[#093620]">Plastic Alternative Projects</span>
               </h1>
               <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <p className="text-lg text-gray-700 mb-6">
                     We are currently working with our clients to qualify for both carbon credits and plastic credits.
                  </p>
                  <div className="bg-[#E1F3F5] border-l-4 border-[#2B6E2B] p-4 rounded">
                     <p className="text-[#093620] font-medium">
                        In the next few weeks, we will be posting about their projects and their carbon credits.
                     </p>
                  </div>
               </div>

               <div className="mt-12 text-center">
                  <Link to="/" className="inline-flex items-center bg-[#2B6E2B] text-white font-medium py-3 px-6 rounded-full hover:bg-green-800 transition duration-300 group">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                     </svg>
                     Back to Home
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
};

export default PlasticAlternativeProjects;