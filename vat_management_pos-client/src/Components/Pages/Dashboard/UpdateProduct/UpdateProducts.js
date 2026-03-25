// import React, { useEffect, useState } from 'react';
// import UpdateProduct from './UpdateProduct';

// const UpdateProducts = () => {
//   const [products, setProducts] = useState([]);
//   useEffect(() => {
//     fetch('http://localhost:5000/updateProduct')
//       .then(res => res.json())
//       .then(data => setProducts(data));
//   }, [products]);
//   return (
//     <div>
//       <div className="overflow-x-auto p-2">
//         <table className="table table-xs  text-white w-full  text-center">
//           <thead>
//             <tr>
//               <th className="bg-black"></th>
//               <th className="bg-black"></th>
//               <th className="bg-black">Name</th>
//               <th className="bg-black">Update Date</th>
//               <th className="bg-black">Quantity</th>
//               <th className="bg-black">Unit Price</th>
//               <th className="bg-black">Total Price </th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product, index) => (
//               <UpdateProduct
//                 key={product._id}
//                 product={product}
//                 index={index + 1}
//               ></UpdateProduct>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UpdateProducts;







import React, { useEffect, useState } from 'react';
import UpdateProduct from './UpdateProduct';
import { toast } from 'react-toastify';

const UpdateProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchHistory = () => {
    fetch('http://localhost:5000/updateProduct')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to load update history:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // DELETE INDIVIDUAL FUNCTION
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this restock record?")) {
      fetch(`http://localhost:5000/updateProduct/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        if (data.deletedCount > 0) {
          toast.success("Record deleted successfully");
          setProducts(products.filter(p => p._id !== id));
        }
      });
    }
  };

  // NEW: DELETE ALL FUNCTION
  const handleDeleteAll = () => {
    if (window.confirm("CRITICAL: Are you sure you want to clear the ENTIRE restock history? This cannot be undone.")) {
      fetch('http://localhost:5000/updateProductDelete', {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        if (data.deletedCount > 0) {
          toast.success(`Cleared ${data.deletedCount} records successfully`);
          setProducts([]); // Clear UI
        }
      })
      .catch(err => console.error("Failed to delete all:", err));
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Delete All Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-300">
              Restock History
            </h1>
            {products.length > 0 && (
                <button 
                    onClick={handleDeleteAll}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md transition-all text-sm font-bold"
                >
                    DELETE ALL HISTORY
                </button>
            )}
        </div>

        <div className="overflow-x-auto rounded-md shadow-2xl">
          <table className="table table-xs w-full min-w-full text-white text-center">
            <thead>
              <tr>
                <th className="py-4 px-2 text-sm bg-black">#</th>
                <th className="py-4 px-2 text-sm bg-black">Image</th>
                <th className="py-4 px-2 text-sm bg-black">Name</th>
                <th className="py-4 px-2 text-sm bg-black">Update Date</th>
                <th className="py-4 px-2 text-sm bg-black">Qty Added</th>
                <th className="py-4 px-2 text-sm bg-black">Unit Price</th>
                <th className="py-4 px-2 text-sm bg-black">Total Cost</th>
                <th className="py-4 px-2 text-sm bg-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 bg-zinc-600 text-gray-100 text-center text-base">
                    No restock history found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <UpdateProduct
                    key={product._id}
                    product={product}
                    index={index + 1}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateProducts;