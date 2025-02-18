import OrderPage from "./TableOrder";
import RequestOrderPage from "./TableRequestOrde";

export default function JoinTablePage() {
  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col gap-6">
<RequestOrderPage/>
<OrderPage/>
    </div>
  );
}
