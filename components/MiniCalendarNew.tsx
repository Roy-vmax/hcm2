"use client";

import { useState } from "react";

const BookingForm = () => {
  // List of doctors
  const doctors = ["د. خالد", "د. سارة", "د. ليلى", "د. أحمد", "د. يوسف"];

  // List of clinics
  const clinics = [
    "عظمية",
    "عصبية",
    "أطفال",
    "أسنان",
    "قلبية",
    "نسائية",
    "معالجة فيزيائية",
    "عينية",
    "أذن انف حنجرة",
    "جلد",
  ];

  // States to manage selected doctor, clinic, times, and date
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to generate time slots from 08:00 to 18:00
  const generateTimeOptions = () => {
    const times = [];
    let hour = 8;
    let minute = 0;

    while (hour < 12 || (hour >= 13 && hour < 18)) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute === 0 ? "00" : "30";
      times.push(`${formattedHour}:${formattedMinute}`);

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
        if (hour === 12) hour = 13;
      }
    }

    return times;
  };

  // Handle time selection
  const handleTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    if (time && !selectedTimes.includes(time)) {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  // Function to remove a selected time from the list
  const removeTime = (timeToRemove: string) => {
    setSelectedTimes(selectedTimes.filter((time) => time !== timeToRemove));
  };

  // Handle form submission and validate the fields
  const handleSubmit = () => {
    if (
      !selectedDoctor ||
      !selectedClinic ||
      selectedTimes.length === 0 ||
      !selectedDate
    ) {
      alert("الرجاء اختيار طبيب وعيادة وأوقات وتاريخ");
      return;
    }

    const data = {
      doctor: selectedDoctor,
      clinic: selectedClinic,
      times: selectedTimes,
      date: selectedDate.toISOString().split("T")[0],
    };

    // Display the selected information below the form
    setSelectedDoctor(data.doctor);
    setSelectedClinic(data.clinic);
    setSelectedTimes(data.times);
    setSelectedDate(new Date(data.date));
  };

  return (
    <div
      className="max-w-md mx-auto mt-8 p-4 border rounded-xl shadow-md flex flex-col gap-6"
      style={{ direction: "ltr" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">حجز موعد</h2>

      {/* Date picker */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">اختر التاريخ:</label>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border p-2 rounded-md"
        />
      </div>

      {/* Doctor selection */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">اختر طبيبًا:</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">اختر طبيبًا</option>
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>
      </div>

      {/* Clinic selection */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">اختر عيادة:</label>
        <select
          value={selectedClinic}
          onChange={(e) => setSelectedClinic(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">اختر عيادة</option>
          {clinics.map((clinic, index) => (
            <option key={index} value={clinic}>
              {clinic}
            </option>
          ))}
        </select>
      </div>

      {/* Time selection */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">اختر وقتًا:</label>
        <select
          value={selectedTime}
          onChange={handleTimeSelect}
          className="border p-2 rounded-md"
        >
          <option value="">اختر وقتًا</option>
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        حفظ الحجز
      </button>

      {/* Display selected data */}
      <div className="mt-6">
        {selectedDoctor &&
        selectedClinic &&
        selectedTimes.length > 0 &&
        selectedDate ? (
          <div>
            <h3 className="text-lg font-semibold">تفاصيل الحجز:</h3>
            <p>الطبيب: {selectedDoctor}</p>
            <p>العيادة: {selectedClinic}</p>
            <p>الأوقات: {selectedTimes.join(", ")}</p>
            <p>التاريخ: {selectedDate.toISOString().split("T")[0]}</p>
          </div>
        ) : (
          <p>لم يتم اختيار أي تفاصيل بعد.</p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
