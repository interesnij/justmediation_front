import { Modal, Button, FormInput, FormTextarea, FormUpload } from "components";
import { Formik, Form } from "formik";
import { createMatterNote, updateMatterNote, uploadFiles } from "api";
import { useCommonUIContext } from "contexts";
import * as Yup from "yup";
import { acceptFileTypes } from "helpers";
import "./style.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  text: Yup.string().required("Note is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  matter?: number;
  onCreate?(): void;
  data?: any;
}

export const NewMatterNoteModal = ({
  open,
  setOpen,
  matter,
  data,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();
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
              matter,
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
          {({ resetForm, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
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
