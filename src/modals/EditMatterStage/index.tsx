import React from "react";
import { Modal, Button, FormInput } from "components";
import { Formik, Form } from "formik";
import {updateMaterStage} from "api";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
  stage: { id: number, title: string };
  callback: () => void;
}
export const EditMatterStage = ({
                                      open,
                                      setOpen,
                                      callback,
                                      stage
                                    }: Props) => {
  let reset = () => {};

  return (
    <Modal
      title="
      Edit Matter Stage"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="add-expense-entry-modal" style={{ width: 500 }}>
        <Formik
          initialValues={{
            title: stage.title || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await updateMaterStage(stage.id, values);
            reset();
            setOpen(false);
            callback()
          }}
        >
          {({ resetForm, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
                <div className="row">
                  <FormInput name="title" className="col-12" isRequired />
                </div>
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
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    buttonType="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    size="large"
                  >
                    Save
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
