import React from 'react';
import { FaEdit } from 'react-icons/fa';

const AllProduct = ({
  product,
  index,
  handleEdit,
  singleProduct,
  handleRestock,
  handleDecrease,
  handleDelete,
  handleUpdateDetails,
}) => {
  return (
    <tr className="text-xs sm:text-sm md:text-base">
      <th className="bg-zinc-700">{index}</th>
      <th className="bg-zinc-700">
        <img
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover mx-auto"
          src={product?.img}
          alt={product?.name}
        />
      </th>
      <td className="bg-zinc-700">{product?.name}</td>
      <td className="bg-zinc-700 font-mono">{product?.productId}</td>
      <td className="bg-zinc-700 font-semibold">{product?.quantity}</td>
      <td className="bg-zinc-700">{product?.price} TK</td>

      {/* Edit Details Modal Button */}
      <td className="bg-zinc-700">
        <label
          onClick={() => handleEdit(product?._id)}
          htmlFor="edit-details-modal"
          className="btn btn-xs sm:btn-sm text-white"
        >
          <FaEdit className="text-lg sm:text-2xl" />
        </label>
      </td>

      {/* Increase Quantity Modal */}
      <td className="bg-zinc-700">
        <label
          onClick={() => handleEdit(product?._id)}
          htmlFor="restock-modal"
          className="btn btn-primary btn-xs sm:btn-sm text-white"
        >
          <FaEdit className="text-lg sm:text-2xl" />
        </label>
      </td>

      {/* Decrease Quantity Modal */}
      <td className="bg-zinc-700">
        <label
          onClick={() => handleEdit(product?._id)}
          htmlFor="decrease-modal"
          className="btn btn-accent btn-xs sm:btn-sm text-white text-xs"
        >
          Decrease
        </label>
      </td>

      {/* Delete Button */}
      <td className="bg-zinc-700">
        <button
          onClick={() => handleDelete(product?._id)}
          className="btn btn-secondary btn-xs sm:btn-sm"
        >
          Delete
        </button>
      </td>

      {/* Restock Modal */}
      <input type="checkbox" id="restock-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div
          className="modal-box p-4 sm:p-6 max-w-sm sm:max-w-2xl w-full"
          style={{
            backgroundImage: `url(${singleProduct?.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <label
            htmlFor="restock-modal"
            className="btn btn-sm btn-circle btn-primary text-white absolute right-2 top-2"
          >
            ✕
          </label>

          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-4">
            <h1 className="text-xl sm:text-2xl font-bold text-black bg-white/80 px-4 py-2 rounded">
              {singleProduct?.name}
            </h1>
            <img
              className="w-32 h-32 sm:w-48 sm:h-48 mask mask-hexagon-2 shadow-2xl"
              src={singleProduct?.img}
              alt={singleProduct?.name}
            />
            <form onSubmit={handleRestock} className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                required
                className="input input-bordered input-error w-full sm:w-64 text-black"
              />
              <button type="submit" className="btn btn-primary text-white w-full sm:w-auto">
                Restock
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decrease Modal */}
      <input type="checkbox" id="decrease-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div
          className="modal-box p-4 sm:p-6 max-w-sm sm:max-w-xl w-full"
          style={{
            backgroundImage: `url(${singleProduct?.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <label
            htmlFor="decrease-modal"
            className="btn btn-sm btn-circle btn-accent text-white absolute right-2 top-2"
          >
            ✕
          </label>

          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white bg-black/60 px-4 py-2 rounded">
              Decrease: {singleProduct?.name}
            </h1>
            <form onSubmit={handleDecrease} className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                required
                min="1"
                className="input input-bordered input-error w-full sm:w-64 text-black"
              />
              <button type="submit" className="btn btn-accent text-white w-full sm:w-auto">
                Decrease
              </button>
            </form>
          </div>
        </div>
      </div>


    </tr>
  );
};

export default AllProduct;