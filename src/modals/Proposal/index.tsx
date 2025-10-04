import React, { useState } from "react";
import { Modal, Button, FormTextarea, FormInput, FormRadio, User, FormCurrencyInputWrapper, FormCurrencyPrice, FormCurrencySelect } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getUserName, renderBudget } from "helpers";
import { format } from "date-fns";
import { useAuthContext, useBasicDataContext } from "contexts";
import { createProposal, updateProposal } from "api";
import "./style.scss";

const validationSchema = Yup.object().shape({
  rate_type: Yup.string().required("Rate type is required"),
  rate: Yup.string().when('rate_type', {
    is: 'contingency_fee',
    then: Yup.string().required('Contingency fee is required'),
    otherwise: Yup.string().required("Estimated price is required")
  }),
  description: Yup.string().required("Proposal description is required")
});

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

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  post?: any;
  proposal?: any;
  onCreate?(id:number): void;
}
export const Proposal = ({ open, setOpen, post, proposal, onCreate = () => {} }: Props) => {
  const [responseError, setError] = useState('');
  const [isShowFullDescription, setShowFullDescription] = useState(false);

  const { currencies } = useBasicDataContext();

  let reset = () => {};
  const { userId, userType, profile } = useAuthContext();
  const isLongDescription = post?.description && post?.description.length > 220
    ? true : false;
  return (
    <Modal
      title="Submit Proposal"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
        setError('');
        setShowFullDescription(false);
      }}
    >
      <div className="submit-proposal-modal">
        <div className="post-page__post">
          <div className="w-100 post-preview">
            <div className="d-flex mb-2">
              <span className="title">{post?.title}</span>
              <span className="practice ml-3">
                {" "}
                {post?.practice_area_data?.title}
              </span>
            </div>

            <div className="d-flex">
              <User size="normal" avatar={post?.client_data?.avatar} />
              <div className="ml-2">
                <div className="name mt-auto">
                  {getUserName(post?.client_data)}
                </div>
                <div className="date mb-auto">
                  {post?.created
                    ? 'Posted ' + format(new Date(post?.created), "MM/dd/yy")
                    : ""}
                </div>
              </div>
            </div>
            <div className="d-flex mt-2">
              <span className="budget">
                {renderBudget(post)}
              </span>
            </div>
            <div className={`mt-2 message pre-wrap ${isLongDescription && !isShowFullDescription ? ' faded-text' : ''}`}>
              {post?.description}
            </div>
            {isLongDescription && !isShowFullDescription && (
              <div className="view-more mt-1" onClick={e=>setShowFullDescription(true)}>
                View More
              </div>
            )}
          </div>
        </div>

        <Formik
          initialValues={{
            post: post?.id,
            mediator: userId,
            rate_type: proposal?.rate_type || "hourly",
            description: proposal?.description || "",
            rate: proposal?.rate || "",
            currency: proposal?.currency || 1,
            rate_detail: proposal?.rate_detail || ""
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              if ((userType && ['paralegal', 'other'].indexOf(userType) !== -1) || (userType === "enterprise" && profile.role !== "Mediator")){
                setError('Only mediators can send proposals')
                return;
              }
              setError('');
              values.post = post?.id;
              const response = proposal?.id 
                ? await updateProposal(proposal.id, values)
                : await createProposal(values);
              setOpen(false);
              onCreate(response?.data?.id || 0);
            } catch (error: any) {
              setError(error?.response?.message || error?.response?.data?.detail);
            }
          }}
        >
          {({ resetForm, errors, values }) => {
            reset = resetForm;
            const isContingencyFee = values.rate_type === 'contingency_fee';
            return (
              <Form>
                <div className="row">
                  <div className="col-12 mt-2">
                    <FormRadio name="rate_type" values={priceTypeData} />
                  </div>
                  <div className="d-flex mt-2 col-12">
                    {!isContingencyFee && (
                      <FormCurrencyInputWrapper>
                        <FormCurrencyPrice name="rate" placeholder="0.00" />
                        <FormCurrencySelect
                          name="currency"
                          values={currencies}
                        />
                      </FormCurrencyInputWrapper>
                    )}
                    {values?.rate_type === 'hourly' ? (
                      <div className="hourly-marker col-7">/hr</div>
                    ) : isContingencyFee ? (
                      <FormInput 
                        name="rate" 
                        placeholder="Enter the Contingency Fee" 
                        className="col-7 no-left-pad" 
                      />
                    ) : (
                      <FormInput name="rate_detail" className="col-7" />
                    )}
                  </div>
                  <FormTextarea
                    name="description"
                    label="Proposal"
                    placeholder="Type your proposal here"
                    className="col-12 mt-2"
                    isRequired
                  />
                </div>
                <div className="d-flex mt-2">
                  {responseError && 
                    <div className="error-message">{responseError}</div>
                  }
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
                    {proposal?.id ? `Update Proposal` : `Submit Proposal`}
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
