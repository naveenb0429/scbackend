import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { API_HOST } from "../constants";
import DashboardNav from "./components/DashboardNav";
import questionsConfig from "./configs/MyCompanyConfig";
import { renderErrorMessage, renderSubErrorMessage } from "../utils/utils";

const MyAccount = () => {
    const [cookies] = useCookies(['authtoken']);
    const [formData, setFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState("");
    const [question, setQuestion] = useState(questionsConfig[0]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [eligible, setEligible] = useState(true);
    const [surveyEligible, setSurveyEligible] = useState(false);
    const [surveyFilled, setSurveyFilled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const totalQuestions = questionsConfig.length;
    const [errorMessages, setErrorMessages] = useState({});
    const [user, setUser] = useState({ 'name': 'Naveen' });

    const handleInputChange = (questionId, value) => {
        setCurrentAnswer(value)
        setValidationErrors("")
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: value,
        }));
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            fetch(`${API_HOST}/accounts/check-eligibility/`, {
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + cookies.authtoken
                }
            }).then((response) => {
                return new Promise((resolve) => response.json()
                    .then((json) => resolve({
                        status: response.status,
                        json,
                    })));
            }).then(({ status, json }) => {
                if (status !== 200) setErrorMessages(json)
                else {
                    if (json.eligible) {
                        setSurveyEligible(json.eligible);
                        setSurveyFilled(json.completed || json.eligible);
                    }
                    setSurveyFilled(json.completed)
                }
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [cookies.authtoken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = (e, eligible) => {
        let questionAnswers = []
        questionsConfig.forEach((question) => {
            questionAnswers.push({
                id: question.id,
                question: question.question,
                answer: formData[question.id]
            })
        });
        const data = {
            eligible: eligible,
            answers: questionAnswers
        }
        fetch(`${API_HOST}/accounts/survey-questions/update/`, {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + cookies.authtoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            return new Promise((resolve) => response.json()
                .then((json) => resolve({
                    status: response.status,
                    json,
                })));
        }).then(({ status, json }) => {
            if (status !== 200) setErrorMessages(json)
            else {
                setErrorMessages({ detail: 'Data is submitted successfully' })
                setSurveyEligible(true)
                setSurveyFilled(true)
            }
        });
    };

    const handleQuestion = (next) => {
        if (next && question.required && !currentAnswer && !formData[question.id]) {
            setValidationErrors("Please submit an option");
            return;
        }
        setCurrentAnswer("");
        setEligible(true);

        if (next) {
            setCurrentQuestion(currentQuestion + 1);
            setQuestion(questionsConfig[currentQuestion + 1]);
        } else {
            setCurrentQuestion(currentQuestion - 1);
            setQuestion(questionsConfig[currentQuestion - 1]);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        handleQuestion(true);
    };
    const handlePrevious = (e) => {
        e.preventDefault();
        handleQuestion(false);
    };

    const reTakeSurvey = () => {
        setSurveyFilled(false);
        setFormData({});
        setCurrentQuestion(0);
        setQuestion(questionsConfig[0]);
        setEligible(true);
        setValidationErrors("");
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardNav />
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8 font-poppins">
                <div className="bg-white rounded-xl shadow-lg p-5 mb-5 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Hey <span className="text-lg">👋</span> Welcome {user.name}! </h1>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {loading ? (
                        <div>Loading Survey...</div>
                    ) : error ? (
                        <div>Error loading Survey Data: {error}</div>
                    ) : surveyFilled && surveyEligible ? (
                        <div>
                            You have successfully submitted the questionnaire.<br /> You are eligible for carbon credits. Please upload
                            <Link to={"/documents"} className="text-yellow-300 hover:underline"> Documents </Link> from my documents tab.
                        </div>
                    ) : surveyFilled && !surveyEligible ? (
                        <div>
                            <p>
                                You have completed the survey.<br />
                                Sorry!!! You are not eligible for carbon credits based on the answers you have submitted
                            </p>
                            <br />
                            <p>
                                Is there a mistake? Would you like to retake the survey questions?
                            </p>
                            <button className="bg-green-700 text-white rounded-2xl py-2 px-3 mt-4"
                                onClick={() => reTakeSurvey()}>Retake Survey</button>
                        </div>
                    ) : (
                        <div>
                            {eligible && question && (
                                <div className="mb-8 px-6">
                                    <div key={question.id} className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                            Question {currentQuestion + 1} of {totalQuestions}
                                        </h2>
                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                            <p className="text-lg font-medium text-gray-700">
                                                {question.id}. {question.question}
                                            </p>
                                        </div>
                                        {question.type === "radio" && (
                                            <div className="space-y-4">
                                                {question.options.map((option) => (
                                                    <label key={option} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                                                        <div className="relative">
                                                            <input
                                                                type="radio"
                                                                id={`option_${option}`}
                                                                name={`question_${question.id}`}
                                                                value={option}
                                                                checked={formData[question.id] === option}
                                                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                                            />
                                                            <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${formData[question.id] === option ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                                                                {formData[question.id] === option && (
                                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="ml-3 text-base font-medium text-gray-700">
                                                            {option}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {question.type === "select" && (
                                            <select
                                                value={formData[question.id] || ""}
                                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="">Select an option</option>
                                                {question.options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {question.type === "textarea" && (
                                            <textarea
                                                value={formData[question.id] || ""}
                                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                rows="4"
                                            />
                                        )}
                                    </div>
                                    {validationErrors && (
                                        <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{validationErrors}</div>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                {((totalQuestions > currentQuestion && currentQuestion !== 0) || !eligible) && (
                                    <button onClick={handlePrevious}
                                        className="bg-white text-green-700 border border-green-700 rounded-lg py-2 px-6 font-medium hover:bg-green-50 transition duration-300">
                                        ← Previous
                                    </button>
                                )}
                                {((eligible && currentQuestion >= 0) && (totalQuestions !== currentQuestion + 1)) && (
                                    <button onClick={handleNext}
                                        className="bg-green-700 text-white rounded-lg py-2 px-6 font-medium hover:bg-green-800 transition duration-300 ml-auto">
                                        Next →
                                    </button>
                                )}
                                {((eligible && currentQuestion >= 0) && (totalQuestions === currentQuestion + 1)) && (
                                    <button onClick={(e) => handleSubmit(e, true)}
                                        className="bg-green-700 text-white rounded-lg py-2 px-6 font-medium hover:bg-green-800 transition duration-300 ml-auto">
                                        Submit
                                    </button>
                                )}
                            </div>
                            {renderErrorMessage('detail', errorMessages)}
                            {renderSubErrorMessage('error', 'user', errorMessages)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
