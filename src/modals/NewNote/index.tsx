import React, { useState } from "react";
import {
  Modal,
  Button,
  FormInput,
  FormTextarea,
  FormUpload,
  FormSelect,
  FormContactSelect,
} from "components";
import { Formik, Form } from "formik";
import {
  createMatterNote,
  updateMatterNote,
  uploadFiles,
  getLeadClients,
  getMatters,
} from "api";
import { useCommonUIContext, useAuthContext } from "contexts";
import { useQuery } from "react-query";
import * as Yup from "yup";
import { acceptFileTypes } from "helpers";
import "./style.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  text: Yup.string().required("Note is required"),
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
  data?: any;
}

export const NewNoteModal = ({
  open,
  setOpen,
  data,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();
  const { userId, userType, profile } = useAuthContext();
  const [innerClient, setInnerClient] = useState("");

  const { isLoading: isClientsLoading, data: clientsData } = useQuery<
    { results: any[]; count: number },
    Error
  >(["leads_clients"], () => getLeadClients(userId, userType, profile.role), {
    keepPreviousData: true,
    enabled: open,
  });

  const {
    isLoading: isMattersLoading,
    data: matterData,
    isFetching: isMattersFetching,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["matters-all", innerClient],
      () => getMatters({
        client: innerClient,
      }),
    {
      keepPreviousData: true,
      enabled: !!innerClient,
    }
  );

  return (
    <Modal
      title={data ? "Edit a Note" : "Create a Note"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        <Formik
          initialValues={
            data || {
              title: "",
              text: "",
              matter: "",
              client: "",
              attachments: [],
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const attachments = await uploadFiles(
                values.attachments || [],
                "mediator_registration_attachments",
                0
              );
              if (data) {
                await updateMatterNote({ ...values, attachments });
              } else {
                await createMatterNote({ ...values, attachments });
              }
              onCreate();
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting, values, setFieldValue }) => {
            reset = resetForm;
            setTimeout(() => setInnerClient(values.client), 0);
            return (
              <Form>
                <FormContactSelect
                  name="client"
                  label="Client"
                  placeholder="Select a client"
                  values={clientsData?.results || []}
                  isLoading={isClientsLoading}
                  isRequired
                />
                <FormSelect
                  name="matter"
                  label="Matter"
                  placeholder="Select a Matter"
                  isLoading={isMattersLoading || isMattersFetching}
                  values={matterData?.results || []}
                  className="mt-1"
                  isRequired
                />
                <FormInput
                  name="title"
                  label="Title"
                  className="mt-1"
                  placeholder="Title of note"
                  isRequired
                />
                <FormTextarea
                  name="text"
                  label="Note"
                  placeholder="Type your note here"
                  className="mt-1"
                  isRequired
                />
                <FormUpload
                  name="attachments"
                  className="mt-1"
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
                    isLoading={isSubmitting}
                    buttonType="submit"
                    size="large"
                  >
                    Save Note
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
