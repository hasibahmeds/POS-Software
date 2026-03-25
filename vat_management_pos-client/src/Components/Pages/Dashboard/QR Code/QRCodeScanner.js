// src/pages/Dashboard/QRCodeScanner.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BookProducts from '../Book Product/BookProducts';

const QRCodeScanner = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/allProduct')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    if (quantity < 1 || quantity > selectedProduct.quantity) {
      toast.error(`Only ${selectedProduct.quantity} in stock!`);
      return;
    }
    const bookingData = {
      name: selectedProduct.name,
      pId: selectedProduct.pId,
      price: selectedProduct.price,
      img: selectedProduct.img,
      bookQuantity: Number(quantity),
    };
    fetch('http://localhost:5000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    })
      .then(res => res.json())
      .then(() => {
        const newStock = selectedProduct.quantity - quantity;
        fetch(`http://localhost:5000/productId/${selectedProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newStock }),
        })
        .then(() => {
          toast.success(`${selectedProduct.name} × ${quantity} added!`);
          setSelectedProduct(null);
          setQuantity(1);
          setSearch('');
          window.location.reload();
        });
      })
      .catch(err => toast.error('Failed to add'));
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-zinc-300 mb-8 sm:mb-10">
          Search Product
        </h1>

        <div className="bg-zinc-700 rounded-lg shadow-2xl p-6 sm:p-8">
          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Type product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input rounded-lg input-bordered bg-zinc-900 input-lg w-full h-[50px] text-gray-200 text-lg"
              autoFocus
            />
          </div>

          {/* Dropdown Results */}
          {search && !selectedProduct && (
            <div className="max-h-64 overflow-y-auto bg-white rounded-lg shadow-lg mb-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setSearch(p.name);
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-zinc-200 cursor-pointer border-b last:border-b-0"
                  >
                    <img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-lg text-black">{p.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {p.quantity} | {p.price} TK
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-gray-500">No product found</p>
              )}
            </div>
          )}

          {/* Selected Product Card */}
          {selectedProduct && (
            <div className="bg-zinc-900 text-white p-6 rounded-xl mb-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-32 h-32 rounded-xl shadow-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-lg">Price: {selectedProduct.price} TK</p>
                  <p className="text-lg">Available: {selectedProduct.quantity}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-lg font-semibold whitespace-nowrap">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input input-bordered h-[32px] w-20 text-sm sm:w-18 sm:text-base text-black"
                  />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-sm bg-[#ff2600] hover:bg-[#ff2600ec] text-white font-bold rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSearch('');
                      setQuantity(1);
                    }}
                    className="flex-1 btn-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cart & Invoice */}
          <div className="mt-12 w-full overflow-x-hidden">
            <BookProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;