import React from "react";
import { useField, FieldHookConfig } from "formik";
import styled from "styled-components";
import { Checkbox } from "components";

type Props = FieldHookConfig<number[]> & {
  values: { id: number; title: string }[];
};

export const FormCheckboxGroup2: React.FC<Props> = ({ values, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (id: number) => {
    if (field.value?.includes(id)) {
      helpers.setValue(field.value.filter((d) => d !== id));
    } else {
      helpers.setValue([...field.value, id]);
    }
  };

  return (
    <>
      <div className="d-flex">
        {values.map(({ id, title }) => (
          <>
          {(() => { 
            if (id != 46) {
              return (
          <Checkbox
            key={id}
            className="mr-2"
            value={field.value?.includes(id)}
            onChange={() => handleChange(id)}
          >
            {title}
          </Checkbox>
          )
        } 
      })()}
      </>
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
