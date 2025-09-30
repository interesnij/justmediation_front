import React, { useCallback, useMemo } from "react";
import { Button } from "components";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import CloseIcon from "assets/icons/close.svg";
import DocumentIcon from "assets/icons/document.svg";
import { useDropzone } from "react-dropzone";
import FileOpenIcon from "assets/icons/file_open.svg";
import filesize from "filesize";
import "./style.scss";

type Props = FieldHookConfig<any[]> & {
  label?: string;
  buttonLabel?: string;
  isRequired?: boolean;
  text?: string;
  className?: string;
  maxFileSize?: number;
  acceptFileTypes?: string[];
};
const baseStyle = {
  border: "1px solid #E0E0E1",
};

const activeStyle = {
  borderColor: "rgba(0,0,0,.6)",
};

const acceptStyle = {
  borderColor: "rgba(0,0,0,.6)",
};

const rejectStyle = {
  borderColor: "#CC4B39",
};

export const FormUpload: React.FC<Props> = ({
  className,
  label = "Attachment",
  isRequired,
  text = "Drag and drop your files here or",
  buttonLabel = "Select from documents",
  acceptFileTypes = [],
  maxFileSize = 20 * 1024 * 1024, // 20MB
  ...props
}: Props) => {
  const [field, meta, helpers] = useField(props);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.filter(
        (file: File) => file.size < maxFileSize
      );
      helpers.setValue(field.value ? [...field.value, ...files] : [...files]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [helpers, field.value]
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    accept: acceptFileTypes.length > 0 ? acceptFileTypes.join(",") : undefined,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const removeFile = (file) => {
    let newFiles = [...field.value];
    newFiles.splice(newFiles.indexOf(file), 1);
    helpers.setValue(newFiles);
  };

  // console.log(field)

  return (
    <div
      className={classNames("upload-control", className, {
        error: meta.touched && meta.error,
      })}
    >
      <div className="d-flex justify-content-between">
        <label htmlFor={props.name} className="upload-control__label">
          {label}
        </label>
        {!isRequired && (
          <div className="upload-control__required">Optional</div>
        )}
      </div>
      <div {...getRootProps({ className: "dropzone", style })}>
        <div className="d-flex flex-wrap">
          {field.value &&
            field.value.map((file, index) => (
              <div className="upload-control__file" key={`${index}key`}>
                <img
                  src={DocumentIcon}
                  className="my-auto upload-control__img"
                  alt="file"
                />
                <span
                  className="ml-1 my-auto text-ellipsis"
                  style={{ width: 200 }}
                >
                  {file?.file_name ? `${file?.file_name}` : `${file?.name}`}
                </span>
                <span className="ml-1 my-auto">
                  {file?.file_size
                    ? `(${file?.file_size})`
                    : `(${filesize(file?.size || 0)})`}
                </span>
                <img
                  src={CloseIcon}
                  className="my-auto ml-1 upload-control__close"
                  alt="close"
                  onClick={() => removeFile(file)}
                />
              </div>
            ))}
        </div>
        <input {...getInputProps()} />
        <span className="mx-auto d-flex justify-content-center mt-4">
          <img src={FileOpenIcon} alt="file" />
        </span>
        <div className="mx-auto my-2 text-center">{text}</div>

        <Button type="outline" className="mx-auto mb-4" onClick={open}>
          {buttonLabel}
        </Button>
      </div>

      {meta.touched && meta.error && (
        <div className="profile-photo-control__validation">{meta.error}</div>
      )}
    </div>
  );
};
