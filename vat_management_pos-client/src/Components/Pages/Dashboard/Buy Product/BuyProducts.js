import React, { useEffect, useState, useMemo } from "react";
import BuyProduct from "./BuyProduct";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BuyProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch all sales records
  const fetchSales = () => {
    fetch("http://localhost:5000/buys")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching sales:", err));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // DELETE INDIVIDUAL SALE
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sales record?")) {
      fetch(`http://localhost:5000/buy/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            toast.success("Sale record deleted successfully");
            setProducts(products.filter((p) => p._id !== id));
          }
        });
    }
  };

  // DELETE ALL SALES HISTORY
  const handleDeleteAll = () => {
    if (
      window.confirm(
        "CRITICAL WARNING: This will permanently delete ALL sales history. Proceed?"
      )
    ) {
      fetch("http://localhost:5000/buyDeleteAll", {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            toast.success(`Successfully cleared ${data.deletedCount} records`);
            setProducts([]); // Wipe UI state
          }
        })
        .catch((err) => console.error("Failed to delete all history:", err));
    }
  };

  // Summary Calculations
  const totalRevenue = products.reduce(
    (acc, product) => acc + parseFloat(product.finalNetAmount || product.newTotalPrice || product.totalPrice || 0),
    0
  );
  const totalVat = products.reduce(
    (acc, product) => acc + parseFloat(product.vatAmount || product.vat || 0),
    0
  );
  const totalItemsSold = products.reduce((acc, product) => {
    return (
      acc +
      (product.bookings
        ? product.bookings.reduce(
            (sum, item) => sum + parseInt(item.bookQuantity || 0),
            0
          )
        : 0)
    );
  }, 0);

  // Chart Data Processing
  const chartData = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const dailyData = products.reduce((acc, product) => {
      const date = product.date || "Unknown";
      if (!acc[date]) {
        acc[date] = { revenue: 0, items: 0, vat: 0 };
      }
      
      const revenue = parseFloat(product.finalNetAmount || product.newTotalPrice || product.totalPrice || 0);
      const vat = parseFloat(product.vatAmount || product.vat || 0);
      const items = product.bookings
        ? product.bookings.reduce((sum, item) => sum + parseInt(item.bookQuantity || 0), 0)
        : 0;

      acc[date].revenue += revenue;
      acc[date].items += items;
      acc[date].vat += vat;
      
      return acc;
    }, {});

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        revenue: parseFloat(data.revenue.toFixed(2)),
        items: data.items,
        vat: parseFloat(data.vat.toFixed(2)),
      }))
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
      });
  }, [products]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-zinc-300 uppercase tracking-widest">
          Sales History Dashboard
        </h1>
        {products.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600 px-6 py-2 rounded-lg transition-all font-bold text-sm"
          >
            DELETE ALL SALES
          </button>
        )}
      </div>

      {/* Daily Revenue Chart Section */}
      {products.length > 0 && (
        <div className="bg-zinc-800 rounded-xl shadow-2xl p-6 mb-8 border border-zinc-700">
          <h2 className="text-xl font-bold mb-6 text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-6 bg-lime-500 rounded-full"></span>
            Daily Revenue Summary (Last {chartData.length} Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#a1a1aa" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} TK`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#84cc16" }}
                  cursor={{ fill: "rgba(161, 161, 170, 0.1)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="#84cc16" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="items" 
                  name="Items" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="vat" 
                  name="VAT" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="overflow-x-auto bg-zinc-800 rounded-xl shadow-2xl p-4">
        <table className="table w-full text-white text-center">
          <thead>
            <tr className="text-zinc-400 border-b border-zinc-700">
              <th className="bg-transparent">#</th>
              <th className="bg-transparent">Customer</th>
              <th className="bg-transparent">Items</th>
              <th className="bg-transparent">Date/Time</th>
              <th className="bg-transparent text-red-400">Discount</th>
              <th className="bg-transparent">Sub Amount</th>
              <th className="bg-transparent">Vat (%)</th>
              <th className="bg-transparent text-lime-400">Total Price</th>
              <th className="bg-transparent">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-10 bg-zinc-600 text-gray-100">
                  No sales history available.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <BuyProduct
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

      {/* Revenue Summary Section */}
      <div className="mt-8 flex justify-end">
        <div className="bg-zinc-800 text-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-zinc-700">
          <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2 text-zinc-300">
            Total Revenue Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400 font-semibold">
                Total Items Sold:
              </span>
              <span className="font-bold">{totalItemsSold} Items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400 font-semibold">
                Total VAT Collected:
              </span>
              <span className="text-blue-400 font-bold">
                {totalVat.toFixed(2)} TK
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
              <span className="text-zinc-300 font-semibold text-lg">
                Net Revenue:
              </span>
              <span className="text-xl font-black text-lime-400">
                {totalRevenue.toFixed(2)} TK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyProducts;
