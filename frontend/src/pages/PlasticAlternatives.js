import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import plasticAlternativesHeader from '../assets/images/sc-solutions/plastic-alternatives/plastic-alternatives-image2.png';
import plasticAlternativesContent from '../assets/images/sc-solutions/plastic-alternatives/alternatives-to-plastic-image1.png';

const PlasticAlternatives = () => {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <img
               src={plasticAlternativesHeader}
               alt="Plastic Alternatives Header"
               className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                  Plastic Alternatives
               </h1>
            </div>
         </div>
         <main className="flex-grow bg-[#e6f3f5] px-4 py-8 font-poppins">
            <div className="container mx-auto max-w-4xl">
               <section className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Empowering SMEs with Sustainable Solutions</h2>
                  <p className="mb-4">
                     At SustainCred, we are dedicated to supporting small and medium-sized enterprises (SMEs) in their journey towards sustainability. Our mission is to help businesses in the environmentally friendly plastic alternatives sector generate carbon credits, contributing to a greener future.
                  </p>
                  <p className="mb-4">
                     Plastic pollution is a significant environmental issue, with millions of tons of plastic waste entering our oceans and ecosystems annually. Plastics do not biodegrade; instead, they break down into microplastics that persist in the environment for centuries, harming wildlife and potentially entering the human food chain. The production of plastic also contributes to climate change, as it is derived from fossil fuels and generates substantial greenhouse gas emissions.
                  </p>
                  <p className="mb-4">
                     Alternatives to plastic, such as biodegradable materials and reusable products, can significantly reduce this environmental burden. By replacing single-use plastics with sustainable alternatives, we can lower greenhouse gas emissions and reduce plastic pollution. This shift supports the goals of the <strong><a href="https://unfccc.int/process-and-meetings/the-paris-agreement/the-paris-agreement" className="text-primary hover:underline">Paris Agreement</a></strong>, which aims to limit global warming to well below 2°C, and aligns with net-zero targets by minimizing the carbon footprint of materials used in everyday products.
                  </p>
                  <p className="mb-4">
                     Carbon credits play a crucial role in promoting plastic alternatives. They provide financial incentives for companies to invest in sustainable practices and technologies. By generating carbon credits, projects that replace plastic with eco-friendly materials can offset their emissions and attract funding. This not only helps in reducing overall carbon emissions but also accelerates the transition to a circular economy, where waste is minimized, and resources are reused.
                  </p>
               </section>

               <section className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Our Comprehensive Approach</h2>
                  <p className="mb-4">
                     We guide SMEs through every step of the carbon credit generation process, ensuring compliance with the highest standards:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                     <li><strong>Eligibility Assessment:</strong> We evaluate your projects to determine their eligibility for carbon credits under recognized standards such as Verra and Gold Standard.</li>
                     <li><strong>Verification and Validation:</strong> Our team assists in the rigorous verification and validation process, ensuring that your projects meet all necessary criteria.</li>
                     <li><strong>Audit Support:</strong> We provide comprehensive support during the audit phase, helping you navigate the complexities and ensuring a smooth process.</li>
                     <li><strong>Carbon Credit Sales:</strong> Once your carbon credits are verified, we assist in marketing and selling them, maximizing your returns and contributing to global sustainability efforts.</li>
                  </ul>
               </section>

               <section className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4">Carbon Credits Generation Process</h2>
                  <p className="mb-4">
                     Each standard has its own process for carbon credits verification. We choose a standard after consulting with you and understand your business model, requirements and timelines. Below are approaches by Verra and Gold standard:
                  </p>
                  <h3 className="text-xl font-bold text-primary mb-2">Verra's Plastic Waste Reduction Program</h3>
                  <p className="mb-4">
                     The 3R Initiative, of which Verra is a founding member, conceptualized and supported the development of the Plastic Program. <strong><a href="https://verra.org/programs/plastic-program/" className="text-primary hover:underline">Verra's Plastic Waste Reduction Program</a></strong> enables the robust impact assessment of new or scaled-up waste collection and recycling projects. The process includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                     <li><strong>Project Design:</strong> Develop a project plan that outlines the plastic waste collection and recycling activities.</li>
                     <li><strong>Validation:</strong> An independent validation body reviews the project plan to ensure it meets Verra's standards.</li>
                     <li><strong>Implementation:</strong> Execute the project, focusing on collecting and recycling plastic waste.</li>
                     <li><strong>Monitoring:</strong> Continuously monitor the project's performance and gather data on the volume of plastic waste collected and recycled.</li>
                     <li><strong>Verification:</strong> An independent verification body audits the project to confirm the reported outcomes.</li>
                     <li><strong>Issuance of Credits:</strong> Verra issues Waste Collection Credits (WCCs) and Waste Recycling Credits (WRCs) based on the verified volume of plastic waste managed.</li>
                  </ul>
                  <h3 className="text-xl font-bold text-primary mb-2">Gold Standard's Approach</h3>
                  <p className="mb-4">
                     <strong><a href="https://www.goldstandard.org/" className="text-primary hover:underline">Gold Standard</a></strong> focuses on high-integrity carbon credits and sustainable development. The process includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                     <li><strong>Project Design:</strong> Create a detailed project plan that aligns with Gold Standard's requirements for plastic waste management.</li>
                     <li><strong>Preliminary Review:</strong> Submit the project plan for an initial review to ensure it meets the eligibility criteria.</li>
                     <li><strong>Validation:</strong> An accredited third-party validator assesses the project plan and its potential impact.</li>
                     <li><strong>Implementation:</strong> Carry out the project activities, emphasizing the reduction of plastic waste and environmental benefits.</li>
                     <li><strong>Monitoring and Reporting:</strong> Collect data on the project's performance and prepare monitoring reports.</li>
                     <li><strong>Verification:</strong> An independent verifier reviews the monitoring reports and conducts site visits to validate the project's outcomes.</li>
                     <li><strong>Issuance of Credits:</strong> Gold Standard issues carbon credits based on the verified reduction in plastic waste and associated environmental benefits.</li>
                  </ul>
               </section>

               <section className="mb-8">
                  <div className="w-full h-auto max-w-2xl mx-auto mb-8 overflow-hidden rounded-lg shadow-lg">
                     <img
                        src={plasticAlternativesContent}
                        alt="Plastic Alternatives Process"
                     />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">Why Choose SustainCred?</h2>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                     <li><strong>Expertise:</strong> Our team has extensive experience in the carbon credit market and a deep understanding of the verification processes.</li>
                     <li><strong>Tailored Solutions:</strong> We offer customized solutions that cater to the unique needs of your business.</li>
                     <li><strong>Sustainability Focus:</strong> We are committed to promoting sustainable practices and helping you achieve your environmental goals.</li>
                  </ul>
                  <p className="mb-4">
                     Join us in making a positive impact on the planet. Together, we can create a sustainable future, one carbon credit at a time.
                  </p>
               </section>
            </div>
         </main>
         <Footer />
      </div>
   );
};

export default PlasticAlternatives;
