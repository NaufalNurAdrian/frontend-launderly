import React from "react";
import { createPayment } from "@/api/payment";

interface PayButtonProps {
  orderId: number;
}

const PayButton: React.FC<PayButtonProps> = ({ orderId }) => {
  const handlePayment = async () => {
    try {
      const snapToken = await createPayment(orderId);

      if (!snapToken) {
        console.error("Invalid payment response:", snapToken);
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
        },
        onError: function (result) {
          console.error("Payment failed:", result);
        },
        onClose: function () {
          console.log("User closed the payment popup.");
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Pay
    </button>
  );
};

export default PayButton;
