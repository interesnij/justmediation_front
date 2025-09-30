import React, { useCallback, useState } from "react";
import { Button, User } from "components";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import "./style.scss";

interface Props {
  label?: string;
  buttonLabel?: string;
  isRequired?: boolean;
  className?: string;
  defaultValue?: any;
};
export const FirmLogo: React.FC<Props> = ({
  className,
  label = "Attachment",
  isRequired,
  buttonLabel = "Add Photo",
  defaultValue = "",
  ...props
}: Props) => {
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const [value, setValue] = useState(defaultValue);
  const [isErrorSize, setIsErrorSize] = useState<string>("");

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: "image/jpeg, image/png",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if(acceptedFiles[0].size > maxFileSize) {
        setIsErrorSize('The file is too large. Allowed maximum size is 5 MiB.')
        return;
      }
      if (acceptedFiles[0].size < maxFileSize) {
        setIsErrorSize("")
       setValue(acceptedFiles[0]);
     }
   },
  });
  return (
    <div className={classNames("profile-photo-control", className)}>
      <div className="d-flex">
        <div {...getRootProps({ className: "dropzone" })}>
          <div className="d-flex flex-wrap"/>
          <input {...getInputProps()} />
          <User
            size="large"
            avatar={
              value
                ? typeof value === "string"
                  ? value
                  : URL.createObjectURL(value)
                : ""
            }
          />
        </div>
        <Button buttonType="button" className="my-auto ml-4" onClick={open}>
          Upload Photo
        </Button>
        {!!defaultValue && (
          <Button buttonType="button" className="my-auto ml-4" onClick={()=> {}}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
