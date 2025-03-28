"use client";

import { useState } from "react";
import { Button } from "./button";

export default function SendWhatsApp() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // To display the status to the user

  const sendMessage = async () => {
    setStatus("Sending message..."); // Update the status during sending
    try {
      const response = await fetch("http://localhost:3001/send-message", {
        // Make sure this points to the correct port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setMessage(""); // If the message is sent successfully
      } else {
        setStatus("Failed to send the message.");
      }
    } catch (error) {
      setStatus("Error while sending the message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col pt-5 px-4">
      <textarea
        rows={3}
        placeholder="Send Whatsapp Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button className="mt-6" onClick={sendMessage}>
        Send To Whatsapp
      </Button>
      {status && <p className="mt-2 text-green-600">{status}</p>}{" "}
    </div>
  );
}
