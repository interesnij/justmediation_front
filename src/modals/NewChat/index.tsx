import React, { useEffect, useState } from "react";
import {
  Modal,
  InfoText,
  Button,
  FormContactMultiSelect,
  RiseLoader,
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuthContext, useCommonUIContext } from "contexts";
import { createChat, updateChat, getContacts } from "api";
import { useQuery } from "react-query";
import { useLocation } from "@reach/router";
import { NewContactModal, NewIndustryContactModal } from "modals";
import { useModal } from "hooks";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  type?: "network" | "leads" | "opportunities" | "clients";
  onCreate?(param?: any): void;
  initialValue?: any[];
  chatId?: number;
}

const validationSchema = Yup.object().shape({
  participants: Yup.array()
    .min(1, "Participants are required")
    .required("Participants are required"),
});
export const NewChatModal = ({
  open,
  setOpen,
  initialValue,
  onCreate = () => {},
  chatId,
}: Props) => {
  let reset = () => {};
  const location = useLocation();
  const { userId, userType } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const contactModal = useModal(false);
  const [isNetworkTab, setIsNetworkTab] = useState(
    location.pathname.indexOf('network') !== -1
  )

  useEffect(() => {
    setIsNetworkTab(
      location.pathname.indexOf('network') !== -1
    )
  }, [location.pathname])

  const { isFetching: isContactsLoading, data: contactsData, refetch } = useQuery<
    any[],
    Error
  >(["all-contacts"], () => getContacts(userId, userType, {}), {
    keepPreviousData: true,
    enabled: open,
  });

  const getChatType = (chat_type: string) => {
    if (!chat_type) {
      console.log('No "chat_type" value');
      return "network";
    }
    switch (chat_type) {
      case "opportunity":
        return "opportunities";
      case "lead":
        return "leads";
      case "client":
        return "clients";
      default:
        return chat_type;
    }
  };

  const validateParticipantsChange = (values, item) => {
    if (item?.type !== 'client' || values.participants.indexOf(item.id) !== -1) 
      return true;
    for (const pid of values.participants) {
      const participant = contactsData?.find(c => c.id === pid);
      if (participant?.type === 'client') 
        return false; 
    } 
    return true;
  }

  if (contactModal.open) 
    return (
      isNetworkTab 
        ? <NewIndustryContactModal {...contactModal} onAdd={() => refetch()} />
        : <NewContactModal {...contactModal} onAdd={() => refetch()} />
    );

  return (
    <Modal
      title={chatId ? "Add Participants" : "New chat"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div style={{ width: 700 }}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            participants: initialValue || [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              // add participants
              if (chatId) {
                const updateRes = await updateChat(chatId, values);
                onCreate(
                  `/${userType}/chats/${getChatType(
                    updateRes?.data?.chat_type
                  )}?id=${updateRes?.data?.id}`
                );
              }
              // create new chat
              else {
                const res = await createChat({ 
                  ...values, 
                  is_group: values.participants.length>1 ? 1 : 0 
                });
                onCreate(`/${userType}/chats/${getChatType(res?.chat_type)}?id=${res?.id}`);
              }
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ errors, isSubmitting, resetForm, values }) => {
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
                    <InfoText>
                      You can add a maximum of ONE client user in a chat.
                    </InfoText>
                    <FormContactMultiSelect
                      values={(contactsData || []).filter(
                        (item) => +item?.id !== +userId
                      )}
                      validateOnChange={item => validateParticipantsChange(values, item)}
                      isRequired
                      className="col-12 mt-1"
                      placeholder="Add people to start chat with"
                      name="participants"
                      showAvatar
                      isLoading={isContactsLoading}
                      value={initialValue || []}
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
                  <div className="justify-content-between align-items-center">
                    Your contact list is empty
                    <Button
                      className="ml-3"
                      disabled={hasErrors}
                      type="outline"
                      onClick={() => contactModal.setOpen(true)}
                    >
                      Create New Contact
                    </Button>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
