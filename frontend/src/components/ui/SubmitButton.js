const SubmitButton = ({ children }) => {
   return (
      <button
         type="submit"
         className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md py-2 px-6 text-base transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
      >
         {children}
      </button>
   );
};

export default SubmitButton;
