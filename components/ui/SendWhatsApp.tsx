"use client";

import { useState } from "react";

export default function SendWhatsApp() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // To display the status to the user

  const sendMessage = async () => {
    setStatus("Sending message..."); // Update the status during sending
    try {
      const response = await fetch("http://localhost:3000/send-message", {
        // Make sure this points to the correct port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!"); // If the message is sent successfully
      } else {
        setStatus("Failed to send the message.");
      }
    } catch (error) {
      setStatus("Error while sending the message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col pt-5">
      <input
        type="text"
        placeholder="Send Whatsapp Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send To Whatsapp</button>
      {status && <p>{status}</p>} {/* Display the status to the user */}
    </div>
  );
}
