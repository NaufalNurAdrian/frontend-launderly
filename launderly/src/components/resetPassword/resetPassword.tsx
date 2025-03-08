"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { ResetPasswordSchema } from "@/libs/schema";
import { resetPassword } from "@/app/api/user";

interface ResetPasswordFormProps {
  onClose: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onClose }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword(values.password, values.confirmPassword);

        onClose();
      } catch (err) {
        console.error("Reset password failed:", err);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 text-white">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Reset Password
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-black text-sm mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="password"
              className={`w-full border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded p-2`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "🙈" : "👁️"}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block  text-black text-sm mb-2">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className={`w-full border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded p-2`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
