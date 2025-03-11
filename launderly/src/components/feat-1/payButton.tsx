import React from "react";
import { createPayment } from "@/app/api/payment";

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
<<<<<<< HEAD
          console.log("Payment success:", result);
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
=======
          // console.log("Payment success:", result);
        },
        onPending: function (result) {
          // console.log("Payment pending:", result);
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f
        },
        onError: function (result) {
          console.error("Payment failed:", result);
        },
        onClose: function () {
<<<<<<< HEAD
          console.log("User closed the payment popup.");
=======
          // console.log("User closed the payment popup.");
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f
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
