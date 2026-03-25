// import React, { useEffect, useState, useRef } from "react";
// import { IoMdDownload } from "react-icons/io";
// import ReactToPdf from "react-to-pdf";
// import { toast } from "react-toastify";

// const BookProducts = () => {
//   const [bookings, setBookings] = useState([]);
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [vats, setVat] = useState(15);
//   const [discount, setDiscount] = useState(0);
//   const [specialDiscount, setSDiscount] = useState(0);
//   const [paid, setPaid] = useState("");
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString()
//   );

//   const totalPrice =
//     bookings.reduce(
//       (acc, product) => acc + parseInt(product.price) * product.bookQuantity,
//       0
//     ) -
//     discount -
//     specialDiscount;
//   const vat = totalPrice * (vats / 100);
//   const newTotalPrice = totalPrice + vat;
//   const changeAmount = paid ? parseFloat(paid) - newTotalPrice : 0;

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     fetch(`http://localhost:5000/booking`)
//       .then((res) => res.json())
//       .then((data) => setBookings(data));
//   }, []);

//   const documentRef = useRef();
//   const pdfFilename = name ? `${name}.pdf` : "invoice.pdf";

//   const handleClear = () => {
//     const proceed = window.confirm("Are You Sure?");
//     if (proceed) {
//       const changeUrl = {
//         bookings,
//         totalPrice,
//         newTotalPrice,
//         vat,
//         date: new Date().toDateString(),
//         time: currentTime,
//         discount,
//         specialDiscount,
//         name,
//         vats,
//         phone,
//         address,
//       };
//       fetch(`http://localhost:5000/buys`, {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(changeUrl),
//       })
//         .then(() => {
//           fetch(`http://localhost:5000/bookings`, { method: "DELETE" }).then(
//             () => {
//               toast.success("Successfully Cleared");
//               window.location.reload();
//             }
//           );
//         })
//         .catch(() => toast.error("Clear failed"));
//     }
//   };

//   if (bookings.length === 0) return null;

//   const pdfOptions = {
//     orientation: "portrait",
//     unit: "mm",
//     format: [210, 297],
//   };

//   return (
//     <div className="w-full">
//       <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
//         <div
//           ref={documentRef}
//           className="bg-white text-black p-8 min-w-[800px] invoice-print mx-auto"
//           style={{ width: "210mm", padding: "15mm", boxSizing: "border-box" }}
//         >
//           <div className="text-center mb-6">
//             <h1 className="text-3xl font-bold">HEAT AND TREAT</h1>
//             <h1 className="text-xl font-semibold">Agargaon-Dhaka</h1>
//           </div>

//           <h1 className="text-center border-2 border-black text-xl font-bold py-3 my-4">
//             SELLING INFO
//           </h1>

//           <div className="flex justify-between text-base font-semibold mb-6">
//             <p>Date: {new Date().toDateString()}</p>
//             <p>Time: {currentTime}</p>
//           </div>

//           <div className="text-sm mb-6 font-medium">
//             <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3">
//               <div className="font-bold">Name</div>
//               <div className="break-words">: {name || "N/A"}</div>

//               <div className="font-bold">Address</div>
//               <div className="break-words">: {address || "N/A"}</div>

//               <div className="font-bold">Mobile</div>
//               <div className="break-words">: {phone || "N/A"}</div>
//             </div>
//           </div>

//           <hr className="my-6 border-black" />

