"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { IFormValues, IOrderItem, IOrderItemResponse } from "@/types/worker";
import BypassModal from "./bypassModal";

<<<<<<< HEAD
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export default function OrderProcessingPage() {
  const { orderId } = useParams();
=======
export default function OrderProcessingPage() {
  const { orderId } = useParams();
  const workerId = 10;
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD

=======
  const token = localStorage.getItem("token")
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await fetch(`${BASE_URL}/order/orders/${orderId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
=======
        const res = await fetch(`http://localhost:8000/api/order/orders/${orderId}`, {
          method: "GET",
          headers: {   'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: IOrderItemResponse = await res.json();
        setOrderItems(data.data);
      } catch (err) {
<<<<<<< HEAD
        setError("failed to get order data.");
        toast.error("failed to get order data: " + (err as Error).message);
=======
        setError("Gagal mengambil data order.");
        toast.error("Gagal mengambil data order: " + (err as Error).message);
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
<<<<<<< HEAD
    console.log(orderItems);
=======
    console.log(orderItems); // Panggil fungsi fetch
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
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
<<<<<<< HEAD
    enableReinitialize: true,
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object().shape({
          workerQuantity: Yup.number().min(0, "quantity can't be negative").required("required"),
=======
    enableReinitialize: true, // Re-inisialisasi form saat `orderItems` berubah
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object().shape({
          workerQuantity: Yup.number().min(0, "Jumlah tidak boleh negatif").required("Harus diisi"),
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
        })
      ),
    }),
    onSubmit: (values) => {
      const isValid = values.items.every((item) => item.workerQuantity === item.quantity);

      if (isValid) {
<<<<<<< HEAD
        toast.success("Order process succeed");
      } else {
        toast.custom("quantity doesn't match, please request a bypass.");
      }
    },
  });

=======
        toast.success("Order berhasil diproses!");
      } else {
        toast.custom("Jumlah tidak sesuai! Silakan request bypass.");
      }
    },
  });
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const bypass = async (notes: string) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const res = await fetch(`${BASE_URL}/bypass/${orderId}`, {
=======
      const res = await fetch(`http://localhost:8000/api/bypass/${orderId}/?workerId=${workerId}`, {
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bypassNote: notes }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBypass = (notes: string) => {
<<<<<<< HEAD
    bypass(notes);
    toast.promise(bypass(notes), {
      loading: "Sending...",
      success: "Sent!",
      error: (err) => err.message,
    });
    handleCloseModal();
    router.push("/requests");
=======
    bypass(notes); 
    toast.promise(bypass(notes), {
        loading: 'Sending...',
        success: 'Sent !',
        error: (err) => err.message,
      });
    handleCloseModal();
    router.push("/worker/request")
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
<<<<<<< HEAD
    <div className="p-6 bg-white rounded-lg max-w-[500px] lg:w-[600px] lg:mx-auto mx-3 gap-5 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-500">Processing Order #{orderId}</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
=======
    <div className="p-6 bg-blue-300 rounded-lg w-[500px] h-full gap-5 flex flex-col items-center　mx-5">
      <h1 className="text-2xl font-bold text-blue-500">Processing Order #{orderId}</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-[450px]">
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
        {formik.values.items.map((item, index) => {
          const isMatch = item.workerQuantity === item.quantity;

          return (
<<<<<<< HEAD
            <div key={item.id} className="border bg-white shadow-md p-4 rounded-lg">
=======
            <div key={item.id} className="border bg-white shadow-md  p-3 rounded-lg">
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
              <p className="font-bold text-lg">{item.itemName}</p>
              <p className="text-blue-500">order qty: {item.quantity}</p>
              <input
                type="number"
                name={`items[${index}].workerQuantity`}
                value={formik.values.items[index].workerQuantity}
                onChange={formik.handleChange}
<<<<<<< HEAD
                className={`border p-2 rounded w-full mt-2 bg-white border-blue-300 focus:ring-2 ${isMatch ? "focus:ring-blue-500" : "focus:ring-red-500"}`}
=======
                className={`border p-1 rounded w-full mt-1 bg-white border-blue-300 ${isMatch ? "border-blue-500" : "border-red-500"}`}
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
                style={{
                  WebkitAppearance: "none",
                }}
              />
<<<<<<< HEAD
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
=======
              {!isMatch && <p className="text-red-500">quantity not match, please send a bypass request !</p>}
            </div>
          );
        })}
        <div className="flex justify-between ">
          <button
            type="submit"
            onClick={() => {
              router.push(`/worker/process/${orderId}`);
            }}
            className={`px-4 py-2 rounded ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
            disabled={!formik.values.items.every((item) => item.workerQuantity === item.quantity)}
          >
            Process Order
          </button>

          <button
            type="button"
<<<<<<< HEAD
            className={`w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-lg ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
=======
            className={`ml-2 px-4 py-2 rounded ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
            onClick={handleOpenModal}
            disabled={formik.values.items.every((item) => item.workerQuantity === item.quantity)}
          >
            Request Bypass
          </button>
        </div>
      </form>
<<<<<<< HEAD

=======
>>>>>>> d4581cef50b9f61bdd749d47118aa9da896f65ac
      <BypassModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitBypass} />
    </div>
  );
}
