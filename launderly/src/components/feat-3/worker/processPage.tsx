"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { IFormValues, IOrderItem, IOrderItemResponse } from "@/types/worker";
import BypassModal from "./bypassModal";

export default function OrderProcessingPage() {
  const { orderId } = useParams();
  const workerId = 10;
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/order/orders/${orderId}`, {
          method: "GET",
          headers: {   'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: IOrderItemResponse = await res.json();
        setOrderItems(data.data);
      } catch (err) {
        setError("Gagal mengambil data order.");
        toast.error("Gagal mengambil data order: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    console.log(orderItems); // Panggil fungsi fetch
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
    enableReinitialize: true, // Re-inisialisasi form saat `orderItems` berubah
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object().shape({
          workerQuantity: Yup.number().min(0, "Jumlah tidak boleh negatif").required("Harus diisi"),
        })
      ),
    }),
    onSubmit: (values) => {
      const isValid = values.items.every((item) => item.workerQuantity === item.quantity);

      if (isValid) {
        toast.success("Order berhasil diproses!");
      } else {
        toast.custom("Jumlah tidak sesuai! Silakan request bypass.");
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
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/bypass/${orderId}/?workerId=${workerId}`, {
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
    bypass(notes); 
    toast.promise(bypass(notes), {
        loading: 'Sending...',
        success: 'Sent !',
        error: (err) => err.message,
      });
    handleCloseModal();
    router.push("/worker/request")
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-blue-300 rounded-lg w-[500px] h-full gap-5 flex flex-col items-center　mx-5">
      <h1 className="text-2xl font-bold text-blue-500">Processing Order #{orderId}</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-[450px]">
        {formik.values.items.map((item, index) => {
          const isMatch = item.workerQuantity === item.quantity;

          return (
            <div key={item.id} className="border bg-white shadow-md  p-3 rounded-lg">
              <p className="font-bold text-lg">{item.itemName}</p>
              <p className="text-blue-500">order qty: {item.quantity}</p>
              <input
                type="number"
                name={`items[${index}].workerQuantity`}
                value={formik.values.items[index].workerQuantity}
                onChange={formik.handleChange}
                className={`border p-1 rounded w-full mt-1 bg-white border-blue-300 ${isMatch ? "border-blue-500" : "border-red-500"}`}
                style={{
                  WebkitAppearance: "none",
                }}
              />
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
            disabled={!formik.values.items.every((item) => item.workerQuantity === item.quantity)}
          >
            Process Order
          </button>

          <button
            type="button"
            className={`ml-2 px-4 py-2 rounded ${formik.values.items.every((item) => item.workerQuantity === item.quantity) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
            onClick={handleOpenModal}
            disabled={formik.values.items.every((item) => item.workerQuantity === item.quantity)}
          >
            Request Bypass
          </button>
        </div>
      </form>
      <BypassModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitBypass} />
    </div>
  );
}
