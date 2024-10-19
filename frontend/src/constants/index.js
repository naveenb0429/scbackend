import dataExtraction from "../assets/images/our-approach/data-extraction.png"
import globalEcology from "../assets/images/our-approach/baseline.png"
import greenIndustry from "../assets/images/our-approach/verification.png"
import magnifyingGlass from "../assets/images/our-approach/magnifying-glass.png"

import { Users, Cog, Leaf } from "lucide-react"

export const TRANSPORT_TYPES = ['ROAD', 'RAIL', 'AIR', 'SEA',];

export const blogs = [
  {
    uid: 1,
    image: require("../assets/images/blog/blog-05.jpg"),
    image_2: require("../assets/images/blog/blog-06.jpg"),
    date: "06 Oct 2023",
    title: "Energy Transition and role of renewables in developing nations",
    main_desc:
      "World is currently facing a dual challenge - providing access to energy to all while reducing emissions to keep the planet away from tipping point and decelerate global warming. While developing nations have not contributed at a large scale to global warming in the past, most of them dispropotionally face the effects of global warming today in the form of rising temperatures, tropical zones converting to arid areas and in few cases resulting in mass migration and displacement of people. On the flip side, energy is crucial to uplift people from poverty and for developing nations to continue their development. Hence, they cannot reduce energy consumption at a time of economy boom and none should be forced to choose between economic prospertiy and future of the planet. Hence, energy transition is pivotal in our dually challenged world.",
  },
  {
    uid: 2,
    image: require("../assets/images/blog/blog_2.webp"),
    image_2: require('../assets/images/blog/blog_2.webp'),
    date: "28 Nov 2023",
    title:
      "The Evolution of Carbon Credits: From Conception to the Net Zero Horizon",
    main_desc: "The concept of carbon credits has emerged as a pioneering solution in the global fight against climate change, providing a mechanism to incentivize emission reductions and foster sustainable practices. Originating from international agreements like the Kyoto Protocol, the journey of carbon credits has seen significant progress.The inception of carbon credits can be traced back to the late 20th century with the establishment of the Kyoto Protocol in 1997. This landmark international treaty marked the first serious attempt to address the growing concern of greenhouse gas emissions. A key feature of the Kyoto Protocol was the introduction of the Clean Development Mechanism (CDM). The CDM aimed to facilitate emission reductions in a cost-effective manner by allowing developed countries to invest in emission reduction projects in developing nations. In return, these developed nations would receive Certified Emission Reductions (CERs), commonly known as carbon credits. This mechanism not only stimulated global cooperation but also acknowledged the principle of common but differentiated responsibilities.",
    sec_dec: 'The Paris Agreement, adopted in 2015, emphasized the role of market-based approaches in achieving emission reduction goals. Article 6 of the Paris Agreement provided a framework for countries to engage in emissions trading and other market mechanisms, ensuring a continued role for carbon credits in the evolving climate landscape. One can argue this was also a turning point and created Voluntary carbon markets. Companies and individuals, recognizing the urgency of climate action, are voluntarily offsetting their carbon footprints by purchasing carbon credits. This trend indicates a growing awareness of the need for collective responsibility in addressing climate change and achieving net-zero targets. Given that most standards in voluntary market as well require additionality tests to be performed, with more digital advancements its becoming easier to certify businesses for carbon credits generation and trading.\n As the world collectively aims for net-zero emissions, carbon credits have become an indispensable tool in the journey. Companies and nations can utilize carbon credits to offset their residual emissions, allowing for a balanced approach to achieving net-zero targets. In addition, with introduction of carbon tax and an informal carbon budget, there is an ever increasing demand for carbon credits while simultaneously monetarily supporting projects to contribute to a greener world.'
  },
];

export const API_HOST = `${window.location.origin}/server`

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let startYear = 2020
export const DASHBOARD_YEARS = Array(new Date().getFullYear() - startYear + 1).fill().map(() => startYear++);

export const validateInput = (e) => {
  const specialKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Enter',
    'Home',
    'End'
  ];

  if (e.ctrlKey || e.metaKey) {
    const controlKeys = ['a', 'c', 'v', 'x'];
    if (controlKeys.includes(e.key.toLowerCase())) {
      return;
    }
  }

  if (specialKeys.includes(e.key)) {
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};


export const REGIONS = [
  { value: "AF", label: "Africa" },
  { value: "AS", label: "Asia" },
  { value: "EU", label: "Europe" },
  { value: "NA", label: "North America" },
  { value: "OC", label: "Oceania" },
  { value: "SA", label: "South America and the Caribbean" }
];

