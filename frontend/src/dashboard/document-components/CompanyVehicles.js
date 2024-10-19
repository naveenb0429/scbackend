import { useState, useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { API_HOST } from "../../constants";
import SubmitButton from "../../components/ui/SubmitButton";
import SkipButton from "../../components/ui/SkipButton";
import { renderErrorMessage } from "../../utils/utils";
import { ChevronDown, Loader2 } from "lucide-react"

const VEHICLE_TYPES = ["Sedan", "SUV", "Truck", "Semi-truck"];
const MAX_VEHICLES = 10;

const VehicleInput = ({ index, vehicle, onChange, error }) => (
    <div className="mb-6 border-t pt-4 text-left" aria-live="polite">
        <h3 className="text-lg font-bold mb-2">Vehicle {index + 1}</h3>
        <div className="mb-4 space-y-2">
            <label htmlFor={`vehicleType${index}`} className="block text-sm font-medium text-gray-700">
                Select Type of Vehicle {index + 1}:
            </label>
            <div className="relative">
                <select
                    id={`vehicleType${index}`}
                    value={vehicle.type}
                    onChange={(e) => onChange(index, 'type', e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                    {VEHICLE_TYPES.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
        </div>
        <div className="mb-4 space-y-2">
            <label htmlFor={`rto${index}`} className="block text-sm font-medium text-gray-700">
                Please enter vehicle {index + 1} RTO Number:
            </label>
            <input
                type="text"
                id={`rto${index}`}
                value={vehicle.rto}
                onChange={(e) => onChange(index, 'rto', e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                minLength="5"
                maxLength="14"
                placeholder="RTO Number"
            />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const CompanyVehicles = ({ year, onSkip }) => {
    const [cookies] = useCookies(['authtoken']);
    const [vehicles, setVehicles] = useState([]);
    const [numVehicles, setNumVehicles] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [submittedVehicles, setSubmittedVehicles] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);

    const fetchSubmittedVehicles = useCallback(async () => {
        setIsFetching(false);
        // setIsFetching(true);
        try {
            const response = await fetch(`${API_HOST}/accounts/vehicles/get/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ financial_year: year }),
            });

            if (!response.ok) throw new Error('Failed to fetch submitted vehicles');

            const data = await response.json();
            setSubmittedVehicles(data);
        } catch (error) {
            console.error("Error fetching submitted vehicles:", error);
            setError(error.message);
        } finally {

            setLoading(false);
        }
    }, [cookies.authtoken, year]);

    useEffect(() => {
        fetchSubmittedVehicles();
    }, [fetchSubmittedVehicles]);

    const handleNumVehiclesChange = (e) => {
        const num = parseInt(e.target.value, 10);
        setNumVehicles(num);
        setVehicles((prevVehicles) => {
            const updatedVehicles = [...prevVehicles];
            while (updatedVehicles.length < num) {
                updatedVehicles.push({ type: VEHICLE_TYPES[0], rto: '' });
            }
            return updatedVehicles.slice(0, num);
        });
        setErrors({});
    };

    const handleVehicleChange = (index, field, value) => {
        setVehicles(vehicles.map((v, i) => i === index ? { ...v, [field]: value } : v));
        setErrors(prev => ({ ...prev, [index]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        vehicles.forEach((vehicle, index) => {
            if (!vehicle.rto || vehicle.rto.length < 5 || !/^[A-Z0-9]+$/i.test(vehicle.rto)) {
                newErrors[index] = `Please enter a valid RTO Number for Vehicle ${index + 1}.`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVehicleDocumentsSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newSubmittedVehicles = [...submittedVehicles, ...vehicles];
            setSubmittedVehicles(newSubmittedVehicles);

            const response = await fetch(`${API_HOST}/accounts/vehicles/submit/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    financial_year: year,
                    vehicles: vehicles.map((v, i) => ({ ...v, index: i })),
                }),
            });

            if (!response.ok) throw new Error('Failed to submit vehicles');

            await fetchSubmittedVehicles();
            setNumVehicles(0);
            setVehicles([]);
            setErrorMessages({ detail: 'Data is submitted successfully' });
        } catch (error) {
            setSubmittedVehicles(submittedVehicles);
            setErrorMessages(prev => ({ ...prev, submit: error.message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        }
    };

    return (
        <div className="p-4 space-y-8 text-center border rounded overflow-hidden">
            <div className="p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Submit Company Vehicles for the Financial Year {year}
                </h2>
                <form onSubmit={handleVehicleDocumentsSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="numVehicles" className="block text-sm font-medium text-gray-700 text-left mb-1">
                                Select number of vehicles in use:
                            </label>
                            <div className="relative">
                                <select
                                    id="numVehicles"
                                    value={numVehicles}
                                    onChange={handleNumVehiclesChange}
                                    className="w-full appearance-none border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                >
                                    {[...Array(MAX_VEHICLES + 1).keys()].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                                <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {vehicles.map((vehicle, index) => (
                            <VehicleInput
                                key={index}
                                index={index}
                                vehicle={vehicle}
                                onChange={handleVehicleChange}
                                error={errors[index]}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center space-x-4">
                        <SubmitButton disabled={isSubmitting || numVehicles === 0}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                'Submit'
                            )}
                        </SubmitButton>
                        <SkipButton disabled={isSubmitting} onClick={handleSkip}>Skip
                        </SkipButton>
                    </div>

                    {errors.submit && <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>}
                    <div className="mt-4 text-center" aria-live="assertive">
                        {renderErrorMessage('detail', errorMessages)}
                    </div>
                </form>
                <div className="mt-4 text-center" aria-live="assertive">
                    {renderErrorMessage('detail', errorMessages)}
                </div>
            </div>

            {isFetching ? (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-green-500" />
                </div>
            ) : submittedVehicles.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                            Previously Submitted Vehicles
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RTO Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {submittedVehicles.map((vehicle, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicle_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicle_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{vehicle.update_time}</td>
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
};

export default CompanyVehicles;