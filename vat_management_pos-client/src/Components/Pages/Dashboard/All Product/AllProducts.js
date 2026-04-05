import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AllProduct from './AllProduct';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const imageHostKey = '29c3381b54a28ccaac52647860043744';

  // Pagination state
  const [PRODUCTS_PER_PAGE, setProductsPerPage] = useState(100); // Can be changed
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch products with pagination
  const fetchProducts = (search = '', offset = 0, append = false) => {
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const url = `http://localhost:5000/allProduct?search=${encodeURIComponent(search)}&limit=${PRODUCTS_PER_PAGE}&offset=${offset}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (append) {
          setProducts(prev => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setHasMore(data.hasMore);
        setTotalProducts(data.total);
        setCurrentOffset(offset);
        
        if (!append) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        if (!append) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      });
  };

  useEffect(() => {
    // Reset pagination when search query changes
    setCurrentOffset(0);
    setProducts([]);
    fetchProducts(searchQuery, 0, false);
  }, [searchQuery]);

  // Load more products
  const loadMoreProducts = () => {
    const nextOffset = currentOffset + PRODUCTS_PER_PAGE;
    fetchProducts(searchQuery, nextOffset, true);
  };

  // Reset pagination and reload
  const resetAndReload = () => {
    setCurrentOffset(0);
    setProducts([]);
    fetchProducts(searchQuery, 0, false);
  };

  const handleEdit = id => {
    fetch(`http://localhost:5000/product/${id}`)
      .then(res => res.json())
      .then(data => setSingleProduct(data));
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formattedDateTime = currentDateTime.toLocaleString(undefined, options);

  const updateDateAndProduct = updateProduct => {
    fetch(`http://localhost:5000/updateProduct`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updateProduct),
    })
      .then(res => res.json())
      .then(() => {
        toast.success('Restock Is Successfully');
      });
  };

  const handleRestock = event => {
    event.preventDefault();
    const addedQty = parseInt(event.target.quantity.value);
    if (isNaN(addedQty) || addedQty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const newQuantity = parseInt(singleProduct?.quantity) + addedQty;
    const updateQuantity = { quantity: newQuantity };
    const updateProduct = {
      singleProduct,
      updateQuantity: newQuantity,
      date: formattedDateTime,
      lastQuantityAdd: addedQty,
    };

    fetch(`http://localhost:5000/productId/${singleProduct?._id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updateQuantity),
    })
      .then(res => res.json())
      .then(() => {
        updateDateAndProduct(updateProduct);
        event.target.reset();
        toast.success('Quantity Updated!');
        resetAndReload();
      })
      .catch(err => {
        console.error(err);
        toast.error('Update failed');
      });
  };

  const handleDecrease = event => {
    event.preventDefault();
    const decreaseQty = parseInt(event.target.quantity.value);
    if (isNaN(decreaseQty) || decreaseQty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (parseInt(singleProduct?.quantity) < decreaseQty) {
      toast.error('Cannot decrease below available quantity');
      event.target.reset();
      return;
    }

    const newQuantity = parseInt(singleProduct?.quantity) - decreaseQty;
    const updateQuantity = { quantity: newQuantity };

    fetch(`http://localhost:5000/productId/${singleProduct?._id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updateQuantity),
    })
      .then(res => res.json())
      .then(() => {
        toast.success('Quantity Decreased Successfully');
        event.target.reset();
        resetAndReload();
      })
      .catch(err => {
        console.error(err);
        toast.error('Update failed');
      });
  };

  const handleUpdateDetails = async event => {
    event.preventDefault();
    setIsUpdating(true);

    const name = event.target.name.value;
    const productId = event.target.productId.value;
    const price = event.target.price.value;

    const imageFile = event.target.imageFile.files[0];
    const imgUrl = event.target.img.value;

    let finalImageUrl = imgUrl || singleProduct?.img;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const imageData = await res.json();
        if (imageData.success) {
          finalImageUrl = imageData.data.url;
        } else {
          toast.error("Image Upload Failed");
          setIsUpdating(false);
          return;
        }
      }

      const updatedData = { name, img: finalImageUrl, productId, price };

      const serverRes = await fetch(`http://localhost:5000/product-update/${singleProduct?._id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await serverRes.json();
      if (result) {
        toast.success('Product Details Updated Successfully');
        const modal = document.getElementById('edit-details-modal');
        if (modal) modal.checked = false;
        resetAndReload();
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = id => {
    const proceed = window.confirm('Are You Sure?');
    if (proceed) {
      fetch(`http://localhost:5000/product/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          toast.success('Successfully Deleted');
          resetAndReload();
        });
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-zinc-300 mb-8 sm:mb-10">
        All Products
      </h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 px-2 sm:px-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-zinc-500 group-focus-within:text-info transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products by name..."
            className="block w-full h-12 pl-12 pr-4 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 border border-zinc-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info/50 shadow-lg shadow-black/20 transition-all duration-300 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Product Count Info */}
      <div className="text-center mb-4">
        <p className="text-sm text-zinc-400">
          Showing <span className="text-info font-semibold">{products.length}</span> of <span className="text-info font-semibold">{totalProducts}</span> products
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        {loading && (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg text-info"></span>
            <p className="text-zinc-400 mt-2">Loading products...</p>
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="text-center py-8 text-zinc-400">
            <p>No products found</p>
          </div>
        )}
        {!loading && products.length > 0 && (
          <table className="table table-xs sm:table-sm md:table-md lg:table-lg w-full text-center text-white">
            <thead>
              <tr className="ext-xs sm:text-sm md:text-base">
                <th className='bg-black'>#</th>
                <th className='bg-black'>Image</th>
                <th className='bg-black'>Name</th>
                <th className='bg-black'>Product ID</th>
                <th className='bg-black'>Quantity</th>
                <th className='bg-black'>Price</th>
                <th className='bg-black'>Edit</th>
                <th className='bg-black'>Increase</th>
                <th className='bg-black'>Decrease</th>
                <th className='bg-black'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <AllProduct
                  key={product._id}
                  product={product}
                  index={index + 1}
                  handleEdit={handleEdit}
                  singleProduct={singleProduct}
                  handleRestock={handleRestock}
                  handleDecrease={handleDecrease}
                  handleDelete={handleDelete}
                  handleUpdateDetails={handleUpdateDetails}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* See More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center mt-6 mb-3">
          <button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="btn btn-outline btn-info btn-md gap-2 px-6 group"
          >
            {loadingMore ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : (
              <>
                <span className="text-base">See More</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </>
            )}
          </button>
          <p className="text-xs text-zinc-500 mt-1.5">
            Load {PRODUCTS_PER_PAGE} more
          </p>
        </div>
      )}

      {/* No More Products Message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center mt-8 mb-4">
          <p className="text-sm text-zinc-500">
            All {totalProducts} products loaded
          </p>
        </div>
      )}

      {/* Edit Details Modal */}
      <input type="checkbox" id="edit-details-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-900 text-zinc-100 p-0 overflow-hidden max-w-md w-full border border-zinc-700 shadow-2xl transition-all duration-300">

          {/* Header */}
          <div className="bg-zinc-800 px-6 py-4 flex justify-between items-center border-b border-zinc-700">
            <h3 className="text-xl font-bold text-zinc-200 tracking-tight">
              Edit Product
            </h3>
            <label
              htmlFor="edit-details-modal"
              className="btn btn-sm btn-circle btn-ghost text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              ✕
            </label>
          </div>

          <div className="p-6">
            <form key={singleProduct?._id || 'empty-form'} onSubmit={handleUpdateDetails} className="space-y-4">

              {/* Image Selection Section */}
              <div className="space-y-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-zinc-300 font-bold text-xs uppercase tracking-wider">Option 1: Upload Image</span>
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-xs sm:file-input-sm w-full bg-zinc-900 border-zinc-700 text-zinc-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px bg-zinc-700 flex-grow"></div>
                  <span className="text-[10px] font-black text-zinc-500">OR</span>
                  <div className="h-px bg-zinc-700 flex-grow"></div>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-zinc-300 font-bold text-xs uppercase tracking-wider">Option 2: Image URL</span>
                  </label>
                  <input
                    type="text"
                    name="img"
                    defaultValue={singleProduct?.img}
                    className="input input-bordered input-sm w-full bg-zinc-900 text-zinc-200 border-zinc-700 focus:border-zinc-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Text Inputs with Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-zinc-400 font-medium text-xs">Product Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={singleProduct?.name}
                    required
                    className="input input-bordered w-full bg-zinc-900 text-zinc-200 border-zinc-700 focus:border-zinc-500 h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-zinc-400 font-medium text-xs">Product ID</span>
                    </label>
                    <input
                      type="text"
                      name="productId"
                      defaultValue={singleProduct?.productId}
                      required
                      className="input input-bordered w-full bg-zinc-900 text-zinc-200 border-zinc-700 focus:border-zinc-500 h-11"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-zinc-400 font-medium text-xs">Price (TK)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={singleProduct?.price}
                      required
                      className="input input-bordered w-full bg-zinc-900 text-zinc-200 border-zinc-700 focus:border-zinc-500 h-11 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className={`btn w-full mt-6 h-12 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-info/10 hover:shadow-info/20 border-none transition-all ${isUpdating ? 'loading' : ''}`}
              >
                {isUpdating ? 'Saving Changes...' : 'Update Product'}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AllProducts;