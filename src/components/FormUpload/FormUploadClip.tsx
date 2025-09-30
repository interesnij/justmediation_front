import React, {useCallback} from "react";
import {useField, FieldHookConfig} from "formik";
import {useDropzone} from "react-dropzone";
import "./style.scss";
import {FaPaperclip} from "react-icons/fa";

type Props = FieldHookConfig<any[]> & {
  label?: string;
  buttonLabel?: string;
  isRequired?: boolean;
  text?: string;
  className?: string;
  maxFileSize?: number;
  acceptFileTypes?: string[];
};

export const FormUploadClip: React.FC<Props> = ({
                                                  className,
                                                  label = "",
                                                  isRequired,
                                                  text = "",
                                                  buttonLabel = "",
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
    getInputProps,
    open,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    accept: acceptFileTypes.length > 0 ? acceptFileTypes.join(",") : undefined,
  });


  return (
    <div onClick={open}>
      <input {...getInputProps()} />
       <FaPaperclip />
      {meta.touched && meta.error && (
        <div className="profile-photo-control__validation">{meta.error}</div>
      )}
    </div>
  );
};
