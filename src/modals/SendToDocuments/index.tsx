import React, { useState } from "react";
import {
  Modal,
  DocumentNav,
  Button,
  FolderTree,
  RiseLoader,
  FormContactSelect,
  FormSelect,
} from "components";
import { useQuery } from "react-query";
import { getDocuments, createDocument } from "api";
import { useCommonUIContext, useAuthContext } from "contexts";
import { getLeadClients, getMatters } from "api";
import styled from "styled-components";
import { useInput } from "hooks";
import { last, isEqual } from "lodash";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  isTemplate?: boolean;
  matter?: number;
  client?: number;
  onCreate?(): void;
  isVault?: boolean;
  file: {
    name: string;
    url: string;
  };
}

const validationSchema = Yup.object().shape({
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
});

export const SendToDocumentsModal = ({
  open,
  setOpen,
  isTemplate = false,
  matter,
  client,
  onCreate = () => {},
  isVault,
  file,
}: Props) => {
  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: "My Documents",
    },
  ]);
  const { showErrorModal } = useCommonUIContext();
  const { userId, userType, profile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedFolder = useInput({});
  const [innerClient, setInnerClient] = useState(client);
  const [innerMatter, setInnerMatter] = useState(matter);
  //console.log(file.url);
  console.log(file.url.split("/")[-1]);

  const { data: folderData, isLoading: isFolderLoading } = useQuery<
    { results: any[]; overall_total: number },
    Error
  >(
    ["new-file-documents", last(folders).id, innerMatter, innerClient],
    () =>
      getDocuments({
        pageSize: 1000,
        parent: last(folders)?.id,
        isTemplate,
        matter: innerMatter ? +innerMatter : undefined,
        client: innerClient ? +innerClient : undefined,
        is_vault: isVault,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { isLoading: isClientsLoading, data: clientsData } = useQuery<
    { results: any[]; count: number },
    Error
  >(["leads_clients"], () => getLeadClients(userId, userType, profile.role), {
    keepPreviousData: true,
    enabled: open && userType !== "client",
  });

  const {
    isLoading: isMattersLoading,
    data: matterData,
    isFetching: isMattersFetching,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["matters-send-doc-all", innerClient],
    () =>
      getMatters({
      client: innerClient,
    }),
    {
      keepPreviousData: true,
      enabled: open,
    }
  );

  const handleUpload = async () => {};
  const name_items: string[] = file.url.split("/");
  const filename: string = name_items[name_items.length-1];
  return (
    <Modal
      title="Send to Documents"
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-message-modal" onClick={(e) => e.stopPropagation()}>
        <Container>
          {isUploading ? (
            <div className="my-auto text-center">
              Uploading to the Blockchain...
              <RiseLoader className="mt-4" />
            </div>
          ) : isLoading ? (
            <RiseLoader className="my-auto" />
          ) : (
            <Formik
              initialValues={{
                matter,
                client: innerClient,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                setIsUploading(true);
                try { 
                  await createDocument({
                    parent: (selectedFolder.value?.id as number) || null,
                    matter: values.matter ? +values.matter : undefined,
                    client: values.client ? +values.client : undefined,
                    file: file.url,
                    title: filename,
                    is_template: false,
                    is_vault: false,
                  });
                  setIsUploading(false);
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    onCreate();
                  }, 5000);
                } catch (error: any) {
                  showErrorModal("Error", error);
                  setIsUploading(false);
                }
              }}
            >
              {({ resetForm, errors, values, initialValues }) => {
                setInnerClient(values.client ? +values.client : undefined);
                setInnerMatter(values.matter ? +values.matter : undefined);
                const hasChanged = isEqual(values, initialValues);
                const hasErrors = Object.keys(errors).length > 0;
                return (
                  <Form>
                    {userType !== "client" && (
                      <FormContactSelect
                        name="client"
                        isRequired
                        label="Client"
                        values={clientsData?.results || []}
                        isLoading={isClientsLoading}
                      />
                    )}

                    <FormSelect
                      name="matter"
                      isRequired
                      className="mt-1"
                      label="Matter"
                      isLoading={isMattersLoading || isMattersFetching}
                      values={matterData?.results || []}
                    />

                    {
                      innerMatter && innerClient ?
                      <>
                        <DocumentNav
                          className="mt-2"
                          folders={folders}
                          onClick={(e) => setFolders(e)}
                        />
                        <FolderTree
                          className="mt-2"
                          data={folderData?.results}
                          isLoading={isFolderLoading}
                          onFolderClick={(e) => setFolders([...folders, e])}
                          {...selectedFolder}
                        />
                      </>
                      :
                      <div className="blank">
                      </div>
                    }
                    <div className="d-flex mt-3">
                      <Button
                        buttonType="button"
                        className="ml-auto"
                        theme="white"
                        size="large"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="ml-3"
                        buttonType="submit"
                        size="large"
                        isLoading={isLoading}
                        onClick={() => handleUpload()}
                        disabled={hasChanged || hasErrors}
                      >
                        Upload
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Container>
      </div>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;
