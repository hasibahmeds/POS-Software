import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Booking from "./Booking";

const Bookings = () => {
  const [bookings, setBooking] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/bookings')
      .then(res => res.json())
      .then(data => setBooking(data));
  }, [bookings]);

  const handleDelete = id => {
    const proceed = window.confirm('Are You Sure ?');
    if (proceed) {
      const url = `http://localhost:5000/bookings/${id}`;
      fetch(url, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          const remaining = bookings.filter(booking => booking._id !== id);
          setBooking(remaining);
          toast.success('Successfully Delivered ');
        });
    }
  };
  return (
    <div className="px-1">
      <h1 className="text-2xl font-semibold text-center py-5">
        Manage All Booking
      </h1>
      <div className="overflow-x-auto">
        <table className="table  w-full text-black">
          <thead>
            <tr className="text-3xl">
              <th></th>
              <th>Ship Name</th>
              <th>Ship Code</th>
              <th>Terminal</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Phone</th>
              <th>Description</th>
              <th>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <Booking
                key={booking._id}
                booking={booking}
                index={index + 1}
                handleDelete={handleDelete}
              ></Booking>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
