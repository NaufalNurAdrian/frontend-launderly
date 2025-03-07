"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ResetPasswordSchema } from "@/libs/schema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { confirmForgetPassword } from "@/app/api/user";

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setSubmitting(true);
    try {
      const response = await confirmForgetPassword(
        params.token,
        values.password,
        values.confirmPassword
      );
      toast.success(
        response.message || "Password has been reset successfully!"
      );
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  New Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border bg-teal-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border bg-teal-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
