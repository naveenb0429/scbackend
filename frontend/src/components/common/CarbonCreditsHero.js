import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'
import EarthIcon from '../../assets/illustrations/earthicon.webp';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import { useRef, useEffect } from 'react';

const CarbonCreditsHero = () => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, amount: 0.2 });
   const controls = useAnimationControls();
   const isFirstAnimation = useRef(true);
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.05, delayChildren: 0.5 }
      }
   };

   const letterVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
         opacity: 1,
         y: 0,
         transition: { duration: 0.2, ease: "easeOut" }
      }
   };

   const imageVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
         opacity: 1,
         scale: 1,
         transition: { duration: 1.0, ease: "easeOut", delay: 0.6 }
      }
   };

   useEffect(() => {
      if (isInView && isFirstAnimation.current) {
         controls.start("visible");
         isFirstAnimation.current = false;
      }
   }, [isInView, controls]);

   const renderTypingText = (text) => {
      return text.split('').map((char, index) => {
         if (char === ' ') {
            return (
               <span key={`space-${index}`} className="w-2 inline-block"></span>
            );
         }

         return (
            <motion.span
               key={`${char}-${index}`}
               variants={letterVariants}
               className="inline-block"
            >
               {char}
            </motion.span>
         );
      });
   };

   return (
      <motion.div
         ref={ref}
         initial="hidden"
         animate={isInView ? "visible" : "hidden"}
         variants={containerVariants}
         className="relative bg-gradient-to-br from-[#E1F3F5] to-[#C7E8EC] py-12 sm:py-20 md:py-24 overflow-hidden"
      >
         <div
            className="absolute inset-0 z-0 opacity-50"
            style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
               backgroundSize: '200px 200px',
            }}
         >
         </div>
         <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
               <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                  <motion.h1
                     variants={containerVariants}
                     className="text-4xl sm:text-5xl md:text-6xl font-bold font-merriweather tracking-wide mb-6 lg:leading-tight"
                  >
                     <span className="text-[#093620]">Partnering in your</span>
                     <br />
                     <span className="text-[#672F16]">
                        {renderTypingText("carbon credits")}
                     </span>
                     <br />
                     <span className="text-[#093620]">journey</span>
                  </motion.h1>
                  <motion.p
                     variants={letterVariants}
                     className="text-gray-700 text-sm sm:text-lg mb-8 sm:mb-10 max-w-xl font-lora leading-relaxed"
                  >
                     Your entire carbon credits journey in one platform from identifying
                     opportunities to verification, all aligned with your chosen standard
                  </motion.p>
                  <motion.div variants={letterVariants}>
                     <Link
                        to="/request-demo"
                        className="inline-flex items-center bg-[#2B6E2B] font-lora font-medium text-white py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-full hover:bg-green-800 transition duration-300 text-sm sm:text-base group shadow-md hover:shadow-lg"
                     >
                        <span className="mr-2">REQUEST A DEMO</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                     </Link>
                  </motion.div>
               </div>
               <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                  <motion.div
                     className="relative"
                     variants={imageVariants}
                  >
                     <motion.img
                        src={EarthIcon}
                        alt="Earth-Icon"
                        className="w-full max-w-lg lg:max-w-xl h-auto relative z-10"
                        initial={{ filter: "blur(10px)" }}
                        animate={{ filter: "blur(0)" }}
                        transition={{ duration: 0.6 }}
                        loading='lazy'
                     />
                  </motion.div>
               </div>
            </div>
         </div>
      </motion.div>
   );
};

export default CarbonCreditsHero;