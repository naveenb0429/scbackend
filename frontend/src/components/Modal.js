const Modal = ({ isOpen, children }) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            {children}
         </div>
      </div>
   );
};

export default Modal;
