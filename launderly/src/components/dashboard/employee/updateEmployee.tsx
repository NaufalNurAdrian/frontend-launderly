"use client";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeInput, getEmployeeById, updateEmployee } from "@/services/employeService";
import {
  AddEmployeeInput,
  EmployeeById,
  EmployeeStation,
  EmployeeWorkShift,
} from "@/types/employee.type";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Outlet, OutletApiResponse } from "@/types/outlet.type";
import { fetchAllOutlet } from "@/services/outletService";
import { toast } from "react-hot-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Updated validation schema with conditional validation
const validationSchema = Yup.object({
  fullName: Yup.string().when('$enabledFields.fullName', {
    is: true,
    then: (schema) => schema.required("Employee name is required"),
    otherwise: (schema) => schema,
  }),
  email: Yup.string().when('$enabledFields.email', {
    is: true,
    then: (schema) => schema.email("Invalid email").required("Email is required"),
    otherwise: (schema) => schema,
  }),
  role: Yup.string().when('$enabledFields.role', {
    is: true,
    then: (schema) => schema
      .oneOf(["SUPER_ADMIN", "OUTLET_ADMIN", "WORKER", "DRIVER"])
      .required("Role is required"),
    otherwise: (schema) => schema,
  }),
  station: Yup.string().when('$enabledFields.station', {
    is: true,
    then: (schema) => schema
      .oneOf(["WASHING", "IRONING", "PACKING"])
      .required("Station is required"),
    otherwise: (schema) => schema,
  }),
  workShift: Yup.string().when('$enabledFields.workShift', {
    is: true,
    then: (schema) => schema
      .oneOf(["DAY", "NIGHT"])
      .required("Work shift is required"),
    otherwise: (schema) => schema,
  }),
  outletId: Yup.string().when('$enabledFields.outletId', {
    is: true,
    then: (schema) => schema.required("Outlet is required"),
    otherwise: (schema) => schema,
  }),
});

