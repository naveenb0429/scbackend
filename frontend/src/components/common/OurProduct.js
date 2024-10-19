import React from 'react';
import { motion, useInView } from 'framer-motion';
import productImage from '../../assets/images/misc/analytics-dashboard.png';

export default function OurProduct() {
   const ref = React.useRef(null);
   const isInView = useInView(ref, { once: true, amount: 0.3 });

   return (
      <div id="product" className="relative bg-white" ref={ref}>
         <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16">
            <div className="flex flex-col items-center">
               <motion.div
                  className="max-w-5xl text-center mb-6 sm:mb-8 md:mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isInView ? 1 : 0 }}
                  transition={{ duration: 1 }}
               >
                  <p className="font-poppins text-sm sm:text-base md:text-lg leading-6 sm:leading-7 text-black tracking-wide">
                     At SustainCred, we leverage cutting-edge automation to streamline Life Cycle Assessment (LCA) processes,
                     significantly reducing lead times and enhancing efficiency. Our innovative solutions are delivered through
                     a robust Software as a Service (SaaS) platform, ensuring accessibility and ease of use for our clients.
                  </p>
               </motion.div>
               <motion.div
                  className="w-full mx-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
                  transition={{ duration: 1 }}
               >
                  <img
                     src={productImage}
                     alt="SustainCred Product"
                     className="w-full h-auto rounded-lg shadow-xl"
                     loading='lazy'
                  />
               </motion.div>
            </div>
         </div>
      </div>
   );
};

