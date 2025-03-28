"use client";
import React, { useState } from "react";

export default function Clinic() {
  const [selectedClinic, setSelectedClinic] = useState("");

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
    "جلدية",
  ];

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClinic(e.target.value);
  };

  return (
    <div className="flex flex-row items-center">
      <select
        value={selectedClinic}
        onChange={handleClinicChange}
        className="border p-2 rounded-md"
      >
        <option value="">اختر عيادة</option>
        {clinics.map((clinic, index) => (
          <option key={index} value={clinic}>
            {clinic}
          </option>
        ))}
      </select>
      <h3 className="text-lg font-semibold mb-4 pl-5">:اختر عيادة</h3>
    </div>
  );
}
