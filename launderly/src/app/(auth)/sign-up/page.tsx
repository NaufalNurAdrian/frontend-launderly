"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RegisterSchema } from "@/libs/schema";
import { registerUser } from "@/api/auth";
import Link from "next/link";
import { FormValues, initialValues } from "@/types/auth";

export default function CustomerSignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const response = await registerUser(values);
      router.push("/"); // redirect after success
    } catch (err) {
      // Handle error here
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="h-screen flex flex-col lg:flex-row bg-blue-100 text-white">
      <div className="w-full relative md:flex md:items-center md:w-1/2 bg-blue-400">
        <Image
          src="/sign-in.jpeg"
          alt="Login background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 object-cover"
        />
      </div>
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-8 lg:p-12 bg-blue-200">
        <div className="mb-8 text-center w-full max-w-lg">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Launderly!
            </h1>
          </Link>
          <p className="text-lg text-gray-600 mx-auto">
            Sign up to enjoy all the benefits. Create your account today!
          </p>
        </div>
        <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Submitting..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/sign-in" className="text-blue-500 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
