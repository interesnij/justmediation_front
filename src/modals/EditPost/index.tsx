import React from "react";
import { Modal, Button, FormInput, FormTextarea, FormSelect } from "components";
import { Formik, Form } from "formik";
import { useBasicDataContext, useCommonUIContext } from "contexts";
import { updateForumPostById } from "api";
import { Post } from "types";
import * as Yup from "yup";
import "./style.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  topic: Yup.string().required("Practice Area is required"),
  message: Yup.string().required("Message is required"),
});

interface Props {
  open: boolean;
  post: any;
  setOpen(param: boolean): void;
  onUpdate?(): void;
}
export const EditPostModal = ({ open, setOpen, post, onUpdate = () => {} }: Props) => {
  let reset = () => {};

  const { forumCategories } = useBasicDataContext();
  const { showErrorModal } = useCommonUIContext();

  return (
    <Modal
      title="Edit Post"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="edit-post-modal">
        <Formik
          initialValues={{
            title: post?.title,
            topic: post?.topic,
            message: post?.message,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values: Post) => {
            try {
              await updateForumPostById(post?.id, values);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
            onUpdate();
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
                    Update
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
