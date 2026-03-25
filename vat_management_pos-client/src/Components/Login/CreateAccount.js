// import React from "react";
// import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
// import { useForm } from "react-hook-form";
// import auth from "../../firebase.init";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const CreateAccount = () => {
//   const [createUserWithEmailAndPassword] =
//     useCreateUserWithEmailAndPassword(auth);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const userSubmit = (data) => {
//     const name = data.firstName + " " + data.lastName;
//     const email = data.email;

//     fetch(`http://localhost:5000/create-user/${data.email}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, email }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         toast.success("User created successfully");
//         console.log("User created successfully", data);
//       })
//       .catch((error) => {
//         console.error("Error creating user:", error);
//       });
//   };

//   const onSubmit = (data) => {
//     createUserWithEmailAndPassword(data.email, data.password);
//     userSubmit(data);
//     console.log("Successfully created account");
//   };

//   return (
//     <div className="bg-zinc-800 min-h-screen flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-sm bg-black bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-2xl">
//         <h1 className="text-2xl sm:text-3xl font-bold text-[#ff2600] text-center mb-6">
//           Create Account
//         </h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-white mb-1">
//               First Name
//             </label>
//             <input
//               placeholder="First name"
//               {...register("firstName", {
//                 required: "First name is required",
//                 maxLength: 20,
//               })}
//               className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
//             />
//             {errors.firstName && (
//               <p className="text-[#ff2600] text-xs mt-1">
//                 {errors.firstName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-white mb-1">
//               Last Name
//             </label>
//             <input
//               placeholder="Last name"
//               {...register("lastName", {
//                 pattern: {
//                   value: /^[A-Za-z]+$/i,
//                   message: "Only letters allowed",
//                 },
//               })}
//               className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
//             />
//             {errors.lastName && (
//               <p className="text-[#ff2600] text-xs mt-1">
//                 {errors.lastName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-white mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="your@email.com"
//               {...register("email", {
//                 required: "Email is required",
//                 maxLength: 50,
//               })}
//               className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
//             />
//             {errors.email && (
//               <p className="text-[#ff2600] text-xs mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-white mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Min 6 characters",
//                 },
//                 maxLength: 20,
//               })}
//               className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
//             />
//             {errors.password && (
//               <p className="text-[#ff2600] text-xs mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 text-sm font-semibold text-white bg-black hover:bg-[#0000007a] rounded-lg shadow-md focus:outline-none transition duration-300"
//           >
//             Create Account
//           </button>
//         </form>

//         <div className="mt-5 text-center text-sm">
//           <span className="text-gray-300">Already have an account?</span>
//           <Link
//             to="/login"
//             className="ml-1 font-bold text-[#ff2600] hover:text-[#ff2600dc] underline transition"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAccount;










import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import auth from "../../firebase.init";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CreateAccount = () => {
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userSubmit = (data) => {
    const name = data.firstName + " " + data.lastName;
    const email = data.email;
    fetch(`http://localhost:5000/create-user/${data.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("User created successfully");
        console.log("User created successfully", data);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const onSubmit = (data) => {
    createUserWithEmailAndPassword(data.email, data.password);
    userSubmit(data);
    console.log("Successfully created account");
  };

  return (
    <div className="bg-zinc-800 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-black bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ff2600] text-center mb-6">
          Create Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              First Name
            </label>
            <input
              placeholder="First name"
              {...register("firstName", {
                required: "First name is required",
                maxLength: 20,
              })}
              className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
            />
            {errors.firstName && (
              <p className="text-[#ff2600] text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Last Name
            </label>
            <input
              placeholder="Last name"
              {...register("lastName", {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Only letters allowed",
                },
              })}
              className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
            />
            {errors.lastName && (
              <p className="text-[#ff2600] text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                maxLength: 50,
              })}
              className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
            />
            {errors.email && (
              <p className="text-[#ff2600] text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Min 6 characters",
                  },
                  maxLength: 20,
                })}
                className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#ff2600] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-sm font-semibold text-white bg-black hover:bg-[#0000007a] rounded-lg shadow-md focus:outline-none transition duration-300"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-5 text-center text-sm">
          <span className="text-gray-300">Already have an account?</span>
          <Link
            to="/login"
            className="ml-1 font-bold text-[#ff2600] hover:text-[#ff2600dc] underline transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
