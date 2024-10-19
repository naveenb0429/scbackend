import { useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaArrowRight } from 'react-icons/fa6';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi'
import Header from "../layouts/Header"
import Footer from "../layouts/Footer"

export default function RequestDemo() {
   const [formData, setFormData] = useState({
      industry: '',
      companySize: '',
      fullName: '',
      companyName: '',
      email: '',
      phoneNumber: '',
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
         ...prevData,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
         const response = await fetch('/api/request-demo', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            setSubmitMessage('Your demo request has been sent successfully!');
            setFormData({
               industry: '',
               companySize: '',
               fullName: '',
               companyName: '',
               email: '',
               phoneNumber: '',
            });
         } else {
            setSubmitMessage('There was an error sending your request. Please try again.');
         }
      } catch (error) {
         console.error('Error:', error);
         setSubmitMessage('There was an error sending your request. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen flex flex-col items-center p-4 py-8 sm:py-16 relative font-poppins">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold py-4 sm:py-8 text-[#174E25] text-center">Request a Demo</h1>
            <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-gray-100 rounded-lg overflow-hidden shadow-lg">
               {/* Contact information section */}
               <div className="bg-[#174E25] text-[#F3F3F3] p-6 sm:p-8 lg:p-10 w-full lg:w-2/5 flex flex-col justify-between order-last lg:order-first relative">
                  <div>
                     <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 block">Get in touch</h2>
                     <div className="mt-6 sm:mt-8 lg:mt-12 space-y-4">
                        <p className="flex items-center">
                           <HiOutlineMail className="mr-4 text-xl" />
                           team@sustaincred.com
                        </p>
                        <p className="flex items-center">
                           <HiOutlineLocationMarker className="mr-4 text-xl" />
                           HYDERABAD, TELANGANA, 500038, INDIA
                        </p>
                     </div>
                  </div>
                  <div className="flex space-x-4 mt-14 lg:mt-0">
                     <a href="https://x.com/Sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaXTwitter className="cursor-pointer" />
                     </a>
                     <a href="https://www.linkedin.com/company/sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaLinkedinIn className="cursor-pointer" />
                     </a>
                     <a href="https://www.instagram.com/sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaInstagram className="cursor-pointer" />
                     </a>
                  </div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 overflow-hidden pointer-events-none hidden md:block">
                     <div className="absolute w-40 h-40 rounded-full bg-[#75b686] opacity-20 right-0 bottom-0 transform translate-x-1/2 translate-y-1/2"></div>
                     <div className="absolute w-32 h-32 rounded-full bg-[#2A7D4F] opacity-15 right-12 bottom-12"></div>
                     <div className="absolute w-24 h-24 rounded-full bg-[#3CAB72] opacity-10 right-24 bottom-24"></div>
                  </div>
               </div>

               {/* Form section */}
               <div className="bg-white p-6 sm:p-8 lg:p-10 w-full lg:w-3/5 order-first lg:order-last">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 lg:hidden">Request a Demo</h2>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                     <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                           What industry is your company in? <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <select
                              id="industry"
                              name="industry"
                              value={formData.industry}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 pr-8 text-sm"
                              required
                           >
                              <option value="" disabled>Select an industry</option>
                              <option value="energy">Energy sector including waste to energy</option>
                              <option value="ch4">CH4 mitigation sector (Venting and flaring removal)</option>
                              <option value="dac">DAC or CCUS</option>
                              <option value="composting">Composting or waste management</option>
                              <option value="plastics">Alternatives to plastics</option>
                              <option value="other">Other</option>
                           </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                           What is your company size?
                        </label>
                        <div className="relative">
                           <select
                              id="companySize"
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 pr-8 text-sm"
                           >
                              <option value="" disabled>Select company size</option>
                              <option value="1-25">1 to 25</option>
                              <option value="25-100">25 to 100</option>
                              <option value="100-1000">100 to 1000</option>
                              <option value="1000+">1000+</option>
                           </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:w-1/2">
                           <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="w-full p-2 border-b focus:border-black focus:outline-none text-sm"
                              required
                           />
                        </div>
                        <div className="w-full sm:w-1/2">
                           <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="text"
                              id="companyName"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              className="w-full p-2 border-b focus:border-black focus:outline-none text-sm"
                              required
                           />
                        </div>
                     </div>
                     {/* Update the flex layout for email and phone fields */}
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:w-1/2">
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full p-2 border-b focus:border-black focus:outline-none text-sm"
                              required
                           />
                        </div>
                        <div className="w-full sm:w-1/2">
                           <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="w-full p-2 border-b focus:border-black focus:outline-none text-sm"
                              required
                           />
                        </div>
                     </div>
                     <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#174E25] text-white px-6 py-3 rounded hover:bg-green-800 flex items-center justify-center group"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? 'Sending...' : 'Send'}
                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </button>
                     {submitMessage && <p className={submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}>{submitMessage}</p>}
                  </form>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
}