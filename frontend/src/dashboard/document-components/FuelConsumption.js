import { useEffect, useState, useCallback } from "react";
import { API_HOST, validateInput, MONTHS } from "../../constants";
import { useCookies } from "react-cookie";
import { renderErrorMessage } from "../../utils/utils";
import FileUploadInput, { INPUT_TYPES } from "./FileUploadInput";
import SubmitButton from "../../components/ui/SubmitButton";
import PeriodAndMonthSelector from "../components/PeriodAndMonthSelector";
import Modal from "../../components/Modal";
import { Loader2 } from "lucide-react";
import SkipButton from "../../components/ui/SkipButton";

export default function FuelConsumption({ year, onSkip }) {
    const FUEL_TYPES = ["Diesel", "Coal", "Petrol", "Butane", "Propane", "Others"]
    const FUEL_UNITS = ["LTRS", "KGS"]
    const [cookies] = useCookies(['authtoken']);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [showFuelForm, setShowFuelForm] = useState(null);
    const [fuelEntries, setFuelEntries] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('financial_year', year);
            formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');
            const response = await fetch(`${API_HOST}/accounts/fuel-consumption/get/`, {
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
    }, [year, selectedMonth, selectedPeriod, cookies.authtoken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddFuelEntry = () => {
        setFuelEntries([...fuelEntries, {
            fuelType: FUEL_TYPES[0],
            consumption: '',
            unit: FUEL_UNITS[0],
            unitType: '',
            files: [],
        }]);
    };

    const handleInputChange = (index, field, value) => {
        setFuelEntries(prevEntries =>
            prevEntries.map((entry, i) =>
                i === index ? { ...entry, [field]: value } : entry
            )
        );
    };

    const handleFileChange = (index, files) => {
        setFuelEntries(prevEntries =>
            prevEntries.map((entry, i) =>
                i === index ? { ...entry, files } : entry
            )
        );
    };

    const isFormValid = () => {
        return fuelEntries.length > 0 && fuelEntries.every(entry =>
            entry.fuelType && entry.consumption && entry.unit &&
            (entry.fuelType !== "Others" || entry.unitType)
        );
    };

    const handleFuelConsumptionSubmission = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('financial_year', year);
        formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');

        fuelEntries.forEach((entry, index) => {
            formData.append(`fuel_type_${index}`, entry.fuelType === "Others" ? entry.unitType : entry.fuelType);
            formData.append(`consumption_${index}`, entry.consumption);
            formData.append(`unit_${index}`, entry.unit);
            entry.files.forEach((file) => {
                formData.append(`files_${index}`, file);
            });
        });

        formData.append('fuel_entries_count', fuelEntries.length);

        try {
            const response = await fetch(`${API_HOST}/accounts/fuel-consumption/update/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                },
                body: formData
            });

            const json = await response.json();
            if (response.status !== 200) {
                setErrorMessages(prev => ({ ...prev, ...json }));
            } else {
                await fetchData();
                setErrorMessages({ detail: 'Data is submitted successfully' });
                setPreview(prev => !prev);
            }
        } catch (error) {
            setErrorMessages({ detail: 'An unexpected error occurred.' });
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
        if (event.target.value === 'year') {
            setSelectedMonth('');
        }
    };

    const getConsumptionPeriodText = () => {
        if (selectedPeriod === 'year') {
            return 'year';
        } else if (selectedPeriod === 'month' && selectedMonth) {
            return `month of ${MONTHS[parseInt(selectedMonth) - 1]}`;
        } else {
            return 'selected period';
        }
    };

    const handleFuelUsageResponse = (response) => {
        setShowFuelForm(response);
    };

    const getFileUploadProps = () => {
        if (selectedPeriod === 'month') {
            return {
                customMaxFiles: 3,
                customFileDescription: 'Images (JPG, PNG), Excel (XLS), or (PDF or ODF)',
                allowMultiple: true,
                inputType: INPUT_TYPES.SHEETS_PDF,
            };
        } else {
            return {
                customMaxFiles: 12,
                customFileDescription: 'Images (JPG, PNG), Excel (XLS), or (PDF or ODF)',
                allowMultiple: true,
                inputType: INPUT_TYPES.SHEETS_PDF,
            };
        }
    };

    const handleRemoveFuelEntry = (index) => {
        const updatedEntries = fuelEntries.filter((_, i) => i !== index);
        setFuelEntries(updatedEntries);
    };

    const handleModalResponse = (response) => {
        if (response === 'yes') {
            setModalMessage('You can add additional fuel consumption data in the next tab.');
        } else {
            setModalMessage('Please proceed to the next tab.');
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        }
    };

    return (
        <div className="p-4 space-y-8 border rounded-lg">
            <PeriodAndMonthSelector
                selectedPeriod={selectedPeriod}
                handlePeriodChange={handlePeriodChange}
                selectedMonth={selectedMonth}
                handleMonthChange={handleMonthChange}
            />
            <div className="p-6 max-w-6xl mx-auto">
                {showFuelForm === null ? (
                    <div className="mt-8 mb-6 pb-6">
                        <p className="text-center mb-4 text-lg font-medium text-gray-700">Does any of your processes in production consume the following fuel?</p>
                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            {FUEL_TYPES.filter(fuel => fuel !== "Others").map((fuel, index) => (
                                <span key={index} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium">
                                    {fuel}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleFuelUsageResponse(true)}
                                className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-[#157F3D] hover:text-white transition duration-300 ease-in-out flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Yes
                            </button>
                            <button
                                onClick={() => handleFuelUsageResponse(false)}
                                className="px-3 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded hover:bg-gray-400 transition duration-300 ease-in-out flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                No
                            </button>
                        </div>
                    </div>
                ) : showFuelForm === true ? (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Submit Fuel Consumption for the Financial Year {year}
                            {selectedPeriod === 'year' ? '' : selectedPeriod === 'month' && selectedMonth && (
                                <> - {MONTHS[parseInt(selectedMonth) - 1]}</>
                            )}
                        </h2>
                        <p className="text-center mb-4 text-gray-600">
                            You can upload multiple types of fuel consumption for the {getConsumptionPeriodText()}
                        </p>
                        <form onSubmit={handleFuelConsumptionSubmission} name="fuel-form" className="space-y-6">
                            <div className="space-y-4">
                                {fuelEntries.map((entry, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-white shadow-sm relative">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-semibold text-left">Fuel Entry {index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFuelEntry(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                aria-label={`Remove fuel entry ${index + 1}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex flex-col md:flex-row lg:space-x-4 items-start md:items-center">
                                            {/* Fuel Type */}
                                            <div className="flex-1">
                                                <label htmlFor={`fuelType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fuel Type
                                                </label>
                                                <select
                                                    id={`fuelType-${index}`}
                                                    value={entry.fuelType}
                                                    onChange={(e) => handleInputChange(index, 'fuelType', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    required
                                                >
                                                    <option value="">Select fuel type</option>
                                                    {FUEL_TYPES.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Consumption and Unit */}
                                            <div className="flex-1 flex">
                                                <div className="flex-1">
                                                    <label htmlFor={`consumption-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                        Consumption
                                                    </label>
                                                    <input
                                                        id={`consumption-${index}`}
                                                        type="number"
                                                        value={entry.consumption}
                                                        onChange={(e) => handleInputChange(index, 'consumption', e.target.value)}
                                                        onKeyDown={validateInput}
                                                        placeholder="Consumption"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        required
                                                        min="0"
                                                        max="99999"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor={`unit-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                        Unit
                                                    </label>
                                                    <select
                                                        id={`unit-${index}`}
                                                        value={entry.unit}
                                                        onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        required
                                                    >
                                                        {FUEL_UNITS.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Fuel Name (for "Others" option) */}
                                            {entry.fuelType === "Others" && (
                                                <div className="flex-1">
                                                    <label htmlFor={`unitType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fuel Name
                                                    </label>
                                                    <input
                                                        id={`unitType-${index}`}
                                                        type="text"
                                                        value={entry.unitType}
                                                        onChange={(e) => handleInputChange(index, 'unitType', e.target.value)}
                                                        placeholder="Enter Fuel Name"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        required
                                                        maxLength="20"
                                                    />
                                                </div>
                                            )}

                                            {/* File Upload */}
                                            <div className="flex-1">
                                                <FileUploadInput
                                                    onChange={(files) => handleFileChange(index, files)}
                                                    togglePreview={preview}
                                                    {...getFileUploadProps()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleAddFuelEntry}
                                    className="bg-[#157F3D] text-white px-4 py-2 rounded hover:bg-[#1a6032] transition duration-300 ease-in-out"
                                >
                                    Add Fuel Entry
                                </button>
                            </div>
                            {fuelEntries.length > 0 && (
                                <div className="flex justify-center">
                                    <SubmitButton disabled={!isFormValid() || isSubmitting}>
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                                        ) : (
                                            'Submit'
                                        )}
                                    </SubmitButton>
                                </div>
                            )}
                            <div className="mt-4 text-center">
                                {renderErrorMessage('detail', errorMessages)}
                                {renderErrorMessage('non_detail_fields', errorMessages)}
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center mt-4 p-4">
                        <p className="text-lg text-gray-700 font-bold mb-4">No fuel consumption data to report.</p>
                        <p className="text-md font-medium text-gray-600 mb-6">Please proceed to the next tab.</p>
                        <div className="flex justify-center space-x-4">
                            <SkipButton onClick={handleSkip}>
                                Next Tab
                            </SkipButton>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">Additional Fuel Consumption Data</h2>
                    {!modalMessage ? (
                        <>
                            <p className="mb-6 text-center">
                                Do you have any additional fuel consumption data, other than the FY {year} relevant for making the product in {year}?
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
                        <div className="text-center">
                            {modalMessage}
                        </div>
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
                            Previously Submitted Fuel Consumption for Financial {year} {selectedPeriod === 'month' && selectedMonth ? `- ${MONTHS[parseInt(selectedMonth) - 1]}` : ''}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporting Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.fuel_type}</td>
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
                                            <td className="px-6 py-4 whitespace-nowrap">{item.update_time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#157F3D]">
                                                {item.consumption} {FUEL_UNITS[FUEL_TYPES.indexOf(item.fuel_type)] || "Units"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}