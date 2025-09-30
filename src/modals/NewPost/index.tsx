import React from "react";
import { Modal, Button, FormInput, FormTextarea, FormSelect } from "components";
import { Formik, Form } from "formik";
import { useBasicDataContext, useCommonUIContext, useAuthContext } from "contexts";
import { navigate } from "@reach/router";
import { createForumPost } from "api";
import * as Yup from "yup";
import "./style.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  topic: Yup.string().required("Practice Area is required"),
  message: Yup.string().required("Message is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
}
export const NewPostModal = ({ open, setOpen, onCreate = () => {} }: Props) => {
  let reset = () => {};

  const { forumCategories } = useBasicDataContext();
  const { showErrorModal } = useCommonUIContext();
  const { userType } = useAuthContext();

  return (
    <Modal
      title="Create New Post"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        <Formik
          initialValues={{
            title: "",
            topic: "",
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const {data} = await createForumPost(values);
              if (data.id){
                navigate(`/${userType}/forums/post/${data.id}`);
              }
            } catch (error: any) {
              showErrorModal("Error", error);
            }
            onCreate();
            setOpen(false);
            reset();
          }}
        >
          {({ resetForm, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
                <FormInput
                  name="title"
                  label="Title of Post"
                  placeholder="Name your post"
                  isRequired
                />
                <FormSelect
                  name="topic"
                  label="Practice Area"
                  className="mt-3"
                  placeholder="Enter or select topic/practice area"
                  values={forumCategories}
                  isRequired
                />
                <FormTextarea
                  name="message"
                  label="Message"
                  placeholder="Type your message here"
                  className="mt-2"
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
                    buttonType="submit"
                    isLoading={isSubmitting}
                    size="large"
                  >
                    Post
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
