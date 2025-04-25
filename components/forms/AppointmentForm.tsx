"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

// Add payment method enum
export enum PaymentMethod {
  CREDIT_CARD = "Credit Card",
  DEBIT_CARD = "Debit Card",
  INSURANCE = "Insurance"
}

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Extended appointment schema to include payment details
  const AppointmentFormValidation = getAppointmentSchema(type);

  // Extend the validation schema with payment fields
  const ExtendedFormValidation = z.object({
    ...AppointmentFormValidation.shape,
    paymentMethod: z.enum([
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.DEBIT_CARD,
      PaymentMethod.INSURANCE
    ]).optional(),
    cardNumber: z.string().optional().refine(
      (value) => !showPayment || (value && value.replace(/\s/g, '').length === 16),
      { message: "Card number must be 16 digits" }
    ),
    cardholderName: z.string().optional().refine(
      (value) => !showPayment || (value && value.length > 0),
      { message: "Cardholder name is required" }
    ),
    expiryDate: z.string().optional().refine(
      (value) => !showPayment || (value && /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)),
      { message: "Expiry date must be in MM/YY format" }
    ),
    cvv: z.string().optional().refine(
      (value) => !showPayment || (value && /^\d{3,4}$/.test(value)),
      { message: "CVV must be 3 or 4 digits" }
    ),
  });

  const form = useForm<z.infer<typeof ExtendedFormValidation>>({
    resolver: zodResolver(ExtendedFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
      paymentMethod: PaymentMethod.CREDIT_CARD,
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ExtendedFormValidation>
  ) => {
    if (type === "create" && !showPayment) {
      setShowPayment(true);
      return;
    }

    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
          // We're not actually sending payment info to backend, just collecting it on frontend
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    form.setValue('cardNumber', formattedValue);
  };

  // Handle expiry date formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    form.setValue('expiryDate', value);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = showPayment ? "Submit Payment & Appointment" : "Proceed to Payment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && !showPayment && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        {type === "create" && showPayment && (
          <section className="space-y-6">
            <div className="mb-6 space-y-1">
              <h2 className="sub-header">Payment Information</h2>
              <p className="text-dark-700">Please provide your payment details</p>
            </div>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="paymentMethod"
              label="Payment Method"
              placeholder="Select payment method"
            >
              {Object.values(PaymentMethod).map((method) => (
                <SelectItem key={method} value={method}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={`/assets/icons/${method === PaymentMethod.CREDIT_CARD 
                        ? 'credit-card' 
                        : method === PaymentMethod.DEBIT_CARD 
                        ? 'debit-card' 
                        : 'insurance'}.svg`}
                      width={20}
                      height={20}
                      alt={method.toLowerCase()}
                      className="h-5 w-5"
                    />
                    <p>{method}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="cardNumber"
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                onChange={handleCardNumberChange}
                maxLength={19}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="cardholderName"
                label="Cardholder Name"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="expiryDate"
                label="Expiry Date (MM/YY)"
                placeholder="MM/YY"
                onChange={handleExpiryChange}
                maxLength={5}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="cvv"
                label="CVV"
                placeholder="123"
                maxLength={4}
                type="password"
              />
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-800">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/info.svg"
                  width={20}
                  height={20}
                  alt="info"
                  className="h-5 w-5"
                />
                <p className="text-sm font-medium">This is a demo payment form. No actual payment will be processed.</p>
              </div>
            </div>
          </section>
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};