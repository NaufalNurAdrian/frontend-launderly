"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { IFormValues, IOrderItem } from "@/types/worker";
import BypassModal from "./bypassModal";
import { useToken } from "@/hooks/useToken";
import { bypassRequest, getWorkerRequest } from "@/app/api/worker";

export default function OrderProcessingPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useToken();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await getWorkerRequest(orderId);
        setOrderItems(res.data);
      } catch (err: any) {
        setError("failed to get order data.");
        toast.error("failed to get order data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [orderId]);

  const formik = useFormik<IFormValues>({
    initialValues: {
      items: orderItems.map((item) => ({
        id: item.id,
        itemName: item.laundryItem.itemName,
        quantity: item.qty,
        workerQuantity: 0,
      })),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object().shape({
          workerQuantity: Yup.number().min(0, "quantity can't be negative").required("required"),
        })
      ),
    }),
    onSubmit: (values) => {
<<<<<<< HEAD
<<<<<<< HEAD
      const isValid = values.items.every((item) => item.workerQuantity === item.quantity);
=======
      const isValid = values.items.every(
        (item) => item.workerQuantity === item.quantity
      );
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f
=======
      const isValid = values.items.every(
        (item) => item.workerQuantity === item.quantity
      );
>>>>>>> 29233b1c232abb8e0c829063399476b6e7f64bff

      if (isValid) {
        toast.success("Order process succeed");
      } else {
        toast.custom("quantity doesn't match, please request a bypass.");
      }
    },
  });
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const bypass = async (notes: string) => {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      const res = await bypassRequest(token, notes, orderId);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBypass = async (notes: string) => {
    try {
      await toast.promise(bypass(notes), {
        loading: "Sending...",
        success: "Sent!",
        error: (err) => err.message,
      });
      router.push("/requests");
    } catch (err) {
    } finally {
      handleCloseModal();
    }
  };
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg max-w-[500px] lg:w-[600px] lg:mx-auto mx-3 gap-5 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-500">Processing Order #{orderId}</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
        {formik.values.items.map((item, index) => {
          const isMatch = item.workerQuantity === item.quantity;

          return (
            <div key={item.id} className="border bg-white shadow-md p-4 rounded-lg">
              <p className="font-bold text-lg">{item.itemName}</p>
              <p className="text-blue-500">order qty: {item.quantity}</p>
              <input
                type="number"
                name={`items[${index}].workerQuantity`}
                value={formik.values.items[index].workerQuantity}
                onChange={formik.handleChange}
                min="0"
                className={`border p-2 rounded w-full mt-2 bg-white border-blue-300 focus:ring-2 ${isMatch ? "focus:ring-blue-500" : "focus:ring-red-500"}`}
                style={{
                  WebkitAppearance: "none",
                }}
              />
              {!isMatch && <p className="text-red-500 mt-2">Quantity does not match, please request a bypass!</p>}
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            type="submit"
            onClick={() => {
              router.push(`/process/${orderId}`);
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!formik.values.items.every((item) => item.workerQuantity === item.quantity)}
          >
            Process Order
          </button>

          <button
            type="button"
            className={`w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-lg ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
            onClick={handleOpenModal}
<<<<<<< HEAD
<<<<<<< HEAD
            disabled={formik.values.items.every((item) => item.workerQuantity === item.quantity)}
=======
            disabled={formik.values.items.every(
              (item) => item.workerQuantity === item.quantity
            )}
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f
=======
            disabled={formik.values.items.every(
              (item) => item.workerQuantity === item.quantity
            )}
>>>>>>> 29233b1c232abb8e0c829063399476b6e7f64bff
          >
            Request Bypass
          </button>
        </div>
      </form>
<<<<<<< HEAD
<<<<<<< HEAD
      <BypassModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitBypass} />
=======
=======
>>>>>>> 29233b1c232abb8e0c829063399476b6e7f64bff
      <BypassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBypass}
      />
<<<<<<< HEAD
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f
=======
>>>>>>> 29233b1c232abb8e0c829063399476b6e7f64bff
    </div>
  );
}
