import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  FormInput,
  FormContactSelect,
  FormContactMultiSelect,
  FormSelect,
} from "components";
import { Formik, Form } from "formik";
import {
  createNewFolder,
  getLeadClients,
  getMediatorsAndParalegals,
  getMatters,
} from "api";
import { useCommonUIContext, useAuthContext } from "contexts";
import * as Yup from "yup";
import { useQuery } from "react-query";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Folder name is required"),
  client: Yup.string().required("Client is required"),
  matter: Yup.string().required("Matter is required"),
  // shared_with: Yup.array().min(1, "Please select shared people."),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  matter?: string;
  parent?: number;
  client?: number;
  sharedWith?: number[];
  onCreate?(): void;
  isForClient?: boolean;
  isVault?: boolean;
}
export const NewDocumentFolderModal = ({
  open,
  setOpen,
  matter = "",
  parent,
  client,
  sharedWith = [],
  onCreate = () => {},
  isForClient = false,
  isVault = false,
}: Props) => {
  let reset = () => {};
  let setFormValue = (field, value) => {};
  const { showErrorModal } = useCommonUIContext();
  const { userId, userType, profile } = useAuthContext();
  const [innerClient, setInnerClient] = useState(client);
  const [innerMatter, setInnerMatter] = useState(matter);
  const [shareData, setShareData] = useState<any[]>(sharedWith);

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
      enabled: !!innerClient,
    }
  );

  const { isLoading: isSharesLoading, data: mediatorData } = useQuery<
    any[],
    Error
  >(["mediators_paralegals"], () => getMediatorsAndParalegals({}), {
    keepPreviousData: true,
    enabled: open,
  });

  useEffect(() => {
    if (matterData) {
      setFormValue(
        "shared_with",
        matterData?.results?.find((a) => +a?.id === +innerMatter)?.shared_with
      );
      setShareData(
        matterData?.results?.find((a) => +a?.id === +innerMatter)
          ?.shared_with || []
      );
    }
    return () => {};
  }, [matterData, innerMatter]);

  useEffect(() => {
    const init = async () => {};
    init();
    return () => {};
  }, []);

  return (
    <Modal
      title="New folder (My documents)"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        <Formik
          initialValues={{
            title: "",
            client: client,
            matter: matter,
            shared_with: sharedWith,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await createNewFolder({
                ...values,
                parent,
                is_vault: isVault,
              });
              setOpen(false);
              onCreate();
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting, values, setFieldValue }) => {
            reset = resetForm;
            setInnerClient(values.client);
            setInnerMatter(values.matter);
            setFormValue = setFieldValue;
            return (
              <Form>
                <FormInput
                  name="title"
                  label="Folder name"
                  placeholder="Untitled folder"
                  isRequired
                />
                <div className="text-gray mt-2">Tag to</div>
                {!isForClient && (
                  <FormContactSelect
                    name="client"
                    isRequired
                    label="Client"
                    values={clientsData?.results || []}
                    isLoading={isClientsLoading}
                    disabled={!!client}
                  />
                )}
                <FormSelect
                  name="matter"
                  isRequired
                  className="mt-1"
                  label="Matter"
                  isLoading={isMattersLoading || isMattersFetching}
                  values={matterData?.results || []}
                  disabled={!!matter}
                />

                <FormContactMultiSelect
                  values={(mediatorData || []).filter(
                    (item) =>
                      +item?.id !== +userId && shareData.includes(item?.id)
                  )}
                  isRequired
                  className="mt-2"
                  placeholder="Add people"
                  name="shared_with"
                  showAvatar
                  label="Share with"
                  isLoading={isSharesLoading}
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
                    Create
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
