import { useEffect, useState, useCallback } from "react";
import { API_HOST, validateInput, MONTHS } from "../../constants";
import { useCookies } from "react-cookie";
import { renderErrorMessage } from "../../utils/utils";
import FileUploadInput, { INPUT_TYPES } from "./FileUploadInput";
import PeriodAndMonthSelector from "../components/PeriodAndMonthSelector";
import SubmitButton from "../../components/ui/SubmitButton";
import Modal from "../../components/Modal";
import { Loader2 } from "lucide-react";

export default function EnergyConsumption({ year, headingText = "Submit Energy Consumption Data for the Financial Year" }) {
    const ENERGY_TYPES = ["Electricity", "Solar", "Wind", "Others"];
    const ENERGY_UNITS = ["Kw/H"];
    const [cookies] = useCookies(['authtoken']);
    const [files, setFiles] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [energyEntries, setEnergyEntries] = useState([
        { energyType: ENERGY_TYPES[0], consumption: '', unit: ENERGY_UNITS[0], unitType: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchEnergyConsumptionData = useCallback(async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('financial_year', year);
            formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');
            const response = await fetch(`${API_HOST}/accounts/energy-consumption/get/`, {
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
    }, [year, selectedMonth, selectedPeriod, cookies.authtoken]);

    useEffect(() => {
        fetchEnergyConsumptionData();
    }, [fetchEnergyConsumptionData]);

    const handleEnergyConsumptionSubmission = async (event) => {
        event.preventDefault();
        if (!isFormValid()) {
            setErrorMessages(prev => ({ ...prev, form: "Please fix the errors before submitting." }));
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('financial_year', year);
        formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');

        energyEntries.forEach((entry, index) => {
            formData.append(`energy_type_${index}`, entry.energyType === "Others" ? entry.unitType : entry.energyType);
            formData.append(`consumption_${index}`, entry.consumption);
            formData.append(`unit_${index}`, entry.unit);
        });

        formData.append('energy_entries_count', energyEntries.length);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch(`${API_HOST}/accounts/energy-consumption/update/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                },
                body: formData
            });

            const json = await response.json();

            if (response.status !== 200) {
                setErrorMessages(json);
            } else {
                await fetchEnergyConsumptionData();
                setFiles([]);
                setEnergyEntries([{ energyType: ENERGY_TYPES[0], consumption: '', unit: ENERGY_UNITS[0], unitType: '' }]);
                setModalMessage('Data has been submitted successfully.');
                setShowModal(true);
                setPreview(prev => !prev);
                setErrorMessages({});
            }
        } catch (error) {
            setErrorMessages({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
        if (event.target.value === 'year') {
            setSelectedMonth('');
        }
    };

    const getFileUploadProps = () => {
        if (selectedPeriod === 'month') {
            return {
                customMaxFiles: 1,
                customFileDescription: 'Images (PNG, JPG) or Excel (XLS)',
                allowMultiple: false,
            };
        } else {
            return {
                customMaxFiles: 12,
                customFileDescription: 'Images (PNG, JPG) or Excel (XLS)',
                allowMultiple: true,
            };
        }
    };

    const handleAddEnergyEntry = () => {
        if (energyEntries.length >= 10) return;
        setEnergyEntries([...energyEntries, { energyType: ENERGY_TYPES[0], consumption: '', unit: ENERGY_UNITS[0], unitType: '' }]);
    };

    const handleRemoveEnergyEntry = (index) => {
        if (energyEntries.length === 1) {
            setErrorMessages(prev => ({ ...prev, form: "At least one energy entry is required." }));
            return;
        }

        if (window.confirm(`Are you sure you want to remove Energy Consumption Entry ${index + 1}?`)) {
            const newEnergyEntries = energyEntries.filter((_, i) => i !== index);
            setEnergyEntries(newEnergyEntries);
            setErrorMessages(prev => {
                const newErrors = { ...prev };
                delete newErrors[`energyEntries.${index}.energyType`];
                delete newErrors[`energyEntries.${index}.consumption`];
                delete newErrors[`energyEntries.${index}.unitType`];
                return newErrors;
            });
        }
    };

    const handleEnergyEntryChange = (index, field, value) => {
        const updatedEntries = [...energyEntries];
        updatedEntries[index][field] = value;
        setEnergyEntries(updatedEntries);

        let error = '';
        if (field === 'consumption') {
            if (value === '') {
                error = 'Consumption is required.';
            } else if (isNaN(value) || Number(value) <= 0) {
                error = 'Consumption must be a positive number.';
            }
        }
        if (field === 'unitType' && energyEntries[index].energyType === "Others") {
            if (!value.trim()) {
                error = 'Energy Type is required.';
            }
        }

        setErrorMessages(prev => ({
            ...prev,
            [`energyEntries.${index}.${field}`]: error
        }));
    };

    const isFormValid = () => {
        if (energyEntries.length === 0) return false;
        for (let i = 0; i < energyEntries.length; i++) {
            const entry = energyEntries[i];
            if (!entry.energyType || !entry.consumption || !entry.unit) return false;
            if (entry.energyType === "Others" && !entry.unitType.trim()) return false;
            if (isNaN(entry.consumption) || Number(entry.consumption) <= 0) return false;
        }
        if (files.length === 0) return false;
        return true;
    };

    const handleModalResponse = (response) => {
        if (response === 'yes') {
            setModalMessage(
                <div className="text-center">
                    <p className="mb-2">Please send additional documents via email:</p>
                    <a href="mailto:team@sustaincred.com" className="font-semibold text-blue-500 hover:underline">
                        team@sustaincred.com
                    </a>
                </div>
            );
        } else {
            setModalMessage(
                <div className="text-center">
                    <p className="mb-2">Thank you for your response.</p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            );
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
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {headingText} {year} {selectedPeriod === 'month' && selectedMonth ? `- ${MONTHS[parseInt(selectedMonth) - 1]}` : ''}
                </h2>
                <form onSubmit={handleEnergyConsumptionSubmission} name="energy-consumption-form" className="space-y-6">
                    <div className="space-y-4">
                        {energyEntries.map((entry, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm relative">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-left">Energy Consumption Entry {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEnergyEntry(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        aria-label={`Delete Energy Consumption Entry ${index + 1}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Energy Type
                                        </label>
                                        <select
                                            value={entry.energyType}
                                            onChange={(e) => handleEnergyEntryChange(index, 'energyType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            {ENERGY_TYPES.map((type, idx) => (
                                                <option key={idx} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errorMessages[`energyEntries.${index}.energyType`] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[`energyEntries.${index}.energyType`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Consumption
                                        </label>
                                        <input
                                            type="number"
                                            value={entry.consumption}
                                            onChange={(e) => handleEnergyEntryChange(index, 'consumption', e.target.value)}
                                            onKeyDown={validateInput}
                                            placeholder="Enter consumption"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            min="0"
                                        />
                                        {errorMessages[`energyEntries.${index}.consumption`] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[`energyEntries.${index}.consumption`]}</p>
                                        )}
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unit
                                        </label>
                                        <input
                                            type="text"
                                            value={entry.unit}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                                            readOnly
                                        />
                                    </div>
                                    {entry.energyType === "Others" && (
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Specify Energy Type
                                            </label>
                                            <input
                                                type="text"
                                                value={entry.unitType}
                                                onChange={(e) => handleEnergyEntryChange(index, 'unitType', e.target.value)}
                                                placeholder="Enter Energy Type"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                                maxLength="20"
                                            />
                                            {errorMessages[`energyEntries.${index}.unitType`] && (
                                                <p className="text-red-500 text-xs mt-1">{errorMessages[`energyEntries.${index}.unitType`]}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {energyEntries.length < 10 && (
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleAddEnergyEntry}
                                    className="bg-[#157F3D] text-white px-4 py-2 rounded hover:bg-[#1a6032] transition duration-300 ease-in-out"
                                >
                                    Add Energy Entry
                                </button>
                            </div>
                        )}
                        {errorMessages['form'] && (
                            <p className="text-red-500 text-sm text-center">{errorMessages['form']}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <FileUploadInput
                            onChange={setFiles}
                            togglePreview={preview}
                            maxSize={2 * 1024 * 1024}
                            maxFiles={getFileUploadProps().allowMultiple ? 12 : 1}
                            inputType={INPUT_TYPES.SHEETS_PDF}
                            {...getFileUploadProps()}
                        />
                        {errorMessages['files'] && (
                            <p className="text-red-500 text-xs mt-1">{errorMessages['files']}</p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <SubmitButton disabled={!isFormValid() || isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                'Submit'
                            )}
                        </SubmitButton>
                    </div>

                    <div className="mt-4 text-center" aria-live="assertive">
                        {renderErrorMessage('submit', errorMessages)}
                        {renderErrorMessage('previous_data', errorMessages)}
                        {data && (
                            <p className="text-sm text-gray-600 italic">
                                Note: Submitting will override any previously updated consumption.
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} aria-labelledby="modal-title" role="dialog">
                <div className="p-6">
                    <h2 id="modal-title" className="text-xl font-semibold mb-4 text-center">Additional Energy Consumption Data</h2>
                    {!modalMessage ? (
                        <>
                            <p className="mb-6 text-center">
                                Do you have any additional energy consumption data for the Financial Year {year}?
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
                            <div className="mb-6 text-center">{modalMessage}</div>
                            {modalMessage.props.children.type === 'p' && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
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
                            Previously Submitted Energy Consumption for Financial {year}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Supporting Documents
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Updated On
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Consumption
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
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
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(item.update_time).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#157F3D]">{item.consumption} Kw/H</td>
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
};