export default function ModalEmployeeUpdate({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const [employee, setEmployee] = useState<EmployeeById | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Track which fields are enabled
  const [enabledFields, setEnabledFields] = useState({
    fullName: false,
    email: false,
    role: false,
    station: false,
    workShift: false,
    outletId: false,
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const employeeData: EmployeeById = await getEmployeeById(id);
        setEmployee(employeeData);

        const data: OutletApiResponse = await fetchAllOutlet();
        setOutlets(data.outlets);
      } catch (data: any) {
        console.error("Failed to fetch employee:", data.message);
        toast.error(data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fullName: employee?.employee.user.fullName || "",
      email: employee?.employee.user.email || "",
      role: employee?.employee.user.role || "",
      station: employee?.employee.station || "",
      workShift: employee?.employee.workShift || "",
      outletId: employee?.employee.outletId ? String(employee.employee.outletId) : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      // Check if at least one field is enabled
      if (!Object.values(enabledFields).some(value => value)) {
        return;
      }

      setIsSubmitting(true);
      try {
        const payload: EmployeeInput = {};
        
        // Only include fields that are enabled
        if (enabledFields.fullName) {
          payload.fullName = values.fullName;
        }
        
        if (enabledFields.email) {
          payload.email = values.email;
        }
        
        if (enabledFields.role) {
          payload.role = values.role as AddEmployeeInput["role"];
        }
        
        if (enabledFields.outletId) {
          payload.outletId = values.outletId;
        }
        
        if (enabledFields.workShift) {
          payload.workShift = values.workShift as EmployeeWorkShift;
        }
        
        if (enabledFields.station) {
          payload.station = values.station as EmployeeStation;
        }

        const data = await updateEmployee(id, payload);
        toast.success("Employee updated successfully");
        onClose();
      } catch (data: any) {
        toast.error(data.message);
        console.error("Error updating employee:", data);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Toggle a field's enabled state
  const toggleField = (fieldName: keyof typeof enabledFields) => {
    setEnabledFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Check if any field is enabled
  const isAnyFieldEnabled = Object.values(enabledFields).some(value => value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Update Employee</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          <CardDescription>Select the fields you want to update</CardDescription>
        </CardHeader>

        {loading ? (
          <CardContent className="flex justify-center py-6">
            <div>Loading employee data...</div>
          </CardContent>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <CardContent className="space-y-6">
              {/* Toggle switches for each field */}
              <div className="space-y-3 border-b pb-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-name" className="cursor-pointer">Name</Label>
                  <Switch
                    id="toggle-name"
                    checked={enabledFields.fullName}
                    onCheckedChange={() => toggleField("fullName")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-email" className="cursor-pointer">Email</Label>
                  <Switch
                    id="toggle-email"
                    checked={enabledFields.email}
                    onCheckedChange={() => toggleField("email")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-role" className="cursor-pointer">Role</Label>
                  <Switch
                    id="toggle-role"
                    checked={enabledFields.role}
                    onCheckedChange={() => toggleField("role")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-station" className="cursor-pointer">Station</Label>
                  <Switch
                    id="toggle-station"
                    checked={enabledFields.station}
                    onCheckedChange={() => toggleField("station")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-shift" className="cursor-pointer">Work Shift</Label>
                  <Switch
                    id="toggle-shift"
                    checked={enabledFields.workShift}
                    onCheckedChange={() => toggleField("workShift")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-outlet" className="cursor-pointer">Outlet</Label>
                  <Switch
                    id="toggle-outlet"
                    checked={enabledFields.outletId}
                    onCheckedChange={() => toggleField("outletId")}
                  />
                </div>
              </div>

              {/* Show message if no fields are enabled */}
              {!isAnyFieldEnabled && (
                <div className="text-center py-4 text-gray-500">
                  <p>Select at least one field to update</p>
                </div>
              )}

              {isAnyFieldEnabled && (
                <Accordion 
                  type="multiple" 
                  defaultValue={Object.keys(enabledFields).filter(key => enabledFields[key as keyof typeof enabledFields])}
                  className="w-full"
                >
                  {/* Name Field */}
                  {enabledFields.fullName && (
                    <AccordionItem value="fullName">
                      <AccordionTrigger className="text-sm font-medium">Employee Name</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Input 
                            id="fullName" 
                            {...formik.getFieldProps("fullName")} 
                            placeholder="Enter full name"
                          />
                          {formik.touched.fullName && formik.errors.fullName && (
                            <p className="text-red-500 text-xs">{formik.errors.fullName as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Email Field */}
                  {enabledFields.email && (
                    <AccordionItem value="email">
                      <AccordionTrigger className="text-sm font-medium">Email Address</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Input 
                            id="email" 
                            type="email"
                            {...formik.getFieldProps("email")} 
                            placeholder="Enter email address"
                          />
                          {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-xs">{formik.errors.email as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Role Field */}
                  {enabledFields.role && (
                    <AccordionItem value="role">
                      <AccordionTrigger className="text-sm font-medium">Employee Role</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Select
                            value={formik.values.role}
                            onValueChange={(value: string) => formik.setFieldValue("role", value)}
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
                            <p className="text-red-500 text-xs">{formik.errors.role as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Station Field */}
                  {enabledFields.station && (
                    <AccordionItem value="station">
                      <AccordionTrigger className="text-sm font-medium">Work Station</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Select
                            value={formik.values.station}
                            onValueChange={(value: string) => formik.setFieldValue("station", value)}
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
                            <p className="text-red-500 text-xs">{formik.errors.station as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Work Shift Field */}
                  {enabledFields.workShift && (
                    <AccordionItem value="workShift">
                      <AccordionTrigger className="text-sm font-medium">Work Shift</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Select
                            value={formik.values.workShift}
                            onValueChange={(value: string) => formik.setFieldValue("workShift", value)}
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
                            <p className="text-red-500 text-xs">{formik.errors.workShift as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Outlet Field */}
                  {enabledFields.outletId && (
                    <AccordionItem value="outletId">
                      <AccordionTrigger className="text-sm font-medium">Outlet Assignment</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <Select
                            value={formik.values.outletId}
                            onValueChange={(value: string) => formik.setFieldValue("outletId", value)}
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
                            <p className="text-red-500 text-xs">{formik.errors.outletId as string}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 mt-2 pb-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600" 
                disabled={isSubmitting || !isAnyFieldEnabled}
              >
                {isSubmitting ? "Updating..." : "Update Employee"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}