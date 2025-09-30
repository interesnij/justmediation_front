import React, {useCallback, useState} from "react";
import {Button, User} from "components";
import classNames from "classnames";
import {useField, FieldHookConfig} from "formik";
import {useDropzone} from "react-dropzone";
import "./style.scss";

type Props = FieldHookConfig<any> & {
  label?: string;
  buttonLabel?: string;
  isRequired?: boolean;
  text?: string;
  className?: string;
  maxFileSize?: number;
  onChangeCallback?: (file: any) => void;
  removeButton?: string;
  onRemoveCallback?: () => void,
};
export const FormProfilePhoto: React.FC<Props> = ({
                                                    className,
                                                    label = "Attachment",
                                                    isRequired = true,
                                                    buttonLabel = "",
                                                    removeButton = "Remove",
                                                    maxFileSize = 5 * 1024 * 1024, // 5MB
                                                    onChangeCallback = () => {
                                                    },
                                                    onRemoveCallback = () => {},
                                                    ...props
                                                  }: Props) => {
  const [field, meta, helpers] = useField(props);
  const [isErrorSize, setIsErrorSize] = useState<string>("");
  let buttonLabelDefault = buttonLabel || (field.value ? "Update Photo" : "Add Photo")
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles[0].size > maxFileSize) {
        helpers.setError("The file is too large. Allowed maximum size is 5 MiB.")
        setIsErrorSize('The file is too large. Allowed maximum size is 5 MiB.')
        return;
      }
      setIsErrorSize("")
      helpers.setValue(acceptedFiles[0]);
      onChangeCallback(acceptedFiles[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [helpers, maxFileSize]
  );

  const {getRootProps, getInputProps, open} = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: "image/jpeg, image/png",
    multiple: false,
    onDrop,
  });
  return (
    <div className={classNames("profile-photo-control", className)}>
      <div className="d-flex">
        <div {...getRootProps({className: "dropzone"})}>
          <div className="d-flex flex-wrap"/>
          <input {...getInputProps()} />
          <User
            size="large"
            avatar={
              field.value
                ? typeof field.value === "string"
                  ? field.value
                  : URL.createObjectURL(field.value)
                : ""
            }
          />
        </div>
        <Button buttonType="button" className="my-auto ml-4" onClick={open}>
          {buttonLabelDefault}
        </Button>
        <Button
            disabled={isRequired || !Boolean(field.value)}
            buttonType="button"
            type="outline"
            className="my-auto ml-4"
            onClick={() => {
              helpers.setValue("");
              onRemoveCallback();
            }}>
          {removeButton}
        </Button>

      </div>
      {((meta.touched && meta.error) || isErrorSize) && (
        <div className="profile-photo-control__validation">{meta.error || isErrorSize}</div>
      )}
    </div>
  );
};
