import React from "react";
import {
  Modal,
  Button,
  FormInput,
  FormTextarea,
  FormSelect,
  FormRadio,
  FormCurrencyPrice,
  FormCurrencySelect,
  RiseLoader,
} from "components";
import styled from "styled-components";
import { Formik, Form } from "formik";
import { useBasicDataContext } from "contexts";
import * as Yup from "yup";
import { createPostedMatter, editPostedMatter } from "api";
import { useCommonUIContext } from "contexts";
import { DeactivatePostedMatterModal, ReactivatePostedMatterModal, DeletePostedMatterModal } from "modals";
import { useModal } from "hooks";
import "./style.scss";

const priceTypeData = [
  {
    title: "Hourly",
    id: "hourly",
  },
  {
    title: "Flat Fee",
    id: "flat_fee",
  },
  {
    title: "Contingency Fee",
    id: "contingency_fee",
  },
  {
    title: "Other Rate",
    id: "other",
  },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Post title is required"),
  practice_area: Yup.string().required("Practice area is required"),
  description: Yup.string().required("Description is required"),
  budget_type: Yup.string().required("Budget type is required"),
  budget_min: Yup.mixed()
    .when('budget_type', {
      is: 'contingency_fee',
      then: Yup.string(),
      otherwise: Yup.number().required('Budget is required').moreThan(1, "Must be more than 1.00")
    }),
  budget_max: Yup.number().when('budget_type', {
    is: 'hourly',
    then: Yup.number().moreThan(Yup.ref("budget_min"), 'Must be greater than minimal value')
  })
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  isTopicsLoading?: boolean;
  topics: {
    id: number;
    title: string;
  }[];
  data?: {
    id?: number;
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    budget_type: string;
    practice_area: number;
    currency: number;
    status?: string;
  };
  refetchPosts(): void;
}

export const RepPostMatterModal = ({
  open,
  setOpen,
  isTopicsLoading = false,
  topics,
  data = {
    title: "",
    description: "",
    budget_min: 0.00,
    budget_max: 0.00,
    budget_type: "hourly",
    practice_area: 1,
    currency: 1,
  },
  refetchPosts
}: Props) => {
  let reset = () => {};
  const { currencies } = useBasicDataContext();
  const { showErrorModal } = useCommonUIContext();
  const deleteModal = useModal();
  const activateModal = useModal();
  const deactivateModal = useModal();

  return (
    <Modal
      title="Post a Matter for Representation"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="rep-post-matter-modal">
        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              data.id
                ? await editPostedMatter(data.id, values)
                : await createPostedMatter(values);
              refetchPosts();
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, values }) => {
            reset = resetForm;
            return (
              <Form>
                <div className="row">
                  <div className="col-12 text-black">
                    <div>
                      Have attorneys submit their proposals to your matter!
                    </div>
                    <ul className="mt-1">
                      <li>Only attorneys can submit proposals</li>
                      <li>Only you can see submissions from your posts</li>
                    </ul>
                  </div>
                  <Label className="col-12 mt-3">Title of Post</Label>
                  <FormInput name="title" className="col-12 mt-1" isRequired />
                  <Label className="col-12 mt-2">Practice Area</Label>
                  {isTopicsLoading ? (
                    <RiseLoader className="my-1" />
                  ) : (
                    <FormSelect
                      values={topics}
                      name="practice_area"
                      className="col-12 mt-1"
                      isRequired
                    />
                  )}
                  <Label className="mt-3 col-12">Budget</Label>
                  <div className="text-dark mt-1 col-12">
                    Set your estimated budget
                  </div>
                  <FormRadio
                    values={priceTypeData}
                    className="mt-1 col-12"
                    name="budget_type"
                  />
                  <div className="mt-3 col-12 row">
                    {values?.budget_type === 'contingency_fee' ? (
                      <div className="col-4">
                        <FormInput 
                          name="budget_min" 
                          placeholder="Enter the Contingency Fee" 
                        />
                      </div>
                    ) : (
                      <div className="col-4">
                      {values?.currency===1 && <span className="dollar-sign">$</span>}
                      <div className={`price-input-wrap${values?.currency===1 ? ' with-dollar' : ''}`}>
                        <FormCurrencyPrice name="budget_min" placeholder="0.00" />
                        <FormCurrencySelect
                          name="currency"
                          values={currencies}
                        />
                      </div>
                    </div>
                    )}
                    {values?.budget_type === 'hourly' ? (
                    <>
                    <div className="hourly-marker">/hr</div>
                    <div className="text-black mx-2 my-auto">TO</div>
                    <div className="col-4">
                      {values?.currency===1 && <span className="dollar-sign">$</span>}
                      <div className={`price-input-wrap${values?.currency===1 ? ' with-dollar' : ''}`}>
                        <FormCurrencyPrice name="budget_max" placeholder="0.00" />
                        <FormCurrencySelect
                          name="currency"
                          values={currencies}
                        />
                      </div>
                    </div>
                    <div className="hourly-marker">/hr</div>
                    </>
                    ) : values?.budget_type === 'other' ? (
                      <FormInput 
                        name="budget_detail" 
                        className="col-4"
                        placeholder="Rate description" 
                      />
                    ) : null}
                  </div>
                  <Label className="mt-3 col-12">Description</Label>
                  <div className="col-6 mt-1 text-dark">
                    <div>A good description includes:</div>
                    <ul>
                      <li>The legal concern you have</li>
                      <li>The specific questions you have</li>                      
                    </ul>
                  </div>
                  <div className="col-6 mt-1 text-dark">
                    <div>DO NOT include:</div>
                    <ul>
                      <li>Names</li>
                      <li>Case or matter number</li>
                    </ul>
                  </div>

                  <FormTextarea
                    className="mt-2 col-12"
                    name="description"
                    placeholder="Type your message here"
                    label=""
                    isRequired
                  />
                  <div className="justify-content-between mt-3 col-12">
                    <div className="d-flex">
                      {!!data?.id && (
                        <>
                        {data?.status === 'inactive' ? (
                          <Button theme="white" size="large" onClick={e => activateModal.setOpen(true)}>
                            Reactivate Post
                          </Button>
                        ) : (
                          <Button theme="white" size="large" onClick={e => deactivateModal.setOpen(true)}>
                            Deactivate Post
                          </Button>
                        )}
                          <Button className="ml-3" theme="white" size="large" onClick={e => deleteModal.setOpen(true)}>
                            Delete Post
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="d-flex">
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
                      <Button className="ml-3" buttonType="submit" size="large">
                        {data?.id ? `Save Edits` : `Post Matter`}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
        {data?.id && (
          <>
            {
              deactivateModal?.open &&
              <DeactivatePostedMatterModal {...deactivateModal} callback={refetchPosts} id={data.id} />
            }
            {
              activateModal?.open &&
              <ReactivatePostedMatterModal {...activateModal} callback={refetchPosts} id={data.id} />
            }
            {
              deleteModal?.open &&
              <DeletePostedMatterModal {...deleteModal} onDelete={refetchPosts} id={data.id} />
            }
          </>
        )}
      </div>
    </Modal>
  );
};

const Label = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: -0.01em;
  color: #000000;
`;
//deactivatePostedMatter, reactivatePostedMatter, 