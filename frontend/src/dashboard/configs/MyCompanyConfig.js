const questionsConfig = [
    {
        id: 1,
        question: "What industry is your company in?",
        type: "radio",
        options: ["Energy sector including waste to energy", "CH4 mitigation sector ( Venting and flaring removal)",
            "DAC or CCUS", "Composting or waste management", "Alternatives to plastics", "None of the above"],
        endOnOption: [6],
        required: true
    },
    {
        id: 2,
        question: "What sub-sector is your company in?",
        type: "radio",
        options: ["Solar", "Wind", "Hydro", "Geothermal", "Tidal Energy", "CH4 Venting Removal", "CH4 Flaring Removal", "CCUS", "DAC", "Waste Composting", "Composters", "Alternatives to Plastics Materials", "Waste to Energy", "None of the Above"],
        endOnOption: [13],
        required: true
    },
    {
        id: 3,
        question: "Which country your operations are located in?",
        type: "radio",
        options: ["Classified region/country as “least developed” by World Bank", "India", "China",
            "Other developing countries as classified by world bank",
            "Developed country as classified by world bank"],
        endOnOption: ["Developed country as classified by world bank"],
        required: true
    },
    {
        id: 4,
        question: "What activities does your company perform within the selected sector?",
        type: "radio",
        options: ["Generation of renewable energy or alternative energy",
            "Renewable energy sale to the grid",
            "Selling plastic alternatives ",
            "Selling composters",
            "Selling sub-parts and semi finished parts required for enabling renewable energy sector ie., suppliers to renewable energy generation company",
            "Distribution of solar panels or windmills etc"],
        endOnOption: [5, 6],
        required: true
    },
    {
        id: 5,
        question: "Do you have data available for the following",
        type: "radio",
        options: ["Electricity usage", "Fuel used", "Transportation", "Sale of products", "Supply chain data", "All of the Above", "None of the Above"],
        required: true
    }
];

export default questionsConfig;
