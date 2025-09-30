import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import "./style.scss";
type Props = FieldHookConfig<boolean> & {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};
export const FormCheckbox: React.FC<Props> = ({
  className,
  children,
  disabled = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.checked);
  };
  return (
    <div className={classNames(className)}>
      <label className="checkbox-control">
        {children}
        <input
          type="checkbox"
          checked={field.value}
          onChange={handleChange}
          disabled={disabled}
        />
        <span/>
      </label>
      {meta.touched && meta.error && (
        <div className="checkbox-control__validation">{meta.error}</div>
      )}
    </div>
  );
};
