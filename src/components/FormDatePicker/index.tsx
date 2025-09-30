import React, { useState } from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import Calendar from "react-calendar";
import { format, parse, isValid } from "date-fns";
import useOnclickOutside from "react-cool-onclickoutside";
import "react-calendar/dist/Calendar.css";
import DateIcon from "assets/icons/calendar_gray.svg";
import "./style.scss";

type Props = FieldHookConfig<string> & {
  label?: string;
  type?: "text" | "password" | "email";
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  minDate?: Date,
};

export const FormDatePicker: React.FC<Props> = ({
  label,
  className,
  help,
  type = "text",
  placeholder = "MM/DD/YYYY",
  isRequired,
  minDate,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const ref = useOnclickOutside(() => {
    setIsCalendarVisible(false);
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.value);
  };

  return (
    <div
      className={classNames(
        "form-date-picker-control",
        {
          error: meta.touched && meta.error,
        },
        className
      )}
      ref={ref}
    >
      <div className="d-flex justify-content-between">
        <label htmlFor={props.name} className="form-date-picker-control__label">
          {label}
        </label>
        {!isRequired && (
          <div className="form-date-picker-control__required">Optional</div>
        )}
      </div>
      <div className="position-relative">
        <input
          className={classNames("form-date-picker-control__input", {
            active: field.value,
          })}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          value={field.value}
          placeholder={placeholder}
          type={type}
          onFocus={() => setIsCalendarVisible(true)}
        />
        <img
          src={DateIcon}
          className="form-date-picker-control__icon"
          alt="calendar"
        />
      </div>
      <div className="input-control__footer">
        {meta.touched && meta.error && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>
      <div
        className={classNames("form-date-picker-control__calendar", {
          visible: isCalendarVisible,
        })}
      >
        <Calendar
          onChange={(e: any | Date) => {
            helpers.setValue(format(new Date(e as Date), "MM/dd/yyyy"));
            setIsCalendarVisible(false);
          }}
          formatLongDate={(locale, date) =>
            format(new Date(date), "MM/dd/yyyy")
          }
          minDate={minDate}
          value={
            field.value &&
            field.value !== "Invalid date" &&
            isValid(parse(field.value, "MM/dd/yyyy", new Date()))
              ? (parse(field.value, "MM/dd/yyyy", new Date()) as Date)
              : new Date()
          }
        />
      </div>
    </div>
  );
};
