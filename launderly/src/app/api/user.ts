import axios from "axios";
import { toast } from "react-hot-toast";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

// Helper untuk mendapatkan token dari localStorage
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in again.");
    throw new Error("No token found.");
  }
  return token;
}

// Get User Profile
export async function getUserProfile() {
  try {
    const token = getToken();
    const response = await axios.get(`${base_url}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Reset Password
export async function resetPassword(password: string, confirmPassword: string) {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${base_url}/user/reset-password`,
      { password, confirmPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(response.data.message || "Password reset successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to reset password. Please try again.");
    console.error("Error resetting password:", error);
    throw error;
  }
}

// Edit Avatar
export async function editAvatar(avatarFile: File) {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.patch(
      `${base_url}/user/edit-avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Avatar updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update avatar. Please try again.");
    console.error("Error updating avatar:", error);
    throw error;
  }
}

// Update Email
export async function updateEmail(newEmail: string) {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${base_url}/user/update-email`,
      { newEmail: newEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Email updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update email. Please try again.");
    console.error("Error updating email:", error);
    throw error;
  }
}

// Verify Email
export async function verifyEmail(token: string) {
  try {
    const response = await axios.patch(`${base_url}/user/verify-email`, {
      token,
    });

    toast.success("Email has been change successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to change email. Please try again.");
    console.error("Error confirming change email:", error);
    throw error;
  }
}

// Request Forget Password
export async function requestForgetPassword(email: string) {
  try {
    const response = await axios.post(
      `${base_url}/user/request-forget-password`,
      { email }
    );

    toast.success(
      response.data.message || "If the email exists, a reset link will be sent."
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to request password reset. Please try again.");
    console.error("Error requesting password reset:", error);
    throw error;
  }
}

// Confirm Forget Password
export async function confirmForgetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
) {
  try {
    const response = await axios.patch(
      `${base_url}/user/confirm-forget-password`,
      {
        token,
        newPassword,
        confirmPassword,
      }
    );

    toast.success("Password has been reset successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to reset password. Please try again.");
    console.error("Error confirming reset password:", error);
    throw error;
  }
}

// konfirmasi order
export async function confirmOrder(orderId: number) {
  try {
    const response = await axios.patch(`${base_url}/user/confirm-order`, {
      orderId,
    });

    toast.success("Order has been confirmed successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to confirm order. Please try again.");
    console.error("Error confirming order:", error);
    throw error;
  }
}
