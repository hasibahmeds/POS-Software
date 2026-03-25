import React from "react";

const Booking = ({ booking, index, handleDelete }) => {
  const { _id, name, shipCode, terminalName, date, slot, phone, description } =
    booking;
  return (
    <tr>
      <th>{index}</th>
      <td>{name}</td>
      <td>{shipCode}</td>
      <td>{terminalName}</td>
      <td>{date}</td>
      <td>{slot}</td>
      <td>{phone}</td>
      <td>{description}</td>
      <td>
        <button
          onClick={() => handleDelete(_id)}
          className="bg-blue-800 px-3 py-1 rounded-md uppercase text-white font-semibold hover:bg-blue-600"
        >
          delivered
        </button>
      </td>
    </tr>
  );
};

export default Booking;
