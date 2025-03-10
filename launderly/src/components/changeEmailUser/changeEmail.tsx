"use client";

import React from "react";
import { useFormik } from "formik";
import { UpdateEmailSchema } from "@/libs/schema";
import { updateEmail } from "@/app/api/user";
import toast from "react-hot-toast";

interface ChangeEmailFormProps {
  onClose: () => void;
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      newEmail: "",
    },
    validationSchema: UpdateEmailSchema,
    onSubmit: async (values) => {
      if (!values.newEmail.trim()) {
        toast.error("Email cannot be empty!");
        return;
      }

      try {
        await updateEmail(values.newEmail);
        onClose();
      } catch (err) {
        console.error("Change email failed:", err);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 text-white">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Change Email
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm mb-2">New Email</label>
            <input
              type="email"
              name="newEmail"
              className={`w-full border ${
                formik.touched.newEmail && formik.errors.newEmail
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded p-2`}
              value={formik.values.newEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.newEmail && formik.errors.newEmail && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.newEmail}
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
              {formik.isSubmitting ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmailForm;
