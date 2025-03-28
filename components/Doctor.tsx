"use client";

import React, { useState } from "react";

export default function Doctor() {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const doctors = ["د. خالد", "د. سارة", "د. ليلى", "د. أحمد", "د. يوسف"];

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctor(e.target.value);
  };

  return (
    <div className="flex flex-row items-center">
      <select
        value={selectedDoctor}
        onChange={handleDoctorChange}
        className="border p-2 rounded-md"
      >
        <option value="">اختر طبيبًا</option>
        {doctors.map((doctor, index) => (
          <option key={index} value={doctor}>
            {doctor}
          </option>
        ))}
      </select>

      <h3 className="text-lg font-semibold mb-4 pl-5">:اختر طبيبًا</h3>
    </div>
  );
}
