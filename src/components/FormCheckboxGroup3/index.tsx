import React from "react";
import { useField, FieldHookConfig } from "formik";
import styled from "styled-components";
import { Checkbox, User } from "components";
import "./index.scss";

type Props = FieldHookConfig<number[]> & {
  values: {
    id: number; 
    first_name: string; 
    last_name: string; 
    avatar: string;
  }[];
};

export const FormCheckboxGroup3: React.FC<Props> = ({ values, ...props }) => {
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
        {values?.length && 
         values.map(
          ({id, first_name, last_name, avatar}) => (
            <Checkbox
              key={id}
              className="mr-2 mb-2 checkbox3"
              value={field.value?.includes(id)}
              onChange={() => handleChange(id)}
            >
              <User
                avatar={avatar}
                size="small"
                className="my-auto mr-1"
              />
              <div>{first_name} {last_name}</div>
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
