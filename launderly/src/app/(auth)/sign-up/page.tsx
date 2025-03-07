"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RegisterSchema } from "@/libs/schema";
import { registerUser } from "@/app/api/auth";
import Link from "next/link";
import { FormValues, initialValues } from "@/types/auth";

export default function CustomerSignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await registerUser(values);
      router.push("/");
    } catch (err) {
      // Handle error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-blue-300 text-white">
      {/* Bagian Kiri - Background Gambar (Hidden di Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-400">
        <Image
          src="/homepage.jpeg"
          alt="Login background"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Bagian Kanan - Form Sign Up (Full-Screen di Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 shadow-lg rounded-lg h-screen">
        {/* Header */}
        <div className="mb-8 text-center w-full max-w-lg">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold text-black mb-4">Launderly</h1>
          </Link>
          <p className="text-lg mx-auto">
            Sign up to enjoy all the benefits. Create your account today!
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your details to create a new account.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <Field
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6">
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
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Submitting..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Sudah Punya Akun */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
