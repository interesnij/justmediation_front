import React, {useState} from "react";
import {Modal, Button, FormInput} from "components";
import {Formik, Form} from "formik";
import {updateSpecialty} from "api";
import * as Yup from "yup";
import {useCommonUIContext} from "contexts";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

type tSpecialty = { id: number; title: string, created_by: number | null };

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
  callback: () => void;
  specialty?: tSpecialty;
}

export const EditPracticeArea =
  ({
     open,
     setOpen,
     callback,
     specialty
   }: Props) => {
    const { showErrorModal } = useCommonUIContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let reset = () => {
    };

    const onEdit = async (title) => {
      setIsLoading(true)
      try {
        await updateSpecialty(specialty?.id, title);
        reset();
        callback();
      } catch (error) {
        showErrorModal("Error", error);
      } finally {
        setIsLoading(false);
        setOpen(false);
      }
    }
    return (
      <Modal
        title="Edit Practice Area"
        open={open}
        setOpen={(param) => {
          setOpen(param);
          reset();
        }}
      >
        <div className="add-expense-entry-modal" style={{width: 500}}>
          <Formik
            initialValues={{
              title: specialty?.title,
            }}
            validationSchema={validationSchema}
            onSubmit={async () => {}}
          >
            {({resetForm, values}) => {
              reset = resetForm;

              return (
                <Form>
                  <div className="row">
                    <FormInput name="title" className="col-12" isRequired/>
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
                    >
                      Cancel
                    </Button>
                    <Button
                      className="ml-3"
                      buttonType="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                      onClick={() => onEdit(values.title)}
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