export const COUNTRIES_BY_REGION = {
  AF: [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad",
    "Comoros", "Congo", "Côte d'Ivoire", "DR Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
    "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
    "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
    "Sao Tome & Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
    "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ],
  AS: [
    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus",
    "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait",
    "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman",
    "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Tajikistan",
    "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
  ],
  EU: [
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark",
    "Estonia", "Finland", "France", "Germany", "Greece", "Holy See", "Hungary", "Iceland", "Ireland", "Italy",
    "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain",
    "Sweden", "Switzerland", "Ukraine", "United Kingdom"
  ],
  NA: ["Canada", "United States"],
  OC: [
    "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa",
    "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"
  ],
  SA: [
    "Antigua and Barbuda", "Argentina", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica",
    "Cuba", "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Grenada", "Guatemala", "Guyana", "Haiti", "Honduras",
    "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Saint Kitts & Nevis", "Saint Lucia", "St. Vincent & Grenadines", "Suriname",
    "Trinidad and Tobago", "Uruguay", "Venezuela"
  ]
};

export const productOverviewItems = [
  {
    title: "Carbon One",
    content: "Carbon One is a comprehensive SaaS platform designed to support sustainable companies in generating, verifying, and selling carbon credits. Our platform ensures that only companies eligible under recognized standards such as the Gold Standard or GCC can participate by integrating it with best in class LCA tools."
  },
  {
    title: "Why LCAs are Crucial",
    content: "Life Cycle Assessments (LCAs) are integral to the Carbon One platform. They provide a detailed evaluation of the environmental impacts associated with every stage of a product's life cycle, from raw material extraction to disposal. Here's how LCAs support the carbon credit process:\n\n• Accurate Emissions Calculation: LCAs enable precise measurement of a company's carbon footprint, which is essential for generating credible carbon credits.\n• Verification Support: LCAs provide the necessary data and documentation to facilitate the verification process, ensuring that carbon credits meet stringent standards.\n• Transparency and Accountability: By offering comprehensive insights into carbon emissions, LCAs ensure transparency and accountability, which are key for maintaining the integrity of carbon credits.\n\nFrom calculating emissions to managing carbon credits and facilitating verification, Carbon One offers a full suite of tools to meet your needs. This platform empowers businesses to take control of their carbon footprint and contribute to global sustainability goals."
  },
  {
    title: "CBAM One",
    content: "Navigating the complexities of the Carbon Border Adjustment Mechanism (CBAM) can be challenging, but with CBAM One, compliance is straightforward and efficient. CBAM One is designed to help businesses seamlessly align with the EU's CBAM regulations, which aim to prevent carbon leakage and promote global climate action by imposing carbon tariffs on imported goods."
  },
  {
    title: "Who Needs to Comply with CBAM?",
    content: "CBAM primarily targets industries that are carbon-intensive and at risk of carbon leakage. This includes companies involved in:\n\n• Steel and Iron Production\n• Cement Manufacturing\n• Aluminum Production\n• Fertilizer Production\n• Electricity Generation"
  },
  {
    title: "Why LCAs are Essential for CBAM Compliance",
    content: "Life Cycle Assessments (LCAs) are at the heart of CBAM compliance. They provide a detailed evaluation of the environmental impacts associated with every stage of a product's life cycle, from raw material extraction to disposal. Here's how LCAs support CBAM compliance:\n\n• Precise Carbon Footprint Calculation: LCAs enable accurate measurement of the carbon footprint of products, essential for determining the appropriate carbon tariffs under CBAM.\n• Enhanced Transparency: By offering comprehensive insights into carbon emissions at each stage of the product lifecycle, LCAs ensure transparency and accountability, key requirements for CBAM compliance.\n• Regulatory Adherence: LCAs provide the necessary documentation and data to demonstrate compliance with CBAM regulations, ensuring that the carbon price has been accounted for.\n• Sustainability Reporting: LCAs facilitate detailed sustainability reporting, helping businesses effectively communicate their environmental impact and sustainability efforts.\n\nOur CBAM One tool simplifies these complex regulatory requirements, providing a seamless path to compliance and helping companies stay ahead in the evolving landscape of carbon regulations. With CBAM One, you can ensure your business meets regulatory standards while contributing to global sustainability goals."
  }
];


export const STEPS = [
  { title: "Eligibility Determination", icon: magnifyingGlass, description: "Collect basic data about your general business model" },
  { title: "Baseline Consultation", icon: globalEcology, description: "Our state of art algorithm helps you decide the most appropriate baseline for comparing your project against" },
  { title: "Data Extraction", icon: dataExtraction, description: "We leverage machine learning to perform carbon accounting calculations to calculate the number of carbon credits generated by your project" },
  { title: "Verification", icon: greenIndustry, description: "We perform multiple models and audit the numbers so that data is ready to be verified by your chosen standard" }
]

export const REASONS = [
  {
    title: "Expertise",
    icon: Users,
    description: "Our team has extensive experience in the carbon credit market and a deep understanding of the verification processes."
  },
  {
    title: "Tailored Solutions",
    icon: Cog,
    description: "We offer customized solutions that cater to the unique needs of your business."
  },
  {
    title: "Sustainability Focus",
    icon: Leaf,
    description: "We are committed to promoting sustainable practices and helping you achieve your environmental goals."
  }
]