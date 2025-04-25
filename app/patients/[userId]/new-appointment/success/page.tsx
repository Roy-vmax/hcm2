// page.tsx
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import ReceiptSuccess from "@/components/ReceiptSuccess"; // Create this component with the code above

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  // Mock payment details - in a real app, these would come from your payment processor
  const paymentDetails = {
    status: "Paid",
    amount: "$15.00",
    paymentMethod: "Credit Card",
    transactionId: `PAY-${appointmentId.substring(0, 8)}`,
    cardNumber: "•••• •••• •••• 4512",
    cardholderName: appointment.patientName || "Patient",
  };

  return (
    <ReceiptSuccess
      userId={userId}
      appointment={appointment}
      doctor={doctor}
      paymentDetails={paymentDetails}
    />
  );
};

export default RequestSuccess;