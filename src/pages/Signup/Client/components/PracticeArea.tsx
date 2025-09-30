import React, { useEffect } from "react";
import { useField, FieldHookConfig } from "formik";
import styled from "styled-components";
import { Checkbox } from "components";

type Props = FieldHookConfig<{ id: number; specialty: string }[]> & {
  values: { id: number; title: string }[];
};

export const FormPractice: React.FC<Props> = ({ values, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (id: number, title: string) => {
    if (
      field.value.filter((d) => d.specialty.localeCompare(title) === 0).length >
      0
    ) {
      helpers.setValue(
        field.value.filter((d) => d.specialty.localeCompare(title) !== 0)
      );
    } else {
      helpers.setValue([...field.value, { id, specialty: title }]);
    }
  };
  useEffect(() => {
    console.log("practice value", field.value);
    return () => {};
  }, [field.value]);
  return (
    <>
      <div className="text-dark">Select practice areas you want to follow:</div>
      <div className="row">
        {values.map(({ id, title }) => (
          <Checkbox
            key={id}
            className="col-md-6 my-1"
            value={
              field.value.filter((d) => d.specialty.localeCompare(title) === 0)
                .length > 0
            }
            onChange={() => handleChange(id, title)}
          >
            {title}
          </Checkbox>
        ))}
      </div>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </>
  );
};

const Error = styled.div`
  color: #cc4b39;
  font-size: 14px;
`;
