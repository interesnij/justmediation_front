import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import "./style.scss";

type Props = FieldHookConfig<string> & {
  label?: string;
  type?: "text" | "password" | "email";
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
};

export const FormAppTimePicker: React.FC<Props> = ({
  label,
  className,
  help,
  type = "text",
  placeholder = "",
  isRequired,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div
      className={classNames(
        "form-app-time-picker-control",
        {
          error: meta.touched && meta.error,
        },
        className
      )}
    >
      <div className="d-flex justify-content-between">
        <label htmlFor={props.name} className="form-app-time-picker-control__label">
          {label}
        </label>
        {!isRequired && (
          <div className="form-app-time-picker-control__required">Optional</div>
        )}
      </div>
      <div className="position-relative">
        <div
          className="form-app-time-picker-control__calendar"
        >
          <TimePicker
            format="h:mm A"
            className="form-app-time-picker"
            placement="bottomLeft"
            popupClassName="form-app-time-picker-popup"
            onChange={(values) => helpers.setValue(moment(values).format())}
            value={field.value ? moment(field.value) : moment()}
            showSecond={false}
            use12Hours
          />
        </div>
      </div>
      <div className="input-control__footer">
        {meta.touched && meta.error && isRequired && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>

    </div>
  );
};
