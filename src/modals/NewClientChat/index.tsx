import React from "react";
import { Modal, Button, FormContactSelect, RiseLoader } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuthContext, useCommonUIContext } from "contexts";
import { createChat, getClientContacts } from "api";
import { useQuery } from "react-query";
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(param?: any): void;
}

const validationSchema = Yup.object().shape({
  opponent: Yup.number().required("Selection is required"),
});
export const NewClientChatModal = ({
  open,
  setOpen,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};
  const { userId } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const { isFetching: isContactsLoading, data: contactsData } = useQuery<
    any[],
    Error
  >(["all_client_contacts"], () => getClientContacts(userId, {}), {
    keepPreviousData: true,
    enabled: open,
  });

  return (
    <Modal
      title="New chat"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div style={{ width: 700 }}>
        <Formik
          initialValues={{
            opponent: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await createChat({
                participants: [values.opponent]
              });
              onCreate(`/client/chats/${res.id}`);
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ values, errors, isSubmitting, resetForm }) => {
            reset = resetForm;
            const hasErrors = Object.keys(errors).length > 0;
            return (
              <Form>
                {isContactsLoading ? (
                  <div className="m-auto d-flex">
                    <RiseLoader />
                  </div>
                ) : !!contactsData?.length ? (
                  <>
                    <FormContactSelect
                      values={contactsData.filter(
                        (item) => +item?.id !== +userId
                      )}
                      isRequired
                      className="col-12 mt-1"
                      placeholder="Select a person you want to chat with"
                      name="opponent"
                      showAvatar
                      isLoading={isContactsLoading}
                    />
                    <div className="d-flex mt-2">
                      <Button
                        buttonType="button"
                        className="ml-auto"
                        theme="white"
                        size="large"
                        onClick={() => {
                          setOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="ml-3"
                        isLoading={isSubmitting}
                        disabled={hasErrors}
                        buttonType="submit"
                        size="large"
                      >
                        Start Chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>Your contacts list is empty</div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
