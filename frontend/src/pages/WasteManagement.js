import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import wasteManagementHeader from '../assets/images/sc-solutions/waste-management/waste-management-image1.png';
import wasteManagementContent from '../assets/images/sc-solutions/waste-management/waste-management-image2.png';

const WasteManagement = () => {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <img
               src={wasteManagementHeader}
               alt="Waste Management Header"
               className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                  Waste Management
               </h1>
            </div>
         </div>
         <main className="flex-grow bg-[#e6f3f5] px-4 py-8 font-poppins">
            <div className="container mx-auto max-w-4xl">
               <section className="mb-8">
                  <p className="mb-4">
                     We work with project developers and standards to qualify the following type of waste management projects for carbon credits:
                  </p>
                  <ul className="space-y-4 mt-4">
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Waste-to-Energy Projects:</strong>
                           <p>Projects that convert waste into energy, such as biogas or electricity, can qualify. This includes landfill gas capture and utilization.</p>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Composting:</strong>
                           <p>Projects that divert organic waste from landfills to composting facilities, reducing methane emissions.</p>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Recycling and Waste Diversion:</strong>
                           <p>Initiatives that increase recycling rates or divert waste from landfills to other uses, reducing the need for new raw materials and associated emissions.</p>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Improved Waste Management Practices:</strong>
                           <p>Projects that implement better waste management practices, such as improved collection and transportation methods that reduce emissions.</p>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Landfill Gas Capture:</strong>
                           <p>Projects that capture and utilize methane from landfills to generate energy or flare it to reduce emissions.</p>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                           </svg>
                        </div>
                        <div>
                           <strong className="text-primary">Waste Treatment and Disposal:</strong>
                           <p>Projects that improve waste treatment and disposal methods to reduce greenhouse gas emissions.</p>
                        </div>
                     </li>
                  </ul>
               </section>

               <section className="mb-8">
                  <div className="w-full h-auto max-w-2xl mx-auto mb-8 overflow-hidden rounded-lg shadow-lg">
                     <img
                        src={wasteManagementContent}
                        alt="Waste Management Process"
                     />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">How SustainCred Can Help</h2>
                  <p className="mb-4">
                     As an experienced sustainability consulting firm, we at SustainCred can significantly aid waste management project developers in navigating the complexities of qualifying for carbon credits. We provide expert guidance on meeting the stringent requirements of standards like Gold Standard and Verra, ensuring accurate baseline studies, robust monitoring systems, and thorough documentation. Our expertise helps in validating and registering projects, making the process smoother and more efficient.
                  </p>
                  <p className="mb-4">
                     We also play a crucial role in stakeholder engagement and community involvement, ensuring projects gain local support and deliver tangible benefits. We assist in financial analyses to demonstrate additionality, navigate regulatory landscapes, and secure funding opportunities. By implementing quality assurance processes and promoting innovative approaches, we enhance the project's credibility and marketability.
                  </p>
                  <p className="mb-4">
                     Moreover, we offer continuous support through performance monitoring, compliance audits, and sustainability reporting. We help projects achieve certification, access new markets, and optimize carbon credit sales. By fostering a culture of continuous improvement and aligning projects with global sustainability goals, we ensure long-term success and significant environmental and social impacts.
                  </p>
               </section>
            </div>
         </main>
         <Footer />
      </div>
   );
};

export default WasteManagement;