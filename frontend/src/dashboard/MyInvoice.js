import { Link } from "react-router-dom";
import { ReactComponent as Sustaincred } from "../assets/images/logos/sustaincred-logo.svg";
import DashboardNav from "./components/DashboardNav";

export default function MyInvoice() {
   const invoiceData = {
      invoiceNumber: "INV-2024-001",
      date: "2024-03-15",
      dueDate: "2024-04-15",
      billTo: {
         companyName: "Acme Corporation",
         address: "123 Main St",
         city: "Metropolis",
         country: "USA",
         postal: "12345"
      },
      items: [
         { name: "Web Development", description: "Frontend Development", quantity: 1, price: 2000, tax: 10 },
         { name: "UI/UX Design", description: "Dashboard Design", quantity: 1, price: 1500, tax: 10 },
         { name: "Consulting", description: "Technical Consultation", quantity: 5, price: 200, tax: 5 },
         { name: "Support and Maintenance", description: "Support and Maintenance", quantity: 2, price: 1200, tax: 6 },
         { name: "Chat Bot", description: "Chat Bot Development", quantity: 5, price: 300, tax: 9 },
      ]
   };

   const calculateSubtotal = () => {
      return invoiceData.items.reduce((total, item) => total + item.quantity * item.price, 0);
   };

   const calculateTax = () => {
      return invoiceData.items.reduce((total, item) => total + (item.quantity * item.price * item.tax / 100), 0);
   };

   const calculateTotal = () => {
      return calculateSubtotal() + calculateTax();
   };

   return (
      <div className="flex h-screen overflow-hidden">
         <DashboardNav />
         <div className="flex-1 overflow-y-auto bg-gray-100 text-black p-8 font-poppins">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
               {/* Invoice Header */}
               <div className="bg-[#156534] text-white p-6 flex justify-between items-start">
                  <div className="flex flex-col items-center">
                     <Link to={'/'} className="flex items-center space-x-3">
                        <Sustaincred
                           className="w-24 h-24 rounded-full"
                        />
                     </Link>
                     <span className="text-3xl font-bold">Invoice</span>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-bold mb-6">SustainCred</p>
                     <p>SR Nagar, Hyderabad, Telangana</p>
                     <p>INDIA</p>
                     <p>500038</p>
                  </div>
               </div>

               {/* Invoice Content */}
               <div className="px-6 py-10">
                  <div className="flex justify-between">
                     <div>
                        <h2 className="font-semibold mb-2">BILL TO:</h2>
                        <p>{invoiceData.billTo.companyName}</p>
                        <p>{invoiceData.billTo.address}</p>
                        <p>{invoiceData.billTo.city}</p>
                        <p>{invoiceData.billTo.country}</p>
                        <p>{invoiceData.billTo.postal}</p>
                     </div>
                     <div className="text-right space-y-3">
                        <p className="font-semibold">INVOICE # <span className="font-normal">{invoiceData.invoiceNumber}</span></p>
                        <p className="font-semibold">DATE: <span className="font-normal">{invoiceData.date}</span></p>
                        <p className="font-semibold">INVOICE DUE DATE: <span className="font-normal">{invoiceData.dueDate}</span></p>
                     </div>
                  </div>
                  <hr className="my-8 border-t border-gray-300" />
                  <table className="w-full mt-8">
                     <thead>
                        <tr className="border-b">
                           <th className="text-left py-2">ITEMS</th>
                           <th className="text-left py-2">DESCRIPTION</th>
                           <th className="text-center py-2">QUANTITY</th>
                           <th className="text-right py-2">PRICE</th>
                           <th className="text-right py-2">TAX</th>
                           <th className="text-right py-2">AMOUNT</th>
                        </tr>
                     </thead>
                     <tbody>
                        {invoiceData.items.map((item, index) => (
                           <tr key={index} className={index === invoiceData.items.length - 1 ? '' : 'border-b'}>
                              <td className="text-left py-2">{item.name}</td>
                              <td className="text-left py-2">{item.description}</td>
                              <td className="text-center py-2">{item.quantity}</td>
                              <td className="text-right py-2">${item.price.toFixed(2)}</td>
                              <td className="text-right py-2">{item.tax}%</td>
                              <td className="text-right py-2">${(item.quantity * item.price).toFixed(2)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="bg-[#156534] text-white p-4">
                  <div className="text-right space-y-2">
                     <p>Subtotal: <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span></p>
                     <p>Tax: <span className="font-semibold">${calculateTax().toFixed(2)}</span></p>
                     <p className="text-md">TOTAL: <span className="text-3xl font-semibold">${calculateTotal().toFixed(2)}</span></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
