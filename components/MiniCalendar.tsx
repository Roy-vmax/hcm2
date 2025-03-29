"use client";

import { useState } from "react";

const MiniCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="h-screen flex items-center justify-center">
      <input
        type="date"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => setDate(new Date(e.target.value))}
        className="border p-3 rounded text-lg"
      />

      <h2 className="text-xl font-semibold mb-4 pl-5">:اختر التاريخ</h2>
    </div>
  );
};

export default MiniCalendar;
