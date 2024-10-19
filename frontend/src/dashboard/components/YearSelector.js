import React, { useState } from "react";
import { DASHBOARD_YEARS } from "../../constants";

const YearSelector = ({ onSelect }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleYearSelect = (event) => {
        const selectedValue = event.target.value;
        setSelectedYear(selectedValue);
        onSelect(0, selectedValue);
    };

    return (
        <div className="relative inline-block font-poppins">
            <select
                value={selectedYear}
                onChange={handleYearSelect}
                className="appearance-none border border-gray-300 text-gray-700 py-1 px-2 pr-6 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-600 text-sm"
            >
                {DASHBOARD_YEARS.map((option) => (
                    <option key={option} value={option}>
                        FY {option}-{(option % 100 + 1).toString().padStart(2, '0')}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};

export default YearSelector;