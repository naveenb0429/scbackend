/* eslint-disable no-unused-vars */
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { STEPS, REASONS } from '../../constants/index'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Component() {
   const approachRef = useRef(null)
   const isInView = useInView(approachRef, { once: true, amount: 0.1 })

   return (
      <div
         id="our-approach"
         ref={approachRef}
         className="bg-gradient-to-br from-[#E1F3F5] to-[#C7E8EC] py-16 px-4 sm:px-6 lg:px-8"
      >
         <div className="max-w-7xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
               className="text-center mb-12 md:mb-24"
            >
               <h1 className="text-4xl md:text-5xl text-[#008000] font-bold font-lora">Our Approach</h1>
            </motion.div>

            <div className="mb-24 font-poppins">
               <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#a4765d]"></div>
                  {STEPS.map((step, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, delay: isInView ? index * 0.2 : 0 }}
                        className={`flex items-center mb-12 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
                     >
                        <div
                           className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                              } relative`}
                        >
                           <div className="bg-white rounded-lg shadow-xl p-6 inline-block relative">
                              <div className="absolute top-0 left-0 bg-[#754E39] text-white w-8 h-8 flex items-center justify-center rounded-tl-lg rounded-br-lg font-bold md:hidden">
                                 {index + 1}
                              </div>
                              <div className="flex items-center justify-between mb-4 mt-6 md:mt-0">
                                 <h3 className="text-lg md:text-xl font-semibold text-green-800">{step.title}</h3>
                                 <img src={step.icon} alt={step.title} className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
                              </div>
                              <p className="text-black text-left text-sm sm:text-base">{step.description}</p>
                           </div>
                           <div
                              className="hidden md:flex absolute top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#754E39] rounded-full items-center justify-center"
                              style={{
                                 [index % 2 === 0 ? 'right' : 'left']: '-1rem',
                                 marginLeft: index % 2 === 0 ? '' : '-8px',
                                 marginRight: index % 2 === 0 ? '-8px' : ''
                              }}
                           >
                              <span className="text-white font-bold">{index + 1}</span>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
               transition={{ duration: 0.5 }}
               className="p-4 sm:p-8 md:p-12"
            >
               <h2 className="text-3xl sm:text-4xl text-black font-bold mb-12 font-lora text-center">
                  <span className="text-[#008000]">Why </span>Choose SustainCred?
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 font-poppins">
                  {REASONS.map((reason, index) => (
                     <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-xl p-4 sm:p-6 shadow-md relative overflow-hidden"
                     >
                        <div className="flex flex-col sm:flex-row items-start">
                           <div className="bg-neutral-100 rounded-full p-3 mb-4 sm:mb-0 sm:mr-4">
                              <reason.icon className="w-6 h-6 text-[#754E39]" />
                           </div>
                           <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">{reason.title}</h3>
                              <p className="text-sm sm:text-base text-gray-700">{reason.description}</p>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
               <div className="mt-8 sm:mt-12 text-center">
                  <p className="text-sm sm:text-lg font-poppins text-black mb-6 max-w-2xl mx-auto">
                     Join us in making a lasting impact on our planet. Together, we'll forge a sustainable future, transforming
                     challenges into opportunities, one carbon credit at a time.
                  </p>
                  <Link
                     to="/request-demo"
                     className="inline-flex items-center bg-[#2B6E2B] font-lora font-medium text-white py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-full hover:bg-green-800 transition duration-300 text-sm sm:text-base group shadow-md hover:shadow-lg"
                  >
                     <span className="mr-2">REQUEST A DEMO</span>
                     <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
               </div>
            </motion.div>
         </div>
      </div>
   )
}