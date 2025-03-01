import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().optional(),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("New password is required")
    .min(5, "Password must be at least 5 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const AddressSchema = Yup.object().shape({
  street: Yup.string().required("Alamat jalan wajib diisi"),
  city: Yup.string().required("Kota wajib diisi"),
});

export const RequestOrderSchema = Yup.object().shape({
  addressId: Yup.number().required("Wajib diisi")
})