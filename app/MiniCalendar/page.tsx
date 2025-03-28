import MiniCalendar from "@/components/MiniCalendar";
import Doctor from "@/components/Doctor";
import Clinic from "@/components/Clinic";
import SelectTime from "@/components/SelectTime";

export default function Page() {
  return (
    <div className="h-screen flex  justify-center items-center">
      <div className="flex flex-col gap-8">
        <div className="border border-gray-400 rounded-lg p-4 shadow-md w-[350px] h-[150px] flex justify-center items-center">
          <Clinic />
        </div>
        <div className="border border-gray-400 rounded-lg p-4 shadow-md w-[350px] h-[150px] flex justify-center items-center">
          <MiniCalendar />
        </div>

        <div className="border border-gray-400 rounded-lg p-4 shadow-md w-[350px] h-[150px] flex justify-center items-center">
          <Doctor />
        </div>
        <div className="border border-gray-400 rounded-lg p-4 shadow-md w-[350px] h-[150px] flex justify-center items-center">
          <SelectTime />
        </div>
      </div>
    </div>
  );
}
