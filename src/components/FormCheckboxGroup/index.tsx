import React from "react";
import { useField, FieldHookConfig } from "formik";
import styled from "styled-components";
import { Checkbox } from "components";

type Props = FieldHookConfig<number[]> & {
  values: { id: number; title: string }[];
};

export const FormCheckboxGroup: React.FC<Props> = ({ values, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (id: number) => {
    if (field.value.includes(id)) {
      helpers.setValue(field.value.filter((d) => d !== id));
    } else {
      helpers.setValue([...field.value, id]);
    }
  };

  return ( 
    <>
      <div className="text-dark">Select practice areas you want to follow:</div>
      <div className="row">
        
        {values.map(({ id, title }) => (
          <>
          {(() => { 
            if (id != 46) {
              return (
                <Checkbox
                  className="col-md-6 my-1"
                  key={id}
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
      <div className="row">
        <div className="col-md-6"></div>
        <Checkbox
          className="col-md-6"
          key={46}
          value={field.value?.includes(46)}
            onChange={() => handleChange(46)}
          >
          Other
        </Checkbox>
      </div>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </>
  );
};

const Error = styled.div`
  color: #cc4b39;
  font-size: 14px;
`;