//           <div className="overflow-x-auto mb-6">
//             <table className="w-full text-center border-collapse text-sm">
//               <thead>
//                 <tr className="border-b-2 border-black">
//                   <th className="pb-3 text-center">Index</th>
//                   <th className="pb-3 text-center">Image</th>
//                   <th className="pb-3 text-center">Name</th>
//                   <th className="pb-3 text-center">Qty</th>
//                   <th className="pb-3 text-center">Price</th>
//                   <th className="pb-3 text-center">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookings.map((product, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="py-3 text-center">{index + 1}</td>
//                     <td className="py-3 text-center">
//                       <img
//                         className="h-12 w-12 rounded-full mx-auto object-cover border border-gray-400"
//                         src={product.img}
//                         alt={product.name}
//                       />
//                     </td>
//                     <td className="py-3 text-center">{product.name}</td>
//                     <td className="py-3 text-center">{product.bookQuantity}</td>
//                     <td className="py-3 text-center">{product.price} TK</td>
//                     <td className="py-3 text-center">
//                       {(product.bookQuantity * product.price).toFixed(2)} TK
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <hr className="my-6 border-black" />

//           <div className="text-right space-y-3 text-sm font-medium max-w-2xl ml-auto">
//             <div className="flex justify-end">
//               <span className="w-48 text-right">Sub Total:</span>
//               <span className="w-32 text-right">{totalPrice.toFixed(2)} TK</span>
//             </div>
//             <div className="flex justify-end">
//               <span className="w-48 text-right">Discount:</span>
//               <span className="w-32 text-right">{discount}.00</span>
//             </div>
//             <div className="flex justify-end">
//               <span className="w-48 text-right">Special Discount:</span>
//               <span className="w-32 text-right">{specialDiscount}.00</span>
//             </div>
//             <div className="flex justify-end">
//               <span className="w-48 text-right">Vat ({vats}%):</span>
//               <span className="w-32 text-right">{vat.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-end text-lg font-bold">
//               <span className="w-48 text-right">Net Amount:</span>
//               <span className="w-32 text-right">
//                 {newTotalPrice.toFixed(2)} TK
//               </span>
//             </div>
//             <div className="flex justify-end">
//               <span className="w-48 text-right">Paid Amount:</span>
//               <span className="w-32 text-right">{paid || "0.00"} TK</span>
//             </div>
//             {paid && changeAmount !== 0 && (
//               <div className="flex justify-end">
//                 <span className="w-48 text-right">Change:</span>
//                 <span className="w-32 text-right">
//                   {changeAmount.toFixed(2)} TK
//                 </span>
//               </div>
//             )}
//             <hr className="my-4 border-black" />
//             <div className="flex justify-end text-lg font-bold">
//               <span className="w-48 text-right">Cash</span>
//               <span className="w-32 text-right">
//                 {newTotalPrice.toFixed(2)} TK
//               </span>
//             </div>
//           </div>

//           <hr className="my-4 border-black" />
//         </div>
//       </div>

//       <div className="mt-8 bg-zinc-800 p-6 rounded-xl space-y-4 text-white print:hidden">
//         <input
//           onChange={(e) => setName(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Enter Name"
//         />
//           <textarea
//           onChange={(e) => setAddress(e.target.value)}
//           className="textarea w-full text-black"
//           placeholder="Enter Address"
//           rows={1}
//         />
//         <input
//           onChange={(e) => setPhone(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Phone"
//         />
//         <input
//           onChange={(e) => setVat(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Vat %"
//           type="number"
//         />
//         <input
//           onChange={(e) => setDiscount(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Discount Amount"
//           type="number"
//         />
//         <input
//           onChange={(e) => setSDiscount(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Special Discount"
//           type="number"
//         />
//         <input
//           onChange={(e) => setPaid(e.target.value)}
//           className="input w-full text-black"
//           placeholder="Enter Paid Amount"
//           type="number"
//         />

//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <button onClick={handleClear} className="btn btn-accent flex-1">
//             Clear Cart
//           </button>
//           <ReactToPdf
//             targetRef={documentRef}
//             filename={pdfFilename}
//             options={pdfOptions}
//             scale={1}
//             x={0}
//             y={0}
//           >
//             {({ toPdf }) => (
//               <button
//                 onClick={toPdf}
//                 className="btn btn-primary flex-1 flex items-center justify-center gap-2"
//               >
//                 Download PDF <IoMdDownload className="text-xl animate-bounce" />
//               </button>
//             )}
//           </ReactToPdf>
//         </div>
//       </div>


