import React, {FC, useState} from "react";
import {Form, Formik} from "formik";
import {createMatterPost, uploadFiles} from "api";
import {FormTextarea} from "../FormTextarea";
import {FaReply} from "react-icons/fa";
import {FormUploadClip} from "../FormUpload/FormUploadClip";
import {acceptFileTypes} from "helpers";
import {Button} from "../Button";
import DocumentIcon from "assets/icons/document.svg";
import filesize from "filesize";
import CloseIcon from "assets/icons/close.svg";
import * as Yup from "yup";
import {useParams} from "@reach/router";

interface IAttachmentForm {
  name: string;
  file_size?: string;
  size?: number
}

interface IProps {
  participants: number[];
  refetchMessages: () => void;
  message: any;
  setParticipants: (arg: number[]) => void;
  setShowMessageEditor: (arg: boolean) => void;
  participantsReplyName: string;
  handleCancel: () => void;
}

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Message is required"),
  participants: Yup.array(),
  attachments: Yup.array(),
});

export const MessageEditorForm: FC<IProps> = ({
    participants,
    refetchMessages,
    message,
    setParticipants,
    setShowMessageEditor,
    participantsReplyName,
    handleCancel
                                              }) => {
  const params = useParams();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const replyToAll: boolean = participants.length === 0;

  return (
    <Formik
      initialValues={{
        participants: [],
        text: "",
        attachments: []
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setIsReplying(true);
        try {
          let attachmentsResponse = await uploadFiles(values.attachments, "documents", params.id);
          await createMatterPost({
            post: params.id,
            text: values.text,
            participants,
            //attachments: [] // ошибка
            attachments: attachmentsResponse
          });
          await refetchMessages();
          message.onChange("");
          setParticipants([])
          setShowMessageEditor(false);
        } catch (error) {
          console.warn(error)
        } finally {
          setIsReplying(false);
        }
      }}
    >
      {({values: { attachments }, setFieldValue}) => {
        const removeFile = (index: number) => {
          let newFiles = [...attachments].filter((key, attachmentIndex) => index !== attachmentIndex);
          setFieldValue("attachments", newFiles);
        };
        return (
          <>
            <Form className="d-flex mt-2 position-relative">
              <div className="message-editor-wrapper">
                <FormTextarea className="message-editor" name="text"/>

                <div className="message-editor-header">
                  <div className="message-icon">
                    <FaReply/>
                  </div>
                  <div className="message-subject-info">{replyToAll ? 'Reply All' : 'Reply'}</div>
                  <div className="message-separator--vertical"/>
                  <div
                    className="message-editor-subject">{participantsReplyName ? `to ${participantsReplyName}` : ''}</div>
                </div>

                <div className="message-editor-footer">
                  <div className="message-editor-footer__icon">
                    <FormUploadClip
                      name="attachments"
                      label="Attachment"
                      className="mt-2"
                      buttonLabel="Choose file"
                      acceptFileTypes={acceptFileTypes}
                    />
                  </div>
                  <div className="message-button-group">
                    <Button theme="white" onClick={handleCancel}>Cancel</Button>
                    <Button
                      buttonType="submit"
                      isLoading={isReplying}
                      className="ml-2"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
            {attachments?.length > 0 &&
              <>
                <div className="mt-4 mb-1 text-black text-bold">Attachments</div>
                <div className=" d-flex flex-wrap">
                  {attachments.map((file: IAttachmentForm, index: number) => (
                    <div className="upload-control__file" key={`${index}key`}>
                      <img
                        src={DocumentIcon}
                        className="my-auto upload-control__img"
                        alt="file"
                      />
                      <span
                        className="ml-1 my-auto text-ellipsis"
                        style={{width: 200}}
                      >
                                {file?.name || ""}
                              </span>
                      <span className="ml-1 my-auto">
                                {file?.file_size ? `(${file?.file_size})` : `(${filesize(file?.size || 0)})`}
                              </span>
                      <img
                        src={CloseIcon}
                        className="my-auto upload-control__close ml-2"
                        alt="close"
                        onClick={() => removeFile(index)}
                      />
                    </div>
                  ))}
                </div>
              </>
            }
          </>
        )
      }}
    </Formik>
  )
}