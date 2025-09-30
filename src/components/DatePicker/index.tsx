import React, { useState } from "react";
import classNames from "classnames";
import Calendar from "react-calendar";
import { format, parse, isValid } from "date-fns";
import useOnclickOutside from "react-cool-onclickoutside";
import "react-calendar/dist/Calendar.css";
import CalendarIcon from "assets/icons/calendar_gray.svg";
import CalendarActiveIcon from "assets/icons/calendar.svg";
import "./style.scss";
interface Props {
  value?: string;
  type?: "text" | "password" | "email";
  className?: string;
  placeholder?: string;
  onChange?(param: string): void;
}

export const DatePicker = ({
  value,
  className,
  type = "text",
  onChange = () => {},
  placeholder,
}: Props) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const ref = useOnclickOutside(() => {
    setIsCalendarVisible(false);
  });

  const handleChange = (param: React.ChangeEvent<HTMLInputElement>) => {
    onChange(param.target.value);
  };

  return (
    <div className={classNames("date-picker-control", className)} ref={ref}>
      <input
        className="date-picker-control__input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        value={value}
        placeholder={placeholder}
        type={type}
        onFocus={() => setIsCalendarVisible(true)}
      />

      {isCalendarVisible ? (
        <img
          src={CalendarActiveIcon}
          className="date-picker-control__icon"
          alt="calendar"

        />
      ) : (
        <img
          src={CalendarIcon}
          className="date-picker-control__icon"
          alt="calendar"
          onClick={() => setIsCalendarVisible(true)}
        />
      )}
      <div
        className={classNames("date-picker-control__calendar", {
          visible: isCalendarVisible,
        })}
      >
        <Calendar
          onChange={(e) => {
            onChange(format(new Date(e as Date), "MM/dd/yyyy"));
            setIsCalendarVisible(false);
          }}
          formatLongDate={(locale, date) =>
            format(new Date(date), "MM/dd/yyyy")
          }
          value={
            value &&
            value !== "Invalid date" &&
            isValid(parse(value, "MM/dd/yyyy", new Date()))
              ? (parse(value, "MM/dd/yyyy", new Date()) as Date)
              : new Date()
          }
          // activeStartDate={
          //   value &&
          //   value !== "Invalid date" &&
          //   isValid(parse(value, "MM/dd/yyyy", new Date()))
          //     ? (parse(value, "MM/dd/yyyy", new Date()) as Date)
          //     : new Date()
          // }
        />
      </div>
    </div>
  );
};
