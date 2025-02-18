"use client";

import { requestForgetPassword } from "@/api/user";
import { ForgotPasswordSchema } from "@/libs/schema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const initialValues = { email: "" };

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: any
  ) => {
    try {
      const response = await requestForgetPassword(values.email);
      toast.success(
        response?.message || "Password reset link sent! Check your email."
      );
    } catch (error: any) {
      toast.error(error.message); // Menggunakan pesan dari API
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold  mb-4 text-center">
          Forgot Password?
        </h2>
        <p className=" mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold  mb-2"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
