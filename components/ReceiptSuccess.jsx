"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Printer, Download, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

const PaymentReceiptCard = ({ appointment, doctor, paymentDetails }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to handle copying receipt to clipboard
  const handleCopyReceipt = () => {
    const receiptText = `
      CAREPULSE APPOINTMENT RECEIPT
      
      Appointment Information:
      Doctor: Dr. ${doctor?.name}
      Date & Time: ${formatDateTime(appointment.schedule).dateTime}
      Reason: ${appointment.reason}
      
      Payment Details:
      Status: ${paymentDetails.status}
      Amount: ${paymentDetails.amount}
      Payment Method: ${paymentDetails.paymentMethod}
      Transaction ID: ${paymentDetails.transactionId}
      ${
        paymentDetails.paymentMethod === "Credit Card"
          ? `Card Number: ${paymentDetails.cardNumber}
      Cardholder: ${paymentDetails.cardholderName}`
          : ""
      }
    `;

    navigator.clipboard.writeText(receiptText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Function to print the receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Function to download receipt as text file
  const handleDownloadReceipt = () => {
    const receiptText = `
CAREPULSE APPOINTMENT RECEIPT

Appointment Information:
Doctor: Dr. ${doctor?.name}
Date & Time: ${formatDateTime(appointment.schedule).dateTime}
Reason: ${appointment.reason}

Payment Details:
Status: ${paymentDetails.status}
Amount: ${paymentDetails.amount}
Payment Method: ${paymentDetails.paymentMethod}
Transaction ID: ${paymentDetails.transactionId}
${
  paymentDetails.paymentMethod === "Credit Card"
    ? `Card Number: ${paymentDetails.cardNumber}
Cardholder: ${paymentDetails.cardholderName}`
    : ""
}
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `receipt-${paymentDetails.transactionId}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black text-white rounded-lg border border-gray-800 shadow-lg mb-8">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-white">
          Appointment Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Appointment Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-400">
              Appointment Information:
            </h4>

            <div className="flex items-center gap-3">
              <Image
                src={doctor?.image || ""}
                alt="doctor"
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="font-medium text-white">Dr. {doctor?.name}</p>
            </div>

            <div className="flex gap-2 items-center">
              <Image
                src="/assets/icons/calendar.svg"
                height={20}
                width={20}
                alt="calendar"
              />
              <p className="text-gray-300">
                {formatDateTime(appointment.schedule).dateTime}
              </p>
            </div>

            <div className="pt-2">
              <p className="font-medium text-white">Reason:</p>
              <p className="text-gray-300">{appointment.reason}</p>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-400">Payment Details:</h4>

            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="font-medium text-green-500">
                {paymentDetails.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="font-medium text-white">
                {paymentDetails.amount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Payment Method:</span>
              <span className="text-white">{paymentDetails.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Transaction ID:</span>
              <span className="font-mono text-sm text-blue-400">
                {paymentDetails.transactionId}
              </span>
            </div>

            {paymentDetails.paymentMethod === "Credit Card" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Card Number:</span>
                  <span className="text-white">
                    {paymentDetails.cardNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cardholder:</span>
                  <span className="text-white">
                    {paymentDetails.cardholderName}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Actions */}
      <div className="border-t border-gray-800 px-6 py-4 flex justify-end space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
          onClick={handleCopyReceipt}
        >
          {copySuccess ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
          <span>{copySuccess ? "Copied!" : "Copy"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
          onClick={handleDownloadReceipt}
        >
          <Download size={16} />
          <span>Download</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handlePrintReceipt}
        >
          <Printer size={16} />
          <span>Print Receipt</span>
        </Button>
      </div>
    </div>
  );
};

export default function ReceiptSuccess({
  userId,
  appointment,
  doctor,
  paymentDetails,
}) {
  return (
    <div className="flex h-screen max-h-screen px-[5%] bg-black text-white">
      <div className="success-img w-full max-w-4xl mx-auto">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit my-6"
          />
        </Link>

        <section className="flex flex-col items-center mb-8">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center text-white">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted and paid!
          </h2>
          <p className="text-gray-300">We'll be in touch shortly to confirm.</p>
        </section>

        <PaymentReceiptCard
          appointment={appointment}
          doctor={doctor}
          paymentDetails={paymentDetails}
        />

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="shad-primary-btn bg-blue-600 text-white hover:bg-blue-700"
            asChild
          >
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>
        </div>

        <p className="copyright text-center mt-8 text-gray-400">
          © 2025 CarePulse
        </p>
      </div>
    </div>
  );
}
