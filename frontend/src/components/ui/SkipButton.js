const SkipButton = ({ children, onClick, disabled }) => {
   return (
      <button
         type="button"
         onClick={onClick}
         disabled={disabled}
         className="px-4 py-2 bg-white border text-gray-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
         {children}
      </button>
   );
};

export default SkipButton;
