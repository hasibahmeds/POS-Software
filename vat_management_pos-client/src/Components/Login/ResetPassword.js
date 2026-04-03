import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";

const ResetPassword = () => {
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(data.email);
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (err) {
      toast.error("Failed to send reset email. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="bg-zinc-800 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-black bg-opacity-70 p-6 sm:p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ff2600] text-center mb-6">
          Reset Password
        </h1>
        
        {!emailSent ? (
          <>
            <p className="text-gray-300 text-sm text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-2.5 text-sm bg-transparent text-white border border-gray-500 rounded-lg focus:outline-none transition"
                />
                {errors.email && (
                  <p className="text-[#ff2600] text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 text-sm font-semibold text-white bg-black hover:bg-[#0000007a] rounded-lg shadow-md focus:outline-none transition duration-300 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-block py-2 px-4 text-sm font-semibold text-white bg-[#ff2600] hover:bg-[#ff2600dc] rounded-lg transition"
            >
              Back to Login
            </Link>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-5 text-center text-sm">
          <span className="text-gray-300">Remember your password?</span>
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

export default ResetPassword;