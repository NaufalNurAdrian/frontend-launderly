import CustomerSidebar from "@/components/ui/sidebar";
import RequestOrderPage from "./_components/TableRequestOrde";
import OrderPage from "./_components/TableOrder";

export default function TablePage() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />
      <div className="flex-1 p-4 md:p-8 flex flex-col gap-6">
        <RequestOrderPage />
        <OrderPage />
      </div>
    </main>
  );
}
