// import React from 'react';

// const UpdateProduct = ({ index, product }) => {
//   console.log(product);
//   return (
//     <tr>
//       <th className="bg-zinc-700">{index}</th>
//       <th className="bg-zinc-700">
//         <img
//           className="h-10 w-10  rounded-full"
//           src={product?.singleProduct?.img}
//           alt=""
//         />
//       </th>
//       <td className="bg-zinc-700">{product?.singleProduct?.name}</td>
//       <td className="bg-zinc-700">{product?.date}</td>
//       <td className="bg-zinc-700">{product?.lastQuantityAdd}</td>
//       <td className="bg-zinc-700">{product?.singleProduct?.price}</td>
//       <td className="bg-zinc-700">
//         {product?.lastQuantityAdd * product?.singleProduct?.price}
//       </td>
//     </tr>
//   );
// };

// export default UpdateProduct;















import React from 'react';
import { IoMdTrash } from "react-icons/io"; // Import trash icon

const UpdateProduct = ({ index, product, onDelete }) => {
  return (
    <tr className="hover:bg-zinc-800 transition-colors">
      <th className="bg-zinc-700 text-left py-3 px-2 text-sm">{index}</th>
      <th className="bg-zinc-700 py-3 px-2">
        <img
          className="h-10 w-10 rounded-full object-cover mx-auto"
          src={product?.singleProduct?.img || "https://via.placeholder.com/40"}
          alt={product?.singleProduct?.name || "Product"}
        />
      </th>
      <td className="bg-zinc-700 py-3 px-2 text-sm">{product?.singleProduct?.name || "N/A"}</td>
      <td className="bg-zinc-700 py-3 px-2 text-sm">{product?.date || "-"}</td>
      <td className="bg-zinc-700 py-3 px-2 text-sm">{product?.lastQuantityAdd || 0}</td>
      <td className="bg-zinc-700 py-3 px-2 text-sm">
        {product?.singleProduct?.price || 0} TK
      </td>
      <td className="bg-zinc-700 py-3 px-2 text-sm font-medium">
        {(product?.lastQuantityAdd || 0) * (product?.singleProduct?.price || 0)} TK
      </td>
      {/* NEW DELETE BUTTON CELL */}
      <td className="bg-zinc-700 py-3 px-2 text-sm">
        <button 
          onClick={() => onDelete(product._id)} 
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Delete History Entry"
        >
          <IoMdTrash size={20} />
        </button>
      </td>
    </tr>
  );
};

export default UpdateProduct;