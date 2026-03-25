// AddProduct.js                                                                                                                                                      import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// const AddProduct = () => {
//   const [service, setService] = useState('');
//   const imageHostKey = '29c3381b54a28ccaac52647860043744';
//  
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm();
//  
//   const onSubmit = data => {
//     const image = data.image[0];
//     const formData = new FormData();
//     formData.append('image', image);
//     const url = `https://api.imgbb.com/1/upload?expiration=600&key=${imageHostKey}`;
// const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
//     fetch(url, {
//       method: 'POST',
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(imageData => {
//         const image = imageData.data.url;
//         const changeUrl = { ...data, img: image };
//         console.log(changeUrl);
//         fetch(`http://localhost:5000/allProduct`, {
//           method: 'POST',
//           headers: {
//             'content-type': 'application/json',
//           },
//           body: JSON.stringify(changeUrl),
//         })
//           .then(res => res.json())
//           .then(data => {
//             toast.success('Successfully Added');
//             reset();
//           });
//       });
//   };

//   return (
//     <div className="min-h-screen  py-8 px-4">
//       <div className="max-w-md mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-zinc-300 mb-8 tracking-wide">
//           Add Product
//         </h2>

//         <div className="bg-zinc-800 rounded-xl shadow-xl p-5 sm:p-6 border border-zinc-700">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter name"
//                 className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all text-sm h-10"
//                 {...register('name', {
//                   required: { value: true, message: 'Name is Required' },
//                 })}
//               />
//               {errors.name && (
//                 <p className="text-[#ff2600] text-xs mt-1">{errors.name.message}</p>
//               )}
//             </div>

//            
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Product ID
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter unique ID"
//                 className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all text-sm h-10"
//                 {...register('pId', {
//                   required: { value: true, message: 'Product ID is Required' },
//                 })}
//               />
//               {errors.pId && (
//                 <p className="text-[#ff2600] text-xs mt-1">{errors.pId.message}</p>
//               )}
//             </div>

//             
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Product Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className=" w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-600 h-11 text-sm"
//                 {...register('image', {
//                   required: { value: true, message: 'Image is Required' },
//                 })}
//               />
//               {errors.image && (
//                 <p className="text-[#ff2600] text-xs mt-1">{errors.image.message}</p>
//               )}
//             </div>

//             
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 placeholder="Available stock"
//                 className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all text-sm h-10"
//                 {...register('quantity', {
//                   required: { value: true, message: 'Quantity is Required' },
//                 })}
//               />
//               {errors.quantity && (
//                 <p className="text-[#ff2600] text-xs mt-1">{errors.quantity.message}</p>
//               )}
//             </div>

//             
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Unit Price (tk)
//               </label>
//               <input
//                 type="number"
//                 placeholder="Price per unit"
//                 className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all text-sm h-10"
//                 {...register('price', {
//                   required: { value: true, message: 'Price is Required' },
//                 })}
//               />
//               {errors.price && (
//                 <p className="text-[#ff2600] text-xs mt-1">{errors.price.message}</p>
//               )}
//             </div>

//             
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full h-[40px] bg-black hover:bg-[#000000c7] text-white font-medium py-2.5 rounded-lg focus:outline-none transition-all duration-300 text-sm uppercase"
//               >
//                 Add Product
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;









import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const imageHostKey = '29c3381b54a28ccaac52647860043744';

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm();

  // We watch these to see if at least one is filled
  const imageFile = watch('image');
  const imageUrl = watch('imageUrl');

  const onSubmit = async (data) => {
    // Check if both are empty
    if ((!data.image || data.image.length === 0) && !data.imageUrl) {
      return toast.error("Please either upload an image or provide a link");
    }

    setLoading(true);
    let finalImageUrl = data.imageUrl; // Default to the link provided

    try {
      // 1. If a file is selected, upload it to ImgBB first
      if (data.image && data.image[0]) {
        const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image);

        // URL without expiration for permanent storage
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
        
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        const imageData = await res.json();

        if (imageData.success) {
          finalImageUrl = imageData.data.url;
        } else {
          throw new Error("ImgBB Upload Failed");
        }
      }

      // 2. Prepare the product object
      const productData = {
        name: data.name,
        pId: data.pId,
        quantity: data.quantity,
        price: data.price,
        img: finalImageUrl,
      };

      // 3. Send to your local server
      const serverRes = await fetch(`http://localhost:5000/allProduct`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const result = await serverRes.json();

      if (result) {
        toast.success('Successfully Added');
        reset();
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-zinc-300 mb-8 tracking-wide">
          Add Product
        </h2>

        <div className="bg-zinc-800 rounded-xl shadow-xl p-5 sm:p-6 border border-zinc-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 text-sm h-10"
                {...register('name', { required: 'Name is Required' })}
              />
              {errors.name && <p className="text-[#ff2600] text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Product ID */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Product ID</label>
              <input
                type="text"
                placeholder="Enter unique ID"
                className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 text-sm h-10"
                {...register('pId', { required: 'Product ID is Required' })}
              />
              {errors.pId && <p className="text-[#ff2600] text-xs mt-1">{errors.pId.message}</p>}
            </div>

            {/* Image Upload (File) */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Option 1: Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-zinc-900 text-white border-zinc-600 h-11 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600"
                {...register('image')}
              />
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-700"></div>
                <span className="flex-shrink mx-4 text-zinc-500 text-xs font-bold uppercase">OR</span>
                <div className="flex-grow border-t border-zinc-700"></div>
            </div>

            {/* Image Link (URL) */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Option 2: Paste Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image"
                className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 text-sm h-10"
                {...register('imageUrl')}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Available stock"
                className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 text-sm h-10"
                {...register('quantity', { required: 'Quantity is Required' })}
              />
              {errors.quantity && <p className="text-[#ff2600] text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Unit Price (tk)</label>
              <input
                type="number"
                placeholder="Price per unit"
                className="input input-bordered w-full bg-zinc-900 text-white border-zinc-600 focus:border-zinc-500 text-sm h-10"
                {...register('price', { required: 'Price is Required' })}
              />
              {errors.price && <p className="text-[#ff2600] text-xs mt-1">{errors.price.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-[40px] bg-black hover:bg-[#000000c7] text-white font-medium py-2.5 rounded-lg focus:outline-none transition-all duration-300 text-sm uppercase ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;