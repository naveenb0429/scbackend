import { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { API_HOST } from "../../../constants";
import { renderErrorMessage } from "../../../utils/utils";
import FileUploadInput, { INPUT_TYPES } from "../FileUploadInput";
import SubmitButton from "../../../components/ui/SubmitButton";
import Modal from "../../../components/Modal";
import { Loader2 } from "lucide-react";
import SubPart from "../SupplyChain/SubPart.js";

const SupplyChain = ({ year, headingText = "Submit Supply Chain Data for the Financial Year" }) => {
    const [cookies] = useCookies(['authtoken']);
    const [files, setFiles] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [subParts, setSubParts] = useState([{ name: '', quantity: '', unit: 'KGS', cost: '', currency: 'USD' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedParts, setExpandedParts] = useState([0]);

    // Helper function to safely extract the year
    const getYear = (yearString) => {
        if (typeof yearString === 'string') {
            return yearString.split('-')[0];
        }
        return String(yearString).substring(0, 4);
    };

    const fetchSupplyChainData = useCallback(async () => {
        try {
            const formData = new FormData();
            formData.append('financial_year', year);
            const response = await fetch(`${API_HOST}/accounts/supply-chain/get/`, {
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
            setErrorMessages(prev => ({ ...prev, previous_data: error.message }));
        } finally {
            setLoading(false);
        }
    }, [year, cookies.authtoken]);

    useEffect(() => {
        fetchSupplyChainData();
    }, [year]);

    const toggleExpand = (index) => {
        setExpandedParts(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const addSubPart = () => {
        if (subParts.length < 10) {
            setSubParts([...subParts, { name: '', quantity: '', unit: 'KGS', cost: '', currency: 'USD' }]);
        }
    };

    const removeSubPart = (index) => {
        if (subParts.length === 1) {
            setErrorMessages(prev => ({ ...prev, form: "At least one raw material is required." }));
            return;
        }

        if (window.confirm(`Are you sure you want to remove Raw Material ${index + 1}?`)) {
            const newSubParts = subParts.filter((_, i) => i !== index);
            setSubParts(newSubParts);
            setErrorMessages(prev => {
                const newErrors = { ...prev };
                delete newErrors[`subParts.${index}.name`];
                delete newErrors[`subParts.${index}.quantity`];
                delete newErrors[`subParts.${index}.cost`];
                delete newErrors[`subParts.${index}.unit`];
                return newErrors;
            });
        }
    };

    const handleSubPartChange = (index, field, value) => {
        const newSubParts = [...subParts];
        newSubParts[index][field] = value;
        setSubParts(newSubParts);

        const error = validateField(value, field);
        setErrorMessages(prev => ({
            ...prev,
            [`subParts.${index}.${field}`]: error
        }));
    };

    const validateField = (value, field) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return 'Name is required.';
                return '';
            case 'quantity':
                if (value === '') return 'Quantity is required.';
                if (isNaN(value) || Number(value) <= 0) return 'Quantity must be a positive number.';
                return '';
            case 'cost':
                if (value === '') return 'Cost is required.';
                if (isNaN(value) || Number(value) < 0) return 'Cost must be a non-negative number.';
                return '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrorMessages = {};

        subParts.forEach((part, index) => {
            if (!part.name.trim()) {
                newErrorMessages[`subParts.${index}.name`] = 'Name is required.';
                isValid = false;
            }
            if (part.quantity === '') {
                newErrorMessages[`subParts.${index}.quantity`] = 'Quantity is required.';
                isValid = false;
            } else if (isNaN(part.quantity) || Number(part.quantity) <= 0) {
                newErrorMessages[`subParts.${index}.quantity`] = 'Quantity must be a positive number.';
                isValid = false;
            }
            if (part.cost === '') {
                newErrorMessages[`subParts.${index}.cost`] = 'Cost is required.';
                isValid = false;
            } else if (isNaN(part.cost) || Number(part.cost) < 0) {
                newErrorMessages[`subParts.${index}.cost`] = 'Cost must be a non-negative number.';
                isValid = false;
            }
        });

        if (subParts.length === 0) {
            newErrorMessages['form'] = 'At least one raw material part is required.';
            isValid = false;
        }

        if (files.length === 0) {
            newErrorMessages['files'] = 'Please upload at least one file.';
            isValid = false;
        }

        setErrorMessages(newErrorMessages);
        return isValid;
    };

    const handleSubmission = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrorMessages({});

        try {
            const formData = new FormData();
            formData.append('financial_year', year);
            subParts.forEach((part, index) => {
                formData.append(`subParts[${index}][name]`, part.name);
                formData.append(`subParts[${index}][quantity]`, part.quantity);
                formData.append(`subParts[${index}][unit]`, part.unit);
                formData.append(`subParts[${index}][cost]`, part.cost);
                formData.append(`subParts[${index}][currency]`, part.currency);
            });
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await fetch(`${API_HOST}/accounts/supply-chain/submit/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Submission failed');
            }

            const result = await response.json();
            console.log(result);
            setModalMessage('Data is submitted successfully');
            setShowModal(true);
            setSubParts([{ name: '', quantity: '', unit: 'KGS', cost: '', currency: 'USD' }]);
            setFiles([]);
            fetchSupplyChainData();
        } catch (error) {
            setErrorMessages(prev => ({ ...prev, submit: error.message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalResponse = (response) => {
        if (response === 'yes') {
            setModalMessage(
                <div className="text-center">
                    <p className="mb-2">Please send additional documents via email:</p>
                    <p className="font-semibold text-blue-500 hover:underline">
                        team@sustaincred.com
                    </p>
                </div>
            );
        } else {
            setModalMessage(
                <div className="text-center">
                    <p className="mb-2">Thank you for your response.</p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="font-bold text-black"
                    >
                        Proceed to Next Tab
                    </button>
                </div>
            );
        }
        setTimeout(() => {
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        }, 0);
    };

    useEffect(() => {
        fetchSupplyChainData();
    }, [year, fetchSupplyChainData]);

    return (
        <div className="p-4 space-y-8 text-center border rounded overflow-hidden">
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {headingText} {year}
                </h2>
                <form onSubmit={handleSubmission} name="supply-chain-form" className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            What are the Main sub parts or raw materials used for making a product?
                        </h3>
                        {subParts.map((part, index) => (
                            <SubPart
                                key={index}
                                index={index}
                                part={part}
                                handleSubPartChange={handleSubPartChange}
                                removeSubPart={removeSubPart}
                                errorMessages={errorMessages}
                                expandedParts={expandedParts}
                                toggleExpand={toggleExpand}
                            />
                        ))}
                        {subParts.length < 10 && (
                            <div className="flex justify-center my-4">
                                <button
                                    type="button"
                                    onClick={addSubPart}
                                    className={`bg-[#157F3D] text-white px-4 py-2 rounded transition duration-300 ease-in-out ${subParts.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a6032]'
                                        }`}
                                    disabled={subParts.length >= 10}
                                >
                                    Add Raw Material
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <FileUploadInput
                            onChange={setFiles}
                            togglePreview={preview}
                            maxSize={20 * 1024 * 1024}
                            maxFiles={100}
                            inputType={INPUT_TYPES.SHEETS_PDF}
                        />
                        {errorMessages['files'] && (
                            <p className="text-red-500 text-xs mt-1">{errorMessages['files']}</p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <SubmitButton disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                'Submit'
                            )}
                        </SubmitButton>
                    </div>
                    <div className="mt-4 text-center" aria-live="assertive">
                        {renderErrorMessage('form', errorMessages)}
                        {renderErrorMessage('submit', errorMessages)}
                        {renderErrorMessage('detail', errorMessages)}
                        {renderErrorMessage('non_detail_fields', errorMessages)}
                        {data && <p className="text-sm text-gray-600">Note: Submit will override any consumption updated previously.</p>}
                    </div>
                </form>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} aria-labelledby="modal-title" role="dialog">
                <div className="p-6">
                    <h2 id="modal-title" className="text-xl font-semibold mb-4 text-center">Additional Supply Data</h2>
                    {!modalMessage ? (
                        <>
                            <p className="mb-6 text-center">
                                Do you have any additional supply data, other than the FY {year} relevant for making the product in {getYear(year)}?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => handleModalResponse('yes')}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => handleModalResponse('no')}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    No
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mb-6 text-center">{modalMessage}</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-green-500" />
                </div>
            ) : data && data.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                            Previously Submitted Way Bills for Financial {year}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Supporting Documents
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.update_time}</td>
                                            <td className="px-6 py-4">
                                                <ul className="space-y-2">
                                                    {JSON.parse(item.files_list?.replace(/'/g, '"'))?.map((option, j) => (
                                                        <li key={j} className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2 text-[#157F3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <a href={`server/media/${option}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                                                                {option}
                                                            </a>
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

export default SupplyChain;