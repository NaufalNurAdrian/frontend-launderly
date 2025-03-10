"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Outlet, OutletApiResponse } from "@/types/outlet.type";
import { fetchAllOutlet } from "@/services/outletService";
import { createEmployee } from "@/services/employeService";
import {
  AddEmployeeInput,
  EmployeeStation,
  EmployeeWorkShift,
} from "@/types/employee.type";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Fullname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.string()
    .oneOf(["SUPER_ADMIN", "OUTLET_ADMIN", "WORKER", "DRIVER"])
    .required("Role is required"),
  station: Yup.string().when("role", {
    is: "WORKER",
    then: (schema) => schema.required("Station is required"),
  }),
  workShift: Yup.string().when("role", {
    is: (role: string) => ["WORKER", "OUTLET_ADMIN"].includes(role),
    then: (schema) => schema.required("Shift is required"),
  }),
  outletId: Yup.string().when("role", {
    is: (role: string) => ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role),
    then: (schema) => schema.required("Outlet is required"),
  }),
});

export default function ModalAddEmployee({ onClose }: { onClose: () => void }) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allerMessage, setAllertMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      station: "",
      workShift: "",
      outletId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload: AddEmployeeInput = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role as AddEmployeeInput["role"],
          outletId: parseInt(values.outletId),
          workShift: (values.workShift as EmployeeWorkShift) || undefined,
          station: (values.station as EmployeeStation) || undefined,
        };
        // console.log(payload);

        await createEmployee(payload);
        toast.success("success create employee");
        onClose();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "cannot create employe";
        setAllertMessage(errorMessage);
        toast.error(errorMessage);
        console.error("Error adding employee:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadOutlets = async () => {
      try {
        const data: OutletApiResponse = await fetchAllOutlet();
        setOutlets(data.outlets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load outlets");
      }
    };

    if (["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(formik.values.role)) {
      loadOutlets();
    }
  }, [formik.values.role]);

  const handleRoleChange = (value: string) => {
    formik.setFieldValue("role", value);
    // Reset dependent fields when role changes
    formik.setFieldValue("station", "");
    formik.setFieldValue("workShift", "");
    formik.setFieldValue("outletId", "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Add New Employee</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          <CardDescription>Add your employee</CardDescription>
        </CardHeader>

        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Employee Name</Label>
              <Input
                id="fullName"
                {...formik.getFieldProps("fullName")}
                placeholder="Fullname"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...formik.getFieldProps("email")}
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                placeholder="Confirm Password"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formik.values.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="OUTLET_ADMIN">Outlet Admin</SelectItem>
                  <SelectItem value="WORKER">Worker</SelectItem>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-sm">{formik.errors.role}</p>
              )}
            </div>

            {/* Station - Only for Worker */}
            {formik.values.role === "WORKER" && (
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Select
                  value={formik.values.station}
                  onValueChange={(value: string) =>
                    formik.setFieldValue("station", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WASHING">Washing</SelectItem>
                    <SelectItem value="IRONING">Ironing</SelectItem>
                    <SelectItem value="PACKING">Packing</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.station && formik.errors.station && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.station}
                  </p>
                )}
              </div>
            )}

            {/* Shift - For Worker and Outlet Admin */}
            {["WORKER", "OUTLET_ADMIN"].includes(formik.values.role) && (
              <div className="space-y-2">
                <Label htmlFor="workShift">Shift</Label>
                <Select
                  value={formik.values.workShift}
                  onValueChange={(value: string) =>
                    formik.setFieldValue("workShift", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAY">Day</SelectItem>
                    <SelectItem value="NIGHT">Night</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.workShift && formik.errors.workShift && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.workShift}
                  </p>
                )}
              </div>
            )}

            {/* Outlet - For Outlet Admin, Worker and Driver */}
            {["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(
              formik.values.role
            ) && (
              <div className="space-y-2">
                <Label htmlFor="outletId">Outlet</Label>
                <Select
                  value={formik.values.outletId}
                  onValueChange={(value: string) =>
                    formik.setFieldValue("outletId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet.id} value={String(outlet.id)}>
                        {outlet.outletName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.outletId && formik.errors.outletId && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.outletId}
                  </p>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