//       <style jsx>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .invoice-print,
//           .invoice-print * {
//             visibility: visible;
//           }
//           .invoice-print {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 210mm !important;
//             padding: 15mm;
//             background: white !important;
//             color: black !important;
//             box-sizing: border-box;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//           .overflow-x-auto {
//             overflow: visible !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BookProducts;












import React, { useEffect, useState, useRef } from "react";
import { IoMdDownload, IoMdTrash } from "react-icons/io";
import ReactToPdf from "react-to-pdf";
import { toast } from "react-toastify";

const BookProducts = () => {
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vats, setVat] = useState(15);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Calculation Logic
  const subTotal = bookings.reduce(
    (acc, product) => acc + (parseInt(product.price) * parseInt(product.bookQuantity)),
    0
  );
  const afterDiscount = subTotal - parseFloat(discount || 0);
  const vatAmount = afterDiscount * (parseFloat(vats || 0) / 100);
  const finalNetAmount = afterDiscount + vatAmount;
  const changeAmount = paid ? parseFloat(paid) - finalNetAmount : 0;

  const fetchBookings = () => {
    fetch(`http://localhost:5000/booking`)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  useEffect(() => {
    fetchBookings();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDeleteItem = async (product) => {
    const proceed = window.confirm(`Remove ${product.name} and return ${product.bookQuantity} to stock?`);
    if (proceed) {
      try {
        // 1. Get current Main Product Stock
        const res = await fetch(`http://localhost:5000/allProducts/${product.pId}`);
        const mainProduct = await res.json();
        
        if (mainProduct) {
          // 2. Add booking quantity back to stock
          const restoredQuantity = parseInt(mainProduct.quantity) + parseInt(product.bookQuantity);
          
          await fetch(`http://localhost:5000/productId/${mainProduct._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: restoredQuantity }),
          });

          // 3. Delete from booking
          const deleteRes = await fetch(`http://localhost:5000/booking/${product._id}`, {
            method: "DELETE",
          });
          const deleteData = await deleteRes.json();
          
          if (deleteData.deletedCount > 0) {
            toast.success("Stock restored and item removed");
            fetchBookings();
          }
        }
      } catch (error) {
        toast.error("Error restoring stock");
        console.error(error);
      }
    }
  };

  const documentRef = useRef();
  const pdfFilename = name ? `${name}.pdf` : "invoice.pdf";

  const handleClear = () => {
    const proceed = window.confirm("Save transaction and clear cart?");
    if (proceed) {
      const transactionData = {
        bookings,
        subTotal,
        discount,
        vats,
        vatAmount,
        finalNetAmount,
        date: new Date().toDateString(),
        time: currentTime,
        name,
        phone,
        address,
      };
      fetch(`http://localhost:5000/buys`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(transactionData),
      })
        .then(() => {
          fetch(`http://localhost:5000/bookings`, { method: "DELETE" }).then(() => {
            toast.success("Transaction Saved");
            window.location.reload();
          });
        });
    }
  };

  if (bookings.length === 0) return null;

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div
          ref={documentRef}
          className="bg-white text-black p-8 min-w-[800px] invoice-print mx-auto"
          style={{ width: "210mm", padding: "15mm", boxSizing: "border-box" }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold uppercase">Heat and Treat</h1>
            <h1 className="text-xl font-semibold">Agargaon-Dhaka</h1>
          </div>

          <h1 className="text-center border-2 border-black text-xl font-bold py-3 my-4">SELLING INFO</h1>

          <div className="flex justify-between text-base font-semibold mb-6">
            <p>Date: {new Date().toDateString()}</p>
            <p>Time: {currentTime}</p>
          </div>

          <div className="text-sm mb-6 font-medium">
            <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3">
              <div className="font-bold">Name</div>
              <div className="break-words">: {name || "N/A"}</div>
              <div className="font-bold">Address</div>
              <div className="break-words">: {address || "N/A"}</div>
              <div className="font-bold">Mobile</div>
              <div className="break-words">: {phone || "N/A"}</div>
            </div>
          </div>

          <hr className="my-6 border-black" />

          <table className="w-full text-center border-collapse text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="pb-3">Index</th>
                <th className="pb-3">Image</th>
                <th className="pb-3">Name</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3">
                    <img className="h-10 w-10 rounded-full mx-auto object-cover" src={product.img} alt="" />
                  </td>
                  <td className="py-3 font-semibold">{product.name}</td>
                  <td className="py-3">{product.bookQuantity}</td>
                  <td className="py-3">{product.price} TK</td>
                  <td className="py-3">{(parseInt(product.bookQuantity) * parseInt(product.price)).toFixed(2)} TK</td>
                  <td className="py-3 print:hidden">
                    <button onClick={() => handleDeleteItem(product)} className="text-red-600 hover:text-red-900">
                      <IoMdTrash size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-2 text-sm font-medium max-w-md ml-auto">
            <div className="flex justify-end">
              <span className="w-48 text-gray-600">Sub Total:</span>
              <span className="w-32">{subTotal.toFixed(2)} TK</span>
            </div>
            <div className="flex justify-end text-red-600">
              <span className="w-48">Discount:</span>
              <span className="w-32">-{parseFloat(discount || 0).toFixed(2)} TK</span>
            </div>
            <div className="flex justify-end pt-1">
              <span className="w-48">Vat ({vats}%):</span>
              <span className="w-32">+{vatAmount.toFixed(2)} TK</span>
            </div>
            <div className="flex justify-end text-xl font-bold border-t-2 border-black pt-2 mt-2">
              <span className="w-48">NET AMOUNT:</span>
              <span className="w-32">{finalNetAmount.toFixed(2)} TK</span>
            </div>
            {paid && (
              <>
                <div className="flex justify-end text-gray-500 pt-2">
                  <span className="w-48">Paid Amount:</span>
                  <span className="w-32">{parseFloat(paid).toFixed(2)} TK</span>
                </div>
                <div className="flex justify-end font-bold text-green-700">
                  <span className="w-48">Change:</span>
                  <span className="w-32">{changeAmount.toFixed(2)} TK</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-zinc-800 p-6 rounded-xl space-y-4 text-white print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input onChange={(e) => setName(e.target.value)} className="input w-full text-black h-10 px-3 rounded" placeholder="Customer Name" />
          <input onChange={(e) => setPhone(e.target.value)} className="input w-full text-black h-10 px-3 rounded" placeholder="Phone" />
        </div>
        <textarea onChange={(e) => setAddress(e.target.value)} className="textarea w-full text-black p-3 rounded" placeholder="Address" rows={1} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input onChange={(e) => setVat(e.target.value)} className="input w-full text-black h-10 px-3 rounded" placeholder="Vat %" type="number" />
          <input onChange={(e) => setDiscount(e.target.value)} className="input w-full text-black h-10 px-3 rounded" placeholder="Discount" type="number" />
          <input onChange={(e) => setPaid(e.target.value)} className="input w-full text-black h-10 px-3 rounded" placeholder="Paid" type="number" />
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={handleClear} className="bg-red-600 hover:bg-red-700 py-2 px-6 rounded flex-1 font-bold">Save & Clear</button>
          <ReactToPdf targetRef={documentRef} filename={pdfFilename} scale={1}>
            {({ toPdf }) => (
              <button onClick={toPdf} className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded flex-1 font-bold flex items-center justify-center gap-2">
                Download PDF <IoMdDownload />
              </button>
            )}
          </ReactToPdf>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default BookProducts;














