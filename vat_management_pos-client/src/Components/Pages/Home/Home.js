import React from "react";
import Name from "./Name";

const Home = () => {
  return (
    <div>
      <Name />
      <div className="grid grid-cols-2 ">
        <div className="flex justify-center p-4 ">
          <h1
            style={{ boxShadow: '0px 5px 10px blue' }}
            className="text-7xl uppercase text-center pt-40 font-extrabold items-center rounded-xl"
          >
            Welcome to our website
          </h1>
        </div>
        <div className="p-4">
          <img
            style={{ boxShadow: '0px 5px 10px blue', height: '450px' }}
            className="rounded-xl"
            // style={{ height: "600px" }}
            src="https://www.newagebd.com/files/records/news/202306/204474_161.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
