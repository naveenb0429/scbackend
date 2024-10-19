import { MONTHS } from "../../constants";

const MonthSelector = ({ selectedMonth, handleMonthChange }) => {
   return (
      <div className="flex items-center">
         <label htmlFor="month-select" className="mr-2 font-medium">Select Month:</label>
         <div className="relative inline-block">
            <select
               id="month-select"
               value={selectedMonth}
               onChange={handleMonthChange}
               className="appearance-none border border-gray-300 text-gray-700 py-1 px-2 pr-6 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-600 text-sm"
            >
               <option value="">Select a month</option>
               {MONTHS.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                     {month}
                  </option>
               ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
               <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
               </svg>
            </div>
         </div>
      </div>
   );
};

export default MonthSelector;