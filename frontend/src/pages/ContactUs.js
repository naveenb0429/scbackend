import { useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaArrowRight } from 'react-icons/fa6';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi'
import Header from "../layouts/Header"
import Footer from "../layouts/Footer"

export default function ContactUs() {
   const [formData, setFormData] = useState({
      fullName: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      industry: '',
      questions: '',
      message: ''
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
         const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            setSubmitMessage('Your message has been sent successfully!');
            setFormData({
               fullName: '',
               companyName: '',
               email: '',
               phoneNumber: '',
               industry: '',
               questions: '',
               message: ''
            });
         } else {
            setSubmitMessage('There was an error sending your message. Please try again.');
         }
      } catch (error) {
         console.error('Error:', error);
         setSubmitMessage('There was an error sending your message. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen flex flex-col items-center p-4 py-8 sm:py-16 relative font-poppins">
            <h1 className="text-3xl sm:text-4xl font-bold py-4 sm:py-8 text-[#174E25] text-center">Contact Us</h1>
            <div className="w-full max-w-5xl flex flex-col lg:flex-row-reverse bg-gray-100 rounded-lg overflow-hidden shadow-lg">
               <div className="bg-white p-6 sm:p-8 w-full lg:w-3/5 order-1 lg:order-1">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full sm:w-1/2 p-2 border-b focus:border-black focus:outline-none text-sm sm:text-base" required />
                        <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full sm:w-1/2 p-2 border-b focus:border-black focus:outline-none text-sm sm:text-base" required />
                     </div>
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full sm:w-1/2 p-2 border-b focus:border-black focus:outline-none text-sm sm:text-base" required />
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full sm:w-1/2 p-2 border-b focus:border-black focus:outline-none text-sm sm:text-base" />
                     </div>
                     <input
                        type="text"
                        name="industry"
                        placeholder="Your Industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full p-2 border-b focus:border-black focus:outline-none text-sm sm:text-base"
                     />
                     <div>
                        <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-1">
                           Do you have any questions for us?
                        </label>
                        <textarea
                           id="questions"
                           name="questions"
                           value={formData.questions}
                           onChange={handleChange}
                           className="w-full p-2 border-b focus:border-black focus:outline-none resize-none text-sm sm:text-base"
                           rows="3"
                        ></textarea>
                     </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                           What is your product or company sector?
                        </label>
                        <textarea
                           id="message"
                           name="message"
                           value={formData.message}
                           onChange={handleChange}
                           className="w-full p-2 border-b focus:border-black focus:outline-none resize-none text-sm sm:text-base"
                           rows="3"
                        ></textarea>
                     </div>
                     <button
                        type="submit"
                        className="bg-[#174E25] text-white px-4 sm:px-6 py-2 rounded hover:bg-green-800 flex items-center group text-sm sm:text-base"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? 'Sending...' : 'Send'}
                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </button>
                     {submitMessage && <p className={`text-sm sm:text-base ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{submitMessage}</p>}
                  </form>
               </div>
               <div className="bg-[#174E25] text-[#F3F3F3] p-6 sm:p-8 w-full lg:w-2/5 flex flex-col justify-between relative order-2 lg:order-2">
                  <div>
                     <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Contact Information</h2>
                     <div className="mt-6 sm:mt-8 space-y-4">
                        <p className="flex items-center text-sm sm:text-base">
                           <HiOutlineMail className="mr-4 text-xl" />
                           team@sustaincred.com
                        </p>
                        <p className="flex items-center text-sm sm:text-base">
                           <HiOutlineLocationMarker className="mr-4 text-xl" />
                           HYDERABAD, TELANGANA, 500038, INDIA
                        </p>
                     </div>
                  </div>
                  <div className="flex space-x-4 mt-8 sm:mt-12">
                     <a href="https://x.com/Sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaXTwitter className="text-xl cursor-pointer" />
                     </a>
                     <a href="https://www.linkedin.com/company/sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaLinkedinIn className="text-xl cursor-pointer" />
                     </a>
                     <a href="https://www.instagram.com/sustaincred" target="_blank" rel="noreferrer" className="text-[#e2f4f7] hover:text-white">
                        <FaInstagram className="text-xl cursor-pointer" />
                     </a>
                  </div>
                  <div className="absolute right-0 bottom-0 w-48 h-48 sm:w-64 sm:h-64 overflow-hidden pointer-events-none hidden sm:block">
                     <div className="absolute w-40 h-40 rounded-full bg-[#75b686] opacity-20 right-0 bottom-0 transform translate-x-1/2 translate-y-1/2"></div>
                     <div className="absolute w-32 h-32 rounded-full bg-[#2A7D4F] opacity-15 right-12 bottom-12"></div>
                     <div className="absolute w-24 h-24 rounded-full bg-[#3CAB72] opacity-10 right-24 bottom-24"></div>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
}