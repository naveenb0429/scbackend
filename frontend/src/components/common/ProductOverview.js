import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import sunriseBackground from "../../assets/images/misc/sunrise-background.png";
import { productOverviewItems } from '../../constants/index';

const CheckIcon = () => (
   <svg className="inline-block w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
   </svg>
);

export const scrollToProductOverview = () => {
   const element = document.getElementById('product-overview');
   if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
   }
};

const ProductOverview = () => {
   const [activeItem, setActiveItem] = React.useState(null);
   const overviewRef = useRef(null);
   const isInView = useInView(overviewRef, { once: true, amount: 0.1 });

   const formatContent = (content, index) => {
      const lines = content.split('\n');
      return lines.map((line, lineIndex) => {
         if (line.startsWith('•')) {
            const [title, ...rest] = line.substring(1).split(':');
            return (
               <p key={lineIndex} className="mb-2">
                  <CheckIcon />
                  <span className="font-semibold">{title}{rest.length > 0 && ':'}</span> {rest.join(':')}
               </p>
            );
         }
         return <p key={lineIndex} className="mb-2 font-medium">{line}</p>;
      });
   };

   const handleItemClick = (index) => {
      setActiveItem(index);
   };

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.2, delayChildren: 0.3 }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { duration: 0.6, ease: "easeOut" }
      }
   };

   return (
      <motion.div
         id="product-overview"
         ref={overviewRef}
         initial="hidden"
         animate={isInView ? "visible" : "hidden"}
         variants={containerVariants}
         className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8 sm:py-12 md:py-16 font-poppins"
      >
         <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${sunriseBackground})` }}
         ></div>
         <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
               variants={itemVariants}
               className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lora font-bold mb-6 sm:mb-8 md:mb-12 lg:mb-16 text-center text-[#F8F7F7] leading-tight"
            >
               Product Overview
            </motion.h2>
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12">
               <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 md:space-y-8">
                  {productOverviewItems.slice(0, 2).map((item, index) => (
                     <motion.div
                        key={index}
                        variants={itemVariants}
                        onClick={() => handleItemClick(index)}
                        className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:from-white/15 hover:to-white/10 hover:shadow-xl border border-white/10 hover:border-white/20"
                     >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-lora font-semibold mb-2 sm:mb-3 md:mb-4 text-[#F8F7F7] group-hover:text-[#E1F3F5] transition-colors duration-300">
                           {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-[#F8F7F7]/80 group-hover:text-[#F8F7F7]/90 line-clamp-3 transition-colors duration-300 mb-3 sm:mb-4">
                           {item.content}
                        </p>
                        <button
                           className="flex items-center text-[#E1F3F5] hover:text-white transition-colors duration-300 group"
                        >
                           <span className="text-xs sm:text-sm font-semibold">More Info</span>
                           <svg className="w-4 h-4 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                           </svg>
                        </button>
                     </motion.div>
                  ))}
               </div>
               <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 md:space-y-8">
                  {productOverviewItems.slice(2).map((item, index) => (
                     <motion.div
                        key={index + 2}
                        variants={itemVariants}
                        onClick={() => handleItemClick(index + 2)}
                        className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:from-white/15 hover:to-white/10 hover:shadow-xl border border-white/10 hover:border-white/20"
                     >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-lora font-semibold mb-2 sm:mb-3 md:mb-4 text-[#F8F7F7] group-hover:text-[#E1F3F5] transition-colors duration-300">
                           {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-[#F8F7F7]/80 group-hover:text-[#F8F7F7]/90 line-clamp-3 transition-colors duration-300 mb-3 sm:mb-4">
                           {item.content}
                        </p>
                        <button
                           className="flex items-center text-[#E1F3F5] hover:text-white transition-colors duration-300 group"
                        >
                           <span className="text-xs sm:text-sm font-semibold">More Info</span>
                           <svg className="w-4 h-4 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                           </svg>
                        </button>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
         {activeItem !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setActiveItem(null)}>
               <div
                  className="bg-[#E1F3F5] text-[#093620] rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[800px] h-[90vh] max-h-[600px] border border-[#2B6E2B] border-opacity-20 shadow-xl overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
               >
                  <h4 className="text-lg sm:text-xl md:text-2xl font-lora font-bold mb-3 sm:mb-4">{productOverviewItems[activeItem].title}</h4>
                  <div className="mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">
                     {formatContent(productOverviewItems[activeItem].content, activeItem)}
                  </div>
               </div>
            </div>
         )}
      </motion.div>
   );
};

export default ProductOverview;