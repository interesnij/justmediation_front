import React from "react";
import { Button, Modal, FormTextarea, FormShareSearch } from "components";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import { useCommonUIContext, useAuthContext } from "contexts";
import { shareContact } from "api";
import * as Yup from "yup";
import "./style.scss";

const validationSchema = Yup.object().shape({
  user: Yup.number().required("Client is required"),
  message: Yup.string().required("Message is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onUpdate?(): void;
  data?: any;
  sharedWith?: number[];
  isPending?: boolean;
  contactId?: string | number;
}
export const ShareContactModal = ({
  open,
  data,
  setOpen,
  sharedWith = [],
  onUpdate = () => {},
  isPending,
  contactId,
}: Props) => {
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();
  const { userId } = useAuthContext();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Share With"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div style={{ width: 600 }}>
        <Formik
          initialValues={data || {}}
          validationSchema={validationSchema}
          onSubmit={async (values: any) => {
            try {
              await shareContact(userId, {
                is_pending: isPending,
                contact_id: contactId,
                shared_with: [values.user],
                message: values.message
              });
              await onUpdate();
              await setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({
            values,
            initialValues,
            errors,
            isSubmitting,
            resetForm,
          }) => {
            reset = resetForm;
            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0;
            return (
              <Form>
                <div className="row">
                  <div className="col-12">
                    <FormShareSearch
                      name="user"
                      isRequired
                    />
                  </div>
                  {values.user && (
                    <FormTextarea
                      className="col-12 mt-2"
                      label="Message"
                      placeholder="Input your message here"
                      name="message"
                      isRequired
                    />
                  )}
                </div>
                <div className="d-flex mt-2">
                  <Button
                    className="ml-auto"
                    size="large"
                    theme="white"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    buttonType="submit"
                    size="large"
                    className="ml-3"
                    theme="yellow"
                    isLoading={isSubmitting}
                    disabled={hasChanged || hasErrors || isSubmitting}
                  >
                    Share
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
