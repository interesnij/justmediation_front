import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import "./style.scss";
type Props = FieldHookConfig<string> & {
  value?: string;
  onChange?(value: string): void;
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  fluidHeight?: boolean;
};
export const FormTextarea: React.FC<Props> = ({
  label,
  className,
  help,
  placeholder,
  isRequired,
  fluidHeight = false,
  onChange = () => {},
  ...props
}: Props) => {
  const [field, meta, helpers] = useField(props);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    helpers.setValue(event.target.value);
  };
  return (
    <div
      className={classNames(
        "textarea-form-control d-flex flex-column",
        className,
        {
          error: meta.touched && meta.error,
          "h-100": fluidHeight,
        }
      )}
    >
      <div className="d-flex justify-content-between">
        <div className="textarea-form-control__label">{label}</div>
        {!isRequired && (
          <div className="textarea-form-control__required">Optional</div>
        )}
      </div>
      <textarea
        value={field.value}
        onChange={handleChange}
        placeholder={placeholder}
        className={classNames({ active: field.value, "flex-1": fluidHeight })}
      />
      {help && <div className="textarea-form-control__help">{help}</div>}

      <div className="textarea-form-control__footer">
        {meta.touched && meta.error && (
          <div className="textarea-form-control__validation">{meta.error}</div>
        )}
        {help && (
          <div className="textarea-form-control__help ml-auto">{help}</div>
        )}
      </div>
    </div>
  );
};
