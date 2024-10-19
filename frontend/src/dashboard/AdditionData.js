import { useState } from "react";
import DashboardNav from "./components/DashboardNav";
import YearSelector from "./components/YearSelector";
import SupplyChain from "./document-components/SupplyChain/SupplyChain";
import Transportation from "./document-components/Transportation";

const DASHBOARD_ITEMS = [
   { label: 'Transportation', key: 'transport', component: Transportation },
   { label: 'Supply Chain', key: 'supply', component: SupplyChain },
];

const AdditionalData = () => {
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   const [activeTab, setActiveTab] = useState('transport');
   const [user] = useState({ 'name': 'Naveen' });

   const activeItem = DASHBOARD_ITEMS.find(item => item.key === activeTab);
   const { component: ActiveComponent } = activeItem || {};

   return (
      <div className="flex h-screen overflow-hidden">
         <DashboardNav />
         <div className="flex-1 overflow-y-auto bg-gray-100 text-black p-4 font-poppins">
            <div className="bg-white rounded-xl shadow-lg p-5 mb-5 flex justify-between items-center">
               <h1 className="text-xl font-bold text-gray-800">Hey <span className="text-lg">👋</span> Welcome {user.name}! </h1>
               <div className="flex items-center">
                  <span className="mr-3 font-medium text-gray-600">Select Financial Year:</span>
                  <YearSelector onSelect={(_, year) => setSelectedYear(year)} />
               </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-5">
               <div className="flex border-b mb-6">
                  {DASHBOARD_ITEMS.map(item => (
                     <button
                        key={item.key}
                        className={`px-4 py-2 text-[0.9rem] mr-2 font-medium transition-all duration-200 ease-in-out rounded-t-md ${activeTab === item.key
                           ? 'bg-green-700 text-white'
                           : 'text-gray-600 hover:bg-gray-100'
                           }`}
                        onClick={() => setActiveTab(item.key)}
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
               <div className="mt-8">
                  {ActiveComponent && (
                     <ActiveComponent
                        year={selectedYear}
                        showPeriodSelector={false}
                        headingText="Submit Transportation Data for the Previous Financial Years"
                     />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdditionalData;