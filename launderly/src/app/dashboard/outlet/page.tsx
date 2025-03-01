import HeaderOutlet from "@/components/dashboard/outlet/headeroutlet";
import OutletTable from "@/components/dashboard/outlet/outlettable";

export default function () {
    return (
        <div className="h-full w-full">
            <div>
                <HeaderOutlet/>
            </div>
            
            <div>
                <OutletTable/>
            </div>
        </div>
    )
}