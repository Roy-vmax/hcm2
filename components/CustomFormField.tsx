"use client";

import Image from "next/image";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-number-input";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export enum FormFieldType {
  INPUT,
  TEXTAREA,
  PHONE_INPUT,
  DATE_PICKER,
  SELECT,
  CHECKBOX,
  SKELETON,
}

type CustomFormFieldProps = {
  fieldType: FormFieldType;
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: ControllerRenderProps) => React.ReactNode;
  // Add these new props
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
};

const CustomFormField = ({
  fieldType,
  control,
  name,
  label,
  placeholder,
  iconSrc,
  iconAlt,
  showTimeSelect,
  dateFormat,
  disabled,
  children,
  renderSkeleton,
  // Add the new props with defaults
  onChange,
  maxLength,
  type = "text",
}: CustomFormFieldProps) => {
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              <div className="relative">
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    width={24}
                    height={24}
                    alt={iconAlt || "icon"}
                    className="icon-form"
                  />
                )}
                <FormControl>
                  <Input
                    {...field}
                    placeholder={placeholder}
                    className={`px-4 ${iconSrc && "pl-10"}`}
                    disabled={disabled}
                    // Support for new props
                    maxLength={maxLength}
                    type={type}
                    onChange={(e) => {
                      field.onChange(e);
                      // Call custom onChange if provided
                      if (onChange) onChange(e);
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="min-h-[120px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="US"
                  placeholder={placeholder}
                  disabled={disabled}
                  className="input-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.DATE_PICKER:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect={showTimeSelect}
                  dateFormat={dateFormat || "MM/dd/yyyy"}
                  wrapperClassName="date-picker"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.SELECT:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="px-4">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{children}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="checkbox-field">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              {label && <FormLabel className="checkbox-label">{label}</FormLabel>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case FormFieldType.SKELETON:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              {label && <FormLabel>{label}</FormLabel>}
              {renderSkeleton && renderSkeleton(field)}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
};

export default CustomFormField;