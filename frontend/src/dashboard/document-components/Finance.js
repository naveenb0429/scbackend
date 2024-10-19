/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { API_HOST } from "../../constants";
import FileUploadInput, { INPUT_TYPES } from "./FileUploadInput";
import { renderErrorMessage } from "../../utils/utils";
import { Loader2 } from "lucide-react";
import SubmitButton from "../../components/ui/SubmitButton";

export default function Finance({ year }) {
   const [cookies] = useCookies(['authtoken']);
   const [files, setFiles] = useState([]);
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [preview, setPreview] = useState(true);
   const [errorMessages, setErrorMessages] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   const fetchFinanceData = useCallback(async () => {
      try {
         const formData = new FormData();
         formData.append('financial_year', year)
         const response = await fetch(`${API_HOST}/accounts/finance/get/`, {
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
         setErrorMessages({ previous_data: error.message });
      } finally {
         setLoading(false);
      }
   }, [year, cookies.authtoken]);

   useEffect(() => {
      fetchFinanceData();
   }, [fetchFinanceData]);

   const handleFinanceSubmission = async (event) => {
      event.preventDefault();
      if (files.length === 0) {
         setErrorMessages({ files: 'Please select at least one file before submitting.' });
         return;
      }
      setIsSubmitting(true);
      try {
         await new Promise(resolve => setTimeout(resolve, 1000));
         setErrorMessages({ detail: 'Data is submitted successfully' });
      } catch (error) {
         setErrorMessages({ submit: error.message });
      } finally {
         setIsSubmitting(false);
      }
   }

   const handleFinanceFileChange = (newFiles) => {
      setFiles(newFiles);
      if (newFiles.length > 0) {
         setErrorMessages((prev) => ({ ...prev, files: '' }));
      }
   }

   return (
      <div className="p-4 space-y-8 text-center border rounded overflow-hidden">
         <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
               Submit Financial Details for the Year {year}
            </h2>
            <form onSubmit={handleFinanceSubmission} name="finance-form" className="space-y-6">
               <FileUploadInput
                  onChange={handleFinanceFileChange}
                  togglePreview={preview}
                  maxSize={20 * 1024 * 1024}
                  maxFiles={100}
                  inputType={INPUT_TYPES.FINANCE}
               />
               {renderErrorMessage('files', errorMessages)}

               <div className="flex justify-center">
                  <SubmitButton disabled={isSubmitting || files.length === 0}>
                     {isSubmitting ? (
                        <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                     ) : (
                        'Submit'
                     )}
                  </SubmitButton>
               </div>

               <div className="mt-4 text-center" aria-live="assertive">
                  {renderErrorMessage('detail', errorMessages)}
                  {renderErrorMessage('non_detail_fields', errorMessages)}
                  {data && <p className="text-sm text-gray-600">Note: Submit will override any consumption updated previously</p>}
               </div>
            </form>
         </div>

         {loading ? (
            <div className="flex justify-center">
               <Loader2 className="animate-spin h-8 w-8 text-green-500" />
            </div>
         ) : data && data.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
               <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                     Previously Submitted Financial Data for Financial Year {year}
                  </h3>
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporting Documents</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {data.map((item, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.update_time}</td>
                                 <td className="px-6 py-4">
                                    <ul className="space-y-1">
                                       {JSON.parse(item.files_list?.replace(/'/g, '"'))?.map((option, j) => (
                                          <li key={j} className="flex items-center">
                                             <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                             </svg>
                                             <a href={`server/media/${option}`} target="_blank" rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm">{option}</a>
                                          </li>
                                       ))}
                                    </ul>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         ) : null}

         {renderErrorMessage('previous_data', errorMessages)}
      </div>
   );
}
