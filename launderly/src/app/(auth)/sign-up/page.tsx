"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validationSchema } from "@/libs/schema";

export default function CustomerSignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface FormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const initialValues: FormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      // Kirim request untuk registrasi
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/register`,
        values,
        {
          withCredentials: true,
        }
      );

      // Sukses registrasi
      toast.success(res.data.message || "Registration successful!");
      router.push("/");
    } catch (err: unknown) {
      // Validasi apakah err berasal dari Axios
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred during registration";
        toast.error(errorMessage);
      } else {
        // Error tidak diketahui
        console.error("Unexpected error during registration:", err);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-gray-300 mt-16">
      <div className="w-full lg:w-1/2 relative">
        <div>
          <Image
            src="/sign-up.jpeg"
            alt="Cinema venue"
            fill
            className="object-cover"
          />
        </div>
        <div className="md:absolute inset-0 flex flex-col justify-center p-6 lg:p-12 text-black">
          <h1 className="text-2xl lg:text-4xl font-bold mb-4 leading-snug">
            Laundry service made easier, <br /> with great deals and
            convenience!
          </h1>
          <p className="text-lg">
            Create an account to enjoy affordable prices, special offers, &
            priority service.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-gray-900 flex flex-col justify-center p-6 lg:p-12 max-h-screen">
        <div className="flex-grow overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-white">
              Customer
            </h2>
            <p className="text-gray-400">
              When you register as a customer, you can browse available events,
              purchase tickets for events, and provide feedback on the events
              you have attended.
            </p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-gray-300">
                    Your name
                  </label>
                  <Field
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your fullName"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-300">
                    Email
                  </label>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-300">
                    Password
                  </label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Submitting..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
