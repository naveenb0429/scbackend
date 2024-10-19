import { API_HOST, validateInput, MONTHS } from "../../constants";
import { useCookies } from "react-cookie";
import { useEffect, useState, useCallback } from "react";
import FileUploadInput, { INPUT_TYPES } from "./FileUploadInput";
import { renderErrorMessage } from "../../utils/utils";
import SubmitButton from "../../components/ui/SubmitButton";
import PeriodAndMonthSelector from "../components/PeriodAndMonthSelector";
import Modal from "../../components/Modal";
import { Loader2 } from "lucide-react";

export default function Transportation({ year, headingText = "Submit Transportation Data for the Financial Year" }) {
    const TRANSPORT_TYPES = ["AIR", "ROAD", "RAIL", "SEA"];
    const [cookies] = useCookies(['authtoken']);
    const [files, setFiles] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [transportModes, setTransportModes] = useState([
        { id: 1, type: '', distance: '', weight: '', weightUnit: 'kms', startLocation: '', endLocation: '', materials: '', showLocationInput: false, showMaterialsInput: false }
    ]);
    const [nextModeId, setNextModeId] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const resetForm = useCallback(() => {
        setTransportModes([
            { id: 1, type: '', distance: '', weight: '', weightUnit: 'kms', startLocation: '', endLocation: '', materials: '', showLocationInput: false, showMaterialsInput: false }
        ]);
        setNextModeId(2);
        setFiles([]);
        setErrorMessages({});
        setData(null);
        setLoading(true);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('financial_year', year);
            formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');
            const response = await fetch(`${API_HOST}/accounts/transportation/get/`, {
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
        fetchData();
    }, [fetchData, selectedPeriod, selectedMonth]);

    const handleSubmission = async (event) => {
        event.preventDefault();
        if (!isFormValid()) {
            setErrorMessages(prev => ({ ...prev, form: "Please fix the errors before submitting." }));
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('financial_year', year);
        formData.append('month', selectedPeriod === 'month' ? selectedMonth : '');

        transportModes.forEach((mode, index) => {
            formData.append(`transport_type_${index}`, mode.type);
            formData.append(`consumption_${index}`, mode.distance);
            formData.append(`weight_${index}`, mode.weight);
            formData.append(`weight_unit_${index}`, mode.weightUnit);

            if (mode.showLocationInput) {
                formData.append(`start_location_${index}`, mode.startLocation);
                formData.append(`end_location_${index}`, mode.endLocation);
            }

            if (mode.showMaterialsInput) {
                formData.append(`materials_${index}`, mode.materials);
            }
        });

        formData.append('transport_modes_count', transportModes.length);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch(`${API_HOST}/accounts/transportation/update/`, {
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
                await fetchData();
                setFiles([]);
                setTransportModes([
                    { id: 1, type: '', distance: '', weight: '', weightUnit: 'kms', startLocation: '', endLocation: '', materials: '', showLocationInput: false, showMaterialsInput: false }
                ]);
                setNextModeId(2);
                setErrorMessages({ detail: 'Data is submitted successfully' });
                setPreview(prev => !prev);
                setShowModal(true);
            }
        } catch (error) {
            setErrorMessages({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        resetForm();
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
        if (event.target.value === 'year') {
            setSelectedMonth('');
        }
        resetForm();
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

    const handleAddTransportMode = () => {
        if (transportModes.length >= 12) return;
        setTransportModes([...transportModes, {
            id: nextModeId,
            type: '',
            distance: '',
            weight: '',
            weightUnit: 'kms',
            startLocation: '',
            endLocation: '',
            materials: '',
            showLocationInput: false,
            showMaterialsInput: false
        }]);
        setNextModeId(prevId => prevId + 1);
    };

    const handleRemoveTransportMode = (id) => {
        if (transportModes.length === 1) {
            setErrorMessages(prev => ({ ...prev, form: "At least one transport mode is required." }));
            return;
        }

        if (window.confirm("Are you sure you want to remove this Transport Mode?")) {
            const newTransportModes = transportModes.filter(mode => mode.id !== id);
            setTransportModes(newTransportModes);
            setErrorMessages(prev => {
                const newErrors = { ...prev };
                delete newErrors[`transportModes.${id}.type`];
                delete newErrors[`transportModes.${id}.distance`];
                delete newErrors[`transportModes.${id}.weight`];
                delete newErrors[`transportModes.${id}.startLocation`];
                delete newErrors[`transportModes.${id}.endLocation`];
                delete newErrors[`transportModes.${id}.materials`];
                return newErrors;
            });
        }
    };

    const handleInputChange = (id, field, value) => {
        const updatedModes = transportModes.map(mode => {
            if (mode.id === id) {
                return { ...mode, [field]: value };
            }
            return mode;
        });
        setTransportModes(updatedModes);

        if (field === 'distance' || field === 'weight') {
            if (value === '' || isNaN(value) || Number(value) < 0) {
                setErrorMessages(prev => ({
                    ...prev,
                    [`transportModes.${id}.${field}`]: `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number.`
                }));
            } else {
                setErrorMessages(prev => {
                    const updatedErrors = { ...prev };
                    delete updatedErrors[`transportModes.${id}.${field}`];
                    return updatedErrors;
                });
            }
        }
    };

    const toggleInput = (id, field) => {
        const updatedModes = transportModes.map(mode => {
            if (mode.id === id) {
                return { ...mode, [field]: !mode[field] };
            }
            return mode;
        });
        setTransportModes(updatedModes);
    };

    const isFormValid = () => {
        if (transportModes.length === 0) return false;
        for (let mode of transportModes) {
            if (!mode.type || !mode.distance || !mode.weight) return false;
            if (mode.showLocationInput && (!mode.startLocation || !mode.endLocation)) return false;
            if (mode.showMaterialsInput && !mode.materials) return false;
            if (isNaN(mode.distance) || Number(mode.distance) < 0) return false;
            if (isNaN(mode.weight) || Number(mode.weight) < 0) return false;
        }
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
        setTimeout(() => {
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        }, 0);
    }

    const getYear = (yearString) => {
        if (typeof yearString === 'string') {
            return yearString.split('-')[0];
        }
        return String(yearString).substring(0, 4);
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
                <p className="text-center mb-4 text-gray-600">
                    Please update way bills for the {getConsumptionPeriodText()}
                </p>
                <form onSubmit={handleSubmission} name="transport-form" className="space-y-6">
                    <div className="space-y-4">
                        {transportModes.map((mode, index) => (
                            <div key={mode.id} className="p-4 border rounded-lg bg-white shadow-sm relative">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-left">Transport Mode {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTransportMode(mode.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        aria-label={`Delete Transport Mode ${index + 1}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor={`type-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Transport Type
                                        </label>
                                        <select
                                            id={`type-${mode.id}`}
                                            value={mode.type}
                                            onChange={(e) => handleInputChange(mode.id, 'type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">Select Transport Type</option>
                                            {TRANSPORT_TYPES.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {errorMessages[`transportModes.${mode.id}.type`] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.type`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`distance-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Distance
                                        </label>
                                        <input
                                            id={`distance-${mode.id}`}
                                            type="number"
                                            value={mode.distance}
                                            onChange={(e) => handleInputChange(mode.id, 'distance', e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' || e.key === 'Delete') return;
                                                validateInput(e);
                                            }}
                                            placeholder={`Distance in ${mode.type === 'AIR' || mode.type === 'SEA' ? 'MILES' : 'KMS'}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            min="0"
                                        />
                                        {errorMessages[`transportModes.${mode.id}.distance`] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.distance`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`weight-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Weight
                                        </label>
                                        <input
                                            id={`weight-${mode.id}`}
                                            type="number"
                                            value={mode.weight}
                                            onChange={(e) => handleInputChange(mode.id, 'weight', e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' || e.key === 'Delete') return;
                                                validateInput(e);
                                            }}
                                            placeholder="Weight of the Shipment"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            min="0"
                                        />
                                        {errorMessages[`transportModes.${mode.id}.weight`] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.weight`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`weightUnit-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Weight Unit
                                        </label>
                                        <select
                                            id={`weightUnit-${mode.id}`}
                                            value={mode.weightUnit}
                                            onChange={(e) => handleInputChange(mode.id, 'weightUnit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="kms">KMS</option>
                                            <option value="miles">MILES</option>
                                            <option value="kg">KG</option>
                                            <option value="tonne">TONS</option>
                                            <option value="ltrs">LTRS</option>
                                        </select>
                                    </div>
                                    {mode.showLocationInput && (
                                        <>
                                            <div>
                                                <label htmlFor={`startLocation-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                    Start Location
                                                </label>
                                                <input
                                                    id={`startLocation-${mode.id}`}
                                                    type="text"
                                                    value={mode.startLocation}
                                                    onChange={(e) => handleInputChange(mode.id, 'startLocation', e.target.value)}
                                                    placeholder="Start Location"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    required={mode.showLocationInput}
                                                />
                                                {errorMessages[`transportModes.${mode.id}.startLocation`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.startLocation`]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor={`endLocation-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                    End Location
                                                </label>
                                                <input
                                                    id={`endLocation-${mode.id}`}
                                                    type="text"
                                                    value={mode.endLocation}
                                                    onChange={(e) => handleInputChange(mode.id, 'endLocation', e.target.value)}
                                                    placeholder="End Location"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    required={mode.showLocationInput}
                                                />
                                                {errorMessages[`transportModes.${mode.id}.endLocation`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.endLocation`]}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {mode.showMaterialsInput && (
                                        <div className="col-span-1 md:col-span-2">
                                            <label htmlFor={`materials-${mode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Materials
                                            </label>
                                            <input
                                                id={`materials-${mode.id}`}
                                                type="text"
                                                value={mode.materials}
                                                onChange={(e) => handleInputChange(mode.id, 'materials', e.target.value)}
                                                placeholder="Materials being shipped"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required={mode.showMaterialsInput}
                                            />
                                            {errorMessages[`transportModes.${mode.id}.materials`] && (
                                                <p className="text-red-500 text-xs mt-1">{errorMessages[`transportModes.${mode.id}.materials`]}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center mt-4 space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={mode.showLocationInput}
                                            onChange={() => toggleInput(mode.id, 'showLocationInput')}
                                            className="mr-2"
                                        /> Show Location Input
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={mode.showMaterialsInput}
                                            onChange={() => toggleInput(mode.id, 'showMaterialsInput')}
                                            className="mr-2"
                                        /> Show Materials Input
                                    </label>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddTransportMode}
                                disabled={transportModes.length >= 12}
                                className={`bg-[#157F3D] text-white px-4 py-2 rounded hover:bg-[#1a6032] transition duration-300 ease-in-out ${transportModes.length >= 12 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Add Transport Mode
                            </button>
                        </div>
                        {transportModes.length >= 12 && (
                            <p className="text-red-500 text-sm text-center mt-2">Maximum of 12 transport modes reached.</p>
                        )}
                        {errorMessages['form'] && (
                            <p className="text-red-500 text-sm text-center">{errorMessages['form']}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <FileUploadInput
                            onChange={setFiles}
                            togglePreview={preview}
                            maxSize={5 * 1024 * 1024}
                            inputType={INPUT_TYPES.SHEETS_PDF}
                            allowMultiple={true}
                        />
                        {renderErrorMessage('files', errorMessages)}
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

                    <div className="mt-4 text-center">
                        {renderErrorMessage('detail', errorMessages)}
                        {renderErrorMessage('non_detail_fields', errorMessages)}
                    </div>
                </form>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center">Additional Transportation Data</h2>
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
                        <div className="text-center">
                            {modalMessage}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
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
                            Previously Submitted Way Bills for Financial {year} {selectedPeriod === 'month' && selectedMonth ? `- ${MONTHS[parseInt(selectedMonth) - 1]}` : ''}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporting Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.transport_type}</td>
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
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#157F3D]">{item.consumption} Kms</td>
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
