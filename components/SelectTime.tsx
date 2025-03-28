"use client";

import React, { useState } from "react";

export default function SelectTime() {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // توليد الأوقات من 08:00 إلى 12:00 ومن 13:00 إلى 18:00
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
        if (hour === 12) hour = 13; // تخطي الساعة 12
      }
    }

    return times;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    if (time && !selectedTimes.includes(time)) {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const removeTime = (timeToRemove: string) => {
    setSelectedTimes(selectedTimes.filter((time) => time !== timeToRemove));
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-row items-center">
        <select
          value={selectedTime}
          onChange={handleSelect}
          className="border p-2 rounded-md"
        >
          <option value="">اختر وقتًا</option>
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
        <h3 className="text-lg font-semibold mb-4 pl-5">:اختر الوقت</h3>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-semibold">الأوقات المختارة:</h4>
        {selectedTimes.length === 0 && (
          <p className="text-gray-500">لم يتم اختيار أي وقت</p>
        )}
        {selectedTimes.map((time, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{time}</span>
            <button
              onClick={() => removeTime(time)}
              className="text-red-500 text-sm"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
