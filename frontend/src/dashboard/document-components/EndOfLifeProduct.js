import { useEffect, useState, useCallback } from "react";
import { API_HOST } from "../../constants";
import { useCookies } from "react-cookie";
import { renderErrorMessage } from "../../utils/utils";
import SubmitButton from "../../components/ui/SubmitButton";
import SkipButton from "../../components/ui/SkipButton";

export default function EndOfLifeProduct({ year, onSkip }) {
   const PRODUCT_TYPES = ["Land Fill Products", "Composting", "Incineration (Burning)", "Recycling"];
   const [productValue, setProductValue] = useState('');
   const [cookies] = useCookies(['authtoken']);
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [errorMessages, setErrorMessages] = useState({});

   const fetchEndOfLifeData = useCallback(async () => {
      setLoading(true);
      try {
         const formData = new FormData();
         formData.append('financial_year', year);
         const response = await fetch(`${API_HOST}/accounts/end-of-life/get/`, {
            method: "POST",
            headers: {
               'Authorization': 'Token ' + cookies.authtoken
            },
            body: formData
         });

         if (!response.ok) {
            throw new Error('Failed to fetch data');
         }

         const result = await response.json();
         setData(result);
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }, [year, cookies.authtoken]);

   useEffect(() => {
      fetchEndOfLifeData();
   }, [fetchEndOfLifeData]);

   const submitEndOfLife = (event) => {
      event.preventDefault();
      const form = event.target
      const formData = new FormData(form)
      fetch(`${API_HOST}/accounts/end-of-life/update/`, {
         method: "POST",
         headers: {
            'Authorization': 'Token ' + cookies.authtoken,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            financial_year: year,
            product_type: formData.get('productType'),
            product_value: formData.get('productValue'),
            product_name: formData.get('productName'),
            product_unit: formData.get('productUnit')
         })
      }).then((response) => {
         return new Promise((resolve) => response.json()
            .then((json) => resolve({
               status: response.status,
               json,
            })));
      }).then(({ status, json }) => {
         if (status !== 200) setErrorMessages(json)
         else {
            fetchEndOfLifeData();
            setErrorMessages({ detail: 'Data is submitted successfully' })
         }
      }).catch(error => {
         setErrorMessages({ detail: 'An error occurred while submitting the data' });
      })
   }

   const handleSkip = () => {
      if (onSkip) {
         onSkip();
      }
   };

   return (
      <div className="p-4 space-y-8 text-center border rounded overflow-hidden">
         <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
               Submit Data regarding Disposal of the Product for the Financial Year {year}
            </h2>
            <form onSubmit={submitEndOfLife} className="space-y-6 text-left" aria-labelledby="form-title">
               <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
                  <div>
                     <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Disposal
                     </label>
                     <select
                        id="productType"
                        name="productType"
                        required
                        aria-required="true"
                        aria-invalid={errorMessages.product_type ? "true" : "false"}
                        aria-describedby={errorMessages.product_type ? "productType-error" : undefined}
                        className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                     >
                        <option value="">Select disposal type</option>
                        {PRODUCT_TYPES.map((option) => (
                           <option key={option} value={option}>
                              {option}
                           </option>
                        ))}
                     </select>
                     {renderErrorMessage('product_type', errorMessages)}
                  </div>

                  <div>
                     <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                     </label>
                     <input
                        type="text"
                        id="productName"
                        name="productName"
                        required
                        aria-required="true"
                        aria-invalid={errorMessages.product_name ? "true" : "false"}
                        aria-describedby={errorMessages.product_name ? "productName-error" : undefined}
                        placeholder="Enter product name"
                        className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                     />
                     {renderErrorMessage('product_name', errorMessages)}
                  </div>

                  <div>
                     <label htmlFor="productValue" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Value
                        <span className="text-xs text-gray-500 ml-2">(Max 6 digits)</span>
                     </label>
                     <div className="flex space-x-2">
                        <input
                           type="number"
                           id="productValue"
                           name="productValue"
                           required
                           aria-required="true"
                           aria-invalid={errorMessages.product_value ? "true" : "false"}
                           aria-describedby={errorMessages.product_value ? "productValue-error" : undefined}
                           placeholder="Enter product value"
                           min="0"
                           max="999999"
                           className="flex-grow px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                           value={productValue}
                           onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 6) {
                                 setProductValue(value);
                              }
                           }}
                        />
                        <select
                           name="productUnit"
                           aria-label="Product Unit"
                           required
                           aria-required="true"
                           className="px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                           <option value="kg">KG</option>
                           <option value="tons">TONS</option>
                        </select>
                     </div>
                     {renderErrorMessage('product_value', errorMessages)}
                  </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="flex space-x-4 mb-4">
                     <SubmitButton>
                        Submit
                     </SubmitButton>
                     <SkipButton onClick={handleSkip}>
                        Skip
                     </SkipButton>
                  </div>
                  <div className="mt-4 text-center" aria-live="assertive">
                     {renderErrorMessage('detail', errorMessages)}
                  </div>
               </div>
               <div className="mt-4 text-center" aria-live="assertive">
                  {renderErrorMessage('detail', errorMessages)}
               </div>
            </form>
         </div>

         {data && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
               <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                     Previously Submitted End of Life Products for Financial Year {year}
                  </h3>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-gray-100">
                              <th className="px-4 py-2 border">Product Type</th>
                              <th className="px-4 py-2 border">Product Value</th>
                              <th className="px-4 py-2 border">Last Updated</th>
                           </tr>
                        </thead>
                        <tbody>
                           {data.map((item, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                 <td className="px-4 py-2 border">{item.product_type}</td>
                                 <td className="px-4 py-2 border font-semibold text-green-600">${item.product_value}</td>
                                 <td className="px-4 py-2 border">{item.update_time}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}
         {loading && <div>Loading...</div>}
         {error && <div>{error}</div>}

      </div>
   );
}