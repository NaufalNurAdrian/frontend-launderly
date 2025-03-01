import EmployeeTable from "@/components/dashboard/employee/employeetable";
import HeaderEmployee from "@/components/dashboard/employee/headeremployee";

export default function Employee () {
    return (
        <div className="h-full w-full">
            <div>
                <HeaderEmployee/>
            </div>
            <div >
                <EmployeeTable/>
            </div>
        </div>
    )
}