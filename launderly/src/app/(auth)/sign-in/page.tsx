"use client";

import { loginUser } from "@/api/auth";
import { useSession } from "@/context/useSession";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormValues {
  username: string;
  password: string;
  role: string;
}

const SignCustomer = () => {
  const initialValues: FormValues = {
    username: "",
    password: "",
    role: "customer",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().optional(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuth, setUser } = useSession();
  const router = useRouter();

  const handleLogin = async (values: FormValues) => {
    try {
      setIsLoading(true);
  
      // Panggil API login
      const { customer, token, message } = await loginUser(values);
  
      // Simpan user & token di localStorage
      localStorage.setItem("role", customer.role);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(customer));
  
      // Tampilkan notifikasi sukses
      toast.success(message || "Login successful!");
  
      // Redirect ke dashboard customer
      router.push("/dashboardCustomer");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred during login.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 text-black">
      <div className="lg:w-1/2 w-full relative">
        <Image
          src="/signcc.png"
          alt="Login background"
          layout="responsive"
          width={1920} // Sesuaikan dengan lebar gambar asli
          height={1080} // Sesuaikan dengan tinggi gambar asli
          className="object-cover"
        />
        <Image
          src="/loginCat.gif"
          alt="Login animation"
          layout="intrinsic"
          width={600} // Sesuaikan dengan lebar gambar animasi
          height={400} // Sesuaikan dengan tinggi gambar animasi
          className="absolute bottom-0 right-0 w-1/3 h-auto object-cover"
        />
      </div>
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-8 mt-20 lg:p-12">
        <div className="mb-8 text-center w-full max-w-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CATCH YOUR MOMENT!
          </h1>
          <p className="text-lg text-gray-600 mx-auto">
            Log in to enjoy all the benefits. Enter your username and password.
            It’s easy, fast, and secure!
          </p>
        </div>
        <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your username and password to log in.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Field name="role" value="customer" type="hidden" />
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
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/sign-up/customer"
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignCustomer;