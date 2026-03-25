import React from 'react';

const OneProduct = ({ singleProduct, index }) => {
  // Calculate Line Total
  const lineTotal = parseFloat(singleProduct?.price || 0) * parseInt(singleProduct?.bookQuantity || 0);

  return (
    <tr className="hover:bg-zinc-800 transition-colors border-b border-zinc-700/50 last:border-0">
      <td className="bg-zinc-800 text-zinc-200 font-mono text-xs">{index}</td>
      <td className="bg-zinc-800 py-2">
        <div className="flex justify-center">
          <img
            className="w-12 h-12 rounded-lg object-cover border border-zinc-600 shadow-sm"
            src={singleProduct?.img}
            alt={singleProduct?.name}
          />
        </div>
      </td>
      <td className="bg-zinc-800 text-zinc-200 text-sm">
        {singleProduct?.name}
      </td>
      <td className="bg-zinc-800 text-zinc-200 text-sm">
        {parseFloat(singleProduct?.price).toFixed(2)} TK
      </td>
      <td className="bg-zinc-800 text-zinc-200">
        <span className="bg-zinc-700 px-2 py-1 rounded text-xs font-bold">
          x {singleProduct?.bookQuantity}
        </span>
      </td>
      {/* NEW TOTAL COLUMN */}
      <td className="bg-zinc-800 text-lime-400 font-bold text-sm">
        {lineTotal.toFixed(2)} TK
      </td>
    </tr>
  );
};

export default OneProduct;