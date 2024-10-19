import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutUs1 from '../../assets/images/misc/aboutus-1.png';
import aboutUs2 from '../../assets/images/misc/aboutus-2.png';

const variants = {
   hidden: { opacity: 0, y: 50 },
   visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
   }
};

const AnimatedSection = ({ children, className }) => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, amount: 0.3 });

   return (
      <motion.div
         ref={ref}
         initial="hidden"
         animate={isInView ? "visible" : "hidden"}
         variants={variants}
         className={className}
      >
         {children}
      </motion.div>
   );
};

export default function AboutUs() {
   return (
      <div id="about" className="relative bg-white">
         <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-16">
            <div className="mb-8 sm:mb-16 flex flex-col md:flex-row justify-between items-center">
               <AnimatedSection className="w-full md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-lora">
                     <span className="text-[#008000]">Who</span><br />
                     <span className="text-[#000000]">are we?</span>
                  </h2>
                  <p className="font-poppins text-sm sm:text-base leading-6 text-black tracking-wide">
                     SustainCred is a team made of individuals who have a combined experience of over 25 years, with 8 years experience in corporate and project level GHG accounting. We are also experts in SaaS solution implementation and development. We have work experience spanning across the globe.
                  </p>
                  <p className="font-poppins text-sm sm:text-base leading-6 text-black mt-4 tracking-wide">
                     Our founding team has worked in India, USA, UK, Indonesia & Germany. We bring deep sustainability expertise, global perspective, comprehensive policy knowledge, sustainability audit experience and SaaS solution know-how as a team together.
                  </p>
               </AnimatedSection>
               <AnimatedSection className="w-full md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
                  <img src={aboutUs1} alt="Solar Panels" className="w-full max-w-sm h-auto" />
               </AnimatedSection>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
               <AnimatedSection className="w-full md:w-1/2 mb-8 md:mb-0 order-1 md:order-2">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-lora">
                     <span className="text-[#008000]">What</span><br />
                     <span className="text-[#000000]">do we do?</span>
                  </h2>
                  <p className="font-poppins text-sm sm:text-base leading-6 text-black tracking-wide">
                     SustainCred helps small medium businesses across energy, waste management, composting and alternatives to plastic to quantify, qualify and measure potential carbon credits. We walk with you from beginning till end through the carbon credits registration process in voluntary markets.
                  </p>
               </AnimatedSection>
               <AnimatedSection className="w-full md:w-1/2 flex justify-center md:justify-start order-2 md:order-1 mb-8 md:mb-0">
                  <img src={aboutUs2} alt="Our Solution" className="w-full max-w-sm h-auto" />
               </AnimatedSection>
            </div>
         </div>
      </div>
   );
}