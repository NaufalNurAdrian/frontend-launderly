"use client";

import { loginUser } from "@/api/auth";
import useSession from "@/hooks/useSession";
import { LoginSchema } from "@/libs/schema";
import { LoginValues } from "@/types/auth";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoginGoogle from "./loginGoggle";
import { ArrowBigLeftDash } from "lucide-react";
import { useRole } from "@/hooks/useRole";

const Login = () => {
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const { setIsAuth, setUser } = useSession();
  const router = useRouter();

  const handleLogin = async (values: LoginValues, { setSubmitting }: any) => {
    try {
      const { customer, token, message } = await loginUser(values);

      localStorage.setItem("token", token);

      setIsAuth(true);
      setUser(customer);

      toast.success(message || "Login successful!");
      const { role } = customer;

      if (role === "WORKER" || role === "DRIVER") {
        router.push("/attendance");
      } else if (role === "CUSTOMER") {
        router.push("/dashboardCustomer");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred during login.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-blue-300 text-white">
      {/* Bagian Kiri - Background Gambar (Hidden di Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-400">
        <Image src="/homepage.jpeg" alt="Login background" layout="fill" objectFit="cover" className="rounded-lg" />
      </div>

      {/* Bagian Kanan - Form Login (Full-Screen di Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 shadow-lg rounded-lg h-screen">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back!</h2>
          <p className="text-gray-600 mb-6 text-center">Please enter your email and password to log in.</p>
          <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleLogin}>
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <Field id="email" name="email" type="text" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <Field id="password" name="password" type="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Forgot Password Link */}
                <div className="mb-6 flex justify-between text-sm">
                  <Link href="/" className=" text-fuchsia-600 hover:underline">
                    <div className="flex">
                      <ArrowBigLeftDash />
                      Back Home
                    </div>
                  </Link>
                  <Link href="/forgot-password" className="text-blue-500 hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <LoginGoogle />
        </div>
      </div>
    </div>
  );
};

export default Login;
