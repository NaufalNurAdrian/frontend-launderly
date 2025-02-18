import CustomerSidebar from "@/components/ui/sidebar";
import JoinTablePage from "./_components/JoinTable";

export default function TablePage() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />
<JoinTablePage/>
    </main>
  );
}
