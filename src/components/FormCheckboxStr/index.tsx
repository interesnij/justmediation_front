import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";

type Props = FieldHookConfig<string> & {
  className?: string;
  children?: React.ReactNode;
  values: string[];
};

export const FormCheckboxStr: React.FC<Props> = ({
  className,
  children,
  values,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.checked ? values[1] : values[0]);
  };
  return (
    <div className={classNames(className)}>
      <label className="checkbox-control">
        {children}
        <input
          type="checkbox"
          checked={field.value === values[1]}
          onChange={handleChange}
        />
        <span></span>
      </label>
      {meta.touched && meta.error && (
        <div className="checkbox-control__validation">{meta.error}</div>
      )}
    </div>
  );
};
