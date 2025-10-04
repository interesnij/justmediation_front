import React from "react";
import {
  Modal,
  Button,
  FormInput,
  FormTextarea,
  FormUpload,
  FormContactMultiSelect,
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {createMatterTopic, createMatterPost, uploadFiles} from "api";
import { useCommonUIContext,useAuthContext } from "contexts";
import { getUserName, acceptFileTypes } from "helpers";
import "./style.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Subject is required"),
  text: Yup.string().required("Message is required"),
  participants: Yup.array(),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  matter?: number;
  data?: any;
  onCreate?(): void;
  participants?: any[];
}
export const NewMessageModal = ({
  open,
  setOpen,
  matter,
  data,
  onCreate = () => {},
}: Props) => {
  const {userId} = useAuthContext()
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();

  return (
    <Modal
      title="New Message"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        <Formik
          initialValues={{
            participants: [],
            title: "",
            text: "",
            attachments: [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              let attachmentsResponse = await uploadFiles(
                values.attachments, 
                "documents", 
                0 // непонятно
              );

              let res = await createMatterTopic({
                title: values.title,
                matter,
                participants: values.participants,
              });

              await createMatterPost({
                post: res.data.id,
                text: values.text,
                participants: values.participants,
                attachments: attachmentsResponse
                //attachments: []  // ошибка
              });
              onCreate();
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
                <FormContactMultiSelect
                  values={data
                  ? [
                      ...data?.shared_with_data.map((a) => ({
                        ...a,
                        name: getUserName(a),
                        type: a.user_type,
                      })),
                      {
                        ...data?.client_data,
                        name: getUserName(data?.client_data),
                        type: "Client",
                      },
                      {
                        ...data?.mediator_data,
                        name: getUserName(data?.mediator_data),
                        type: "Mediator",
                      },
                    ].filter(a=>+a?.id !== +userId)
                  : []}
                  isRequired
                  placeholder="Search or select user"
                  name="participants"
                  label="Participants"
                  showAvatar
                />
                <FormInput
                  name="title"
                  label="Subject"
                  className="mt-2"
                  placeholder="Subject title"
                  isRequired
                />
                <FormTextarea
                  name="text"
                  label="Message"
                  placeholder="Type your message here"
                  className="mt-2"
                  isRequired
                />
                <FormUpload
                  name="attachments"
                  label="Attachment"
                  className="mt-2"
                  buttonLabel="Choose file"
                  acceptFileTypes={acceptFileTypes}
                />

                <div className="d-flex mt-2">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    buttonType="submit"
                    isLoading={isSubmitting}
                    size="large"
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
