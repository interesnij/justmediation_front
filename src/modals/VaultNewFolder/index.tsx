import React, { useEffect } from "react";
import { Modal, Button, FormInput } from "components";
import { Formik, Form } from "formik";
import { createNewFolder } from "api";
import { useCommonUIContext } from "contexts";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Folder name is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  parent?: number;
  onCreate?(): void;
}
export const VaultNewFolderModal = ({
  open,
  setOpen,
  parent,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();

  useEffect(() => {
    const init = async () => {};
    init();
    return () => {};
  }, []);

  return (
    <Modal
      title="New folder (My Vault)"
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
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await createNewFolder({
                ...values,
                parent,
                is_vault: true,
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
            return (
              <Form>
                <FormInput
                  name="title"
                  label="Folder name"
                  placeholder="Untitled folder"
                  isRequired
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
