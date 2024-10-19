import { ChevronDown, ChevronUp } from "lucide-react";

export default function SubPart({
   index,
   part,
   handleSubPartChange,
   removeSubPart,
   errorMessages,
   expandedParts,
   toggleExpand
}) {
   return (
      <div key={index} className="p-4 border rounded-lg bg-white shadow-sm relative mb-4">
         <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-left">Raw Material Part {index + 1}</h4>
            <div className="flex items-center space-x-2">
               <button
                  type="button"
                  onClick={() => toggleExpand(index)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={expandedParts.includes(index) ? `Collapse Sub-part ${index + 1}` : `Expand Sub-part ${index + 1}`}
               >
                  {expandedParts.includes(index) ? <ChevronUp /> : <ChevronDown />}
               </button>
               <button
                  type="button"
                  onClick={() => removeSubPart(index)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                  aria-label={`Remove Sub-part ${index + 1}`}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
               </button>
            </div>
         </div>
         {expandedParts.includes(index) && (
            <div className="space-y-4">
               <div>
                  <label htmlFor={`subPartName${index}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                     Sub part/raw material name:
                  </label>
                  <input
                     id={`subPartName${index}`}
                     type="text"
                     value={part.name}
                     onChange={(e) => handleSubPartChange(index, 'name', e.target.value)}
                     className={`w-full border ${errorMessages[`subParts.${index}.name`] ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                     placeholder="Enter name"
                     aria-invalid={!!errorMessages[`subParts.${index}.name`]}
                     aria-describedby={`subPartName${index}-error`}
                  />
                  {errorMessages[`subParts.${index}.name`] && (
                     <p id={`subPartName${index}-error`} className="text-red-500 text-xs mt-1">
                        {errorMessages[`subParts.${index}.name`]}
                     </p>
                  )}
               </div>
               <div className="flex space-x-4">
                  <div className="flex-1">
                     <label htmlFor={`quantity${index}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                        Quantity:
                     </label>
                     <input
                        id={`quantity${index}`}
                        type="number"
                        value={part.quantity}
                        onChange={(e) => handleSubPartChange(index, 'quantity', e.target.value)}
                        className={`w-full border ${errorMessages[`subParts.${index}.quantity`] ? 'border-red-500' : 'border-gray-300'
                           } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter quantity"
                        aria-invalid={!!errorMessages[`subParts.${index}.quantity`]}
                        aria-describedby={`quantity${index}-error`}
                     />
                     {errorMessages[`subParts.${index}.quantity`] && (
                        <p id={`quantity${index}-error`} className="text-red-500 text-xs mt-1">
                           {errorMessages[`subParts.${index}.quantity`]}
                        </p>
                     )}
                  </div>
                  <div className="flex-1">
                     <label htmlFor={`unit${index}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                        Unit:
                     </label>
                     <div className="relative">
                        <select
                           id={`unit${index}`}
                           value={part.unit}
                           onChange={(e) => handleSubPartChange(index, 'unit', e.target.value)}
                           className="w-full appearance-none border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        >
                           <option value="kgs">KGS</option>
                           <option value="tons">TONS</option>
                           <option value="lts">LTS</option>
                        </select>
                        <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                     </div>
                     {errorMessages[`subParts.${index}.unit`] && (
                        <p id={`unit${index}-error`} className="text-red-500 text-xs mt-1">
                           {errorMessages[`subParts.${index}.unit`]}
                        </p>
                     )}
                  </div>
               </div>
               <div className="flex space-x-4">
                  <div className="flex-1">
                     <label htmlFor={`cost${index}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                        Cost:
                     </label>
                     <input
                        id={`cost${index}`}
                        type="number"
                        value={part.cost}
                        onChange={(e) => handleSubPartChange(index, 'cost', e.target.value)}
                        className={`w-full border ${errorMessages[`subParts.${index}.cost`] ? 'border-red-500' : 'border-gray-300'
                           } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                        placeholder="Enter cost"
                        aria-invalid={!!errorMessages[`subParts.${index}.cost`]}
                        aria-describedby={`cost${index}-error`}
                     />
                     {errorMessages[`subParts.${index}.cost`] && (
                        <p id={`cost${index}-error`} className="text-red-500 text-xs mt-1">
                           {errorMessages[`subParts.${index}.cost`]}
                        </p>
                     )}
                  </div>
                  <div className="flex-1">
                     <label htmlFor={`currency${index}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                        Currency:
                     </label>
                     <div className="relative">
                        <select
                           id={`currency${index}`}
                           value={part.currency}
                           onChange={(e) => handleSubPartChange(index, 'currency', e.target.value)}
                           className="w-full appearance-none border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        >
                           <option value="dollars">USD</option>
                           <option value="rupees">INR</option>
                        </select>
                        <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                     </div>
                     {errorMessages[`subParts.${index}.currency`] && (
                        <p id={`currency${index}-error`} className="text-red-500 text-xs mt-1">
                           {errorMessages[`subParts.${index}.currency`]}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}