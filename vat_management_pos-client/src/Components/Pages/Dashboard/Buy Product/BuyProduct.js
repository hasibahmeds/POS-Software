import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp, IoMdTrash } from 'react-icons/io';
import OneProduct from './OneProduct';

const BuyProduct = ({ product, index, onDelete }) => {
  const [open, setOpen] = useState(false);

  // Group duplicate products within this specific sale
  const aggregatedBookings = Object.values(
    product.bookings.reduce((acc, item) => {
      const key = item.productId || item.name; 
      if (!acc[key]) {
        acc[key] = { ...item, bookQuantity: 0 };
      }
      acc[key].bookQuantity += parseInt(item.bookQuantity || 0);
      return acc;
    }, {})
  );

  // Total items in this specific transaction
  const totalItemsQuantity = aggregatedBookings.reduce((sum, item) => sum + item.bookQuantity, 0);

  return (
    <>
      <tr className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
        <th className="bg-transparent text-zinc-500">{index}</th>
        {/* <td className="bg-transparent font-bold text-zinc-200">{product?.name || 'Walk-in Customer'}</td> */}
        <td className="bg-transparent font-bold text-zinc-200">{product?.customerName || 'Walk-in Customer'}</td>
        
        <td className="bg-transparent">
          <button 
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center gap-2 mx-auto bg-zinc-900 px-3 py-1 rounded-full border border-zinc-600 hover:border-zinc-400 transition"
          >
            <span className="font-bold text-sm">{totalItemsQuantity} Items</span>
            {open ? <IoIosArrowUp className="text-red-400" /> : <IoIosArrowDown className="text-lime-400" />}
          </button>
        </td>

        <td className="bg-transparent text-xs text-center">
          <div className="font-semibold">{product?.date}</div>
          <div className="text-zinc-500">{product?.time}</div>
        </td>

        <td className="bg-transparent text-red-400">-{parseFloat(product?.discount || 0).toFixed(2)} TK</td>
        
        <td className="bg-transparent font-medium">
          {parseFloat(product?.subTotal || product?.totalPrice || 0).toFixed(2)} TK
        </td>

        <td className="bg-transparent">
          <div className="text-xs text-zinc-500">{product?.vats}%</div>
          <div className="font-semibold text-blue-400">
            {parseFloat(product?.vatAmount || product?.vat || 0).toFixed(2)} TK
          </div>
        </td>

        <td className="bg-transparent font-black text-lime-300">
          {parseFloat(product?.finalNetAmount || product?.newTotalPrice || 0).toFixed(2)} TK
        </td>

        {/* Delete Button Cell */}
        <td className="bg-transparent">
          <button 
            onClick={() => onDelete(product._id)}
            className="text-red-500 hover:text-red-300 transition-colors p-2"
            title="Delete individual record"
          >
            <IoMdTrash size={20} />
          </button>
        </td>
      </tr>

      {/* Expanded Product Details Table */}
      {open && (
        <tr>
          <td colSpan="9" className="bg-zinc-900/50 p-4">
            <div className="overflow-hidden rounded-lg border border-zinc-700">
              <table className="table w-full text-center">
                <thead className="bg-zinc-800">
                  <tr className="text-zinc-400 text-xs uppercase">
                    <th className='bg-zinc-900'>Idx</th>
                    <th className='bg-zinc-900'>Product Image</th>
                    <th className='bg-zinc-900'>Product Name</th>
                    <th className='bg-zinc-900'>Unit Price</th>
                    <th className='bg-zinc-900'>Sold Qty</th>
                    <th className='bg-zinc-900 text-lime-400'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedBookings.map((singleProduct, idx) => (
                    <OneProduct
                      key={singleProduct?._id || idx}
                      singleProduct={singleProduct}
                      index={idx + 1}
                    />
                  ))}
                </tbody>
              </table>
              <div className="bg-zinc-900 p-3 text-xs text-zinc-400 italic">
                Transaction ID: {product._id} | Customer Mobile: {product.phone || 'N/A'}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BuyProduct;