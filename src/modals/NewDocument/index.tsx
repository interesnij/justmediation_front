import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  FormUpload,
  FormContactSelect,
  FormSelect,
} from "components";
import { Formik, Form } from "formik";
import { ChooseDestination } from "./ChooseDestination";
import * as Yup from "yup";
import { useQuery } from "react-query";
import { getLeadClients, getMatters } from "api";
import { useAuthContext } from "contexts";
import { acceptFileTypes } from "helpers";
import "./style.scss";

const validationFullSchema = Yup.object().shape({
  files: Yup.array().min(1, "Please upload files"),
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
});
const validationFileSchema = Yup.object().shape({
  files: Yup.array().min(1, "Please upload files"),
});
const titles = ["New Upload", "Upload to..."];
const templateTitles = ["New Template Upload", "Upload to..."];
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  isTemplate?: boolean;
  matter?: number | undefined;
  client?: number | undefined;
  onCreate?(): void;
  isVault?: boolean;
  isForClient?: boolean;
}

export const NewDocumentModal = ({
  open,
  setOpen,
  isTemplate = false,
  matter,
  client,
  onCreate = () => {},
  isVault,
  isForClient = false,
}: Props) => {
  let reset = () => {};
  const { userId, userType, profile } = useAuthContext();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [innerClient, setInnerClient] = useState(client);
  const [innerMatter, setInnerMatter] = useState(matter);

  useEffect(() => {
    if (open) {
      setStep(0);
    }
    return () => {};
  }, [open]);

  const { isLoading: isClientsLoading, data: clientsData } = useQuery<
    { results: any[]; count: number },
    Error
  >(["leads_clients"], () => getLeadClients(userId, userType, profile.role), {
    keepPreviousData: true,
    enabled: open && !isForClient,
  });

  const {
    isLoading: isMattersLoading,
    data: matterData,
    isFetching: isMattersFetching,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["matters-all", innerClient],
    () =>
    getMatters({
      client: innerClient,
    }),
    {
      keepPreviousData: true,
      enabled: !!innerClient && open,
    }
  );

  return (
    <Modal
      title={ isTemplate? templateTitles[step] : titles[step] }
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        {step === 0 ? (
          <Formik
            initialValues={{
              files: [],
              matter,
              client,
            }}
            validationSchema={(isVault || isTemplate) ? validationFileSchema : validationFullSchema}
            onSubmit={async (values) => {
              setFiles(values.files);
              setInnerClient(values.client);
              setInnerMatter(values.matter);
              setStep(1);
            }}
          >
            {({ resetForm, errors, values }) => {
              reset = resetForm;
              setInnerClient(values.client);
              return (
                <Form>
                  {!isForClient && !isVault && !isTemplate && (
                    <FormContactSelect
                      name="client"
                      isRequired
                      label="Client"
                      values={clientsData?.results || []}
                      isLoading={isClientsLoading}
                      disabled={!!client}
                    />
                  )}
                  {!isVault && !isTemplate && (
                    <FormSelect
                      name="matter"
                      isRequired
                      className="mt-1"
                      label="Matter"
                      isLoading={isMattersLoading || isMattersFetching}
                      values={matterData?.results || []}
                      disabled={!!matter}
                    />
                  )}
                  <FormUpload
                    className="mt-3"
                    name="files"
                    label=""
                    buttonLabel="Choose file"
                    isRequired
                    acceptFileTypes={acceptFileTypes}
                  />

                  <div className="d-flex mt-3">
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
                      disabled={Object.keys(errors).length > 0}
                      buttonType="submit"
                      size="large"
                    >
                      Upload File
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <ChooseDestination
            files={files}
            onClose={() => setOpen(false)}
            onCreate={() => {
              onCreate();
              setOpen(false);
            }}
            isTemplate={isTemplate}
            matter={innerMatter}
            client={innerClient}
            isVault={isVault}
          />
        )}
      </div>
    </Modal>
  );
};
