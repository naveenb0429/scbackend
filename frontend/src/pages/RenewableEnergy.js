import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import renewableEnergyHeader from '../assets/images/sc-solutions/renewable-energy/renewable-energy.png';
import renewableEnergyContent from '../assets/images/sc-solutions/renewable-energy/renewable.png';

const RenewableEnergy = () => {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <img
               src={renewableEnergyHeader}
               alt="Renewable Energy Header"
               className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                  Renewable Energy
               </h1>
            </div>
         </div>
         <main className="flex-grow bg-[#e6f3f5] px-4 py-8 font-poppins">
            <div className="container mx-auto max-w-4xl">
               <section className="mb-8">
                  <p className="mb-4">
                     Renewable energy projects are those that generate energy from renewable sources and the electricity is sold to the grid. Examples include: Solar, wind, tidal.
                  </p>
                  <p className="mb-4">
                     Due to certain rule changes, not all renewable energy projects would qualify for carbon credits under major registries. Although GCC accepts renewable energy projects in <strong className="text-primary">MENATI (MIDDLE EAST, NORTH AFRICA, TURKEY AND INDIA)</strong> region, the upfront costs are high. Verra does not accept renewable projects with no excepts and Gold standard accepts renewable projects in exceptional cases
                  </p>
                  <div className="w-full h-auto max-w-2xl mx-auto mb-8 overflow-hidden rounded-lg shadow-lg">
                     <img src={renewableEnergyContent} alt="Renewable Energy Projects" />
                  </div>
                  <p className="mb-4">
                     For renewable energy projects, we assess readiness and probability of approval from gold standard based on the following factors:
                  </p>
                  <ul className="space-y-4 mt-4">
                     <li className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                        </div>
                        <strong className="text-primary">Location in Least Developed Countries (LDCs)</strong>
                     </li>
                     <li className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                        <strong className="text-primary">Financial Additionality</strong>
                     </li>
                     <li className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                           </svg>
                        </div>
                        <strong className="text-primary">Community Impact</strong>
                     </li>
                     <li className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-2 mr-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                           </svg>
                        </div>
                        <strong className="text-primary">Distributed Installations</strong>
                     </li>
                  </ul>
               </section>

               <section className="mb-8">
                  <p className="font-semibold mb-4">
                     We perform details stakeholder analysis and financial analysis to quantify the impact your project has on community and society. We also run various financial models and analyze additionality of your project as well as the opportunity cost of the project for the project developer.
                  </p>
                  <p className="mb-4">
                     If we receive design exception, SustainCred will then work you through the following steps to ensure a smooth process :
                  </p>
                  <ol className="list-decimal pl-6 space-y-4">
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Define the Project Boundary</h3>
                        <p>Identify the geographical and operational boundaries of the project. This includes the physical location and the scope of activities that will be considered for emissions reductions.</p>
                     </li>
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Determine the Baseline Scenario</h3>
                        <p>Establish what the emissions would be in the absence of the project. This involves identifying the current energy sources and their associated emissions. For example, if the project replaces a coal-fired power plant, the baseline would be the emissions from that plant.</p>
                     </li>
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Collect Data</h3>
                        <p>Gather historical data on energy consumption and emissions. This data should be accurate and verifiable, covering a period that is representative of typical operations.</p>
                     </li>
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Calculate Baseline Emissions</h3>
                        <p>Use the collected data to calculate the baseline emissions. This involves applying appropriate emission factors to the energy consumption data to estimate the greenhouse gas emissions that would occur without the project.</p>
                     </li>
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Document Assumptions and Methodologies</h3>
                        <p>Clearly document all assumptions, methodologies, and data sources used in the baseline study. This ensures transparency and allows for independent verification.</p>
                     </li>
                     <li className="mb-4">
                        <h3 className="font-bold text-lg text-primary mb-2">Validation</h3>
                        <p>Submit the baseline study for validation by an independent third-party auditor. The auditor will review the study to ensure it meets Gold Standard requirements and accurately represents the baseline emissions.</p>
                     </li>
                  </ol>
               </section>
            </div>
         </main>
         <Footer />
      </div>
   );
};

export default RenewableEnergy;
