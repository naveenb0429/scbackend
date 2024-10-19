import PeriodSelector from './PeriodSelector';
import MonthSelector from './MonthSelector';

const PeriodAndMonthSelector = ({ selectedPeriod, handlePeriodChange, selectedMonth, handleMonthChange }) => {
   return (
      <div className="flex items-center mb-8 font-poppins">
         <PeriodSelector
            selectedPeriod={selectedPeriod}
            handlePeriodChange={handlePeriodChange}
         />
         {selectedPeriod === 'month' && (
            <div className="ml-4">
               <MonthSelector
                  selectedMonth={selectedMonth}
                  handleMonthChange={handleMonthChange}
               />
            </div>
         )}
      </div>
   );
};

export default PeriodAndMonthSelector;
