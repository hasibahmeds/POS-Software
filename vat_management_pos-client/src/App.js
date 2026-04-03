import "react-day-picker/dist/style.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CreateAccount from "./Components/Login/CreateAccount";
import Login from "./Components/Login/Login";
import RequireAuth from "./Components/Login/RequireAUth";
import ResetPassword from "./Components/Login/ResetPassword";
import AddProduct from "./Components/Pages/Dashboard/Add Product/AddProduct";
import AllProducts from "./Components/Pages/Dashboard/All Product/AllProducts";
import Bookings from "./Components/Pages/Dashboard/Boooking/Bookings";
import BuyProducts from "./Components/Pages/Dashboard/Buy Product/BuyProducts";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import QRCodeScanner from "./Components/Pages/Dashboard/QR Code/QRCodeScanner";
import UpdateProducts from "./Components/Pages/Dashboard/UpdateProduct/UpdateProducts";
// import Home from './Components/Pages/Home/Home';
import Pdf from "./Components/Pages/Pdf/Pdf";
import NotFound from "./Components/Share/NotFound";

function App() {
  return (
    <div>
      {/* <Appointment /> */}
      <Routes>
        <Route path="/createAccount" element={<CreateAccount />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/resetPassword" element={<ResetPassword />}></Route>
        <Route path="/*" element={<NotFound />}></Route>

        {/* Dashboard Start */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        >
          {/* <Route index element={<Home />} /> */}
          <Route index element={<QRCodeScanner />} />
          <Route path="booking" element={<Bookings />} />
          <Route path="qrCode" element={<QRCodeScanner />} />
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="allProduct" element={<AllProducts />} />
          <Route path="buyProduct" element={<BuyProducts />} />
          <Route path="updateProduct" element={<UpdateProducts />} />

          <Route path="pdf" element={<Pdf />} />
        </Route>
        {/* Dashboard End */}
      </Routes>
      {/* <Footer /> */}
      <ToastContainer
        // position="top-center"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
