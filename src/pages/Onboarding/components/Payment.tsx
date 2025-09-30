import React, { useState, useEffect } from "react";
import {
  Card,
  FormInput,
  Folder,
  FolderItem,
  Button,
  SignupBar,
  LinkButton,
  Modal,
  StripeElement,
  FormCountrySelect,
  FormStateSelect,
} from "components";
import {submitSubscription} from "api";
import { Formik, Form } from "formik";
import { isEqual } from "lodash";
import { useAuthContext } from "contexts";
import { useModal } from "hooks";
import * as Yup from "yup";
import { navigate } from "@reach/router";
import {
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardCvcElementChangeEvent,
} from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import moment from 'moment'

import "./../style.scss";

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#000",
      border: "1px solid green",
      "::placeholder": {
        color: "rgba(0,0,0,0.25)",
      },
    },
    invalid: {
      color: "#CC4B39",
    },
  },
};

const validationSchema = Yup.object().shape({
  card_name: Yup.string().required("Name on Card is required"),
  billing_country: Yup.string().required("Country is required"),
  billing_city: Yup.string().required("City is required"),
  billing_state: Yup.string().required("State is required"),
  billing_zip_code: Yup.string().required("Zip Code is required"),
  billing_address1: Yup.string().required("Address Line 1 is required"),
});

interface Props {
  planId: "lawplain-monthly" | "plan_JTNC7jl2Yz7kcf";
  onBack?(): void;
  subscriptionData: any;
}

export const PaymentForm = ({ planId, onBack, subscriptionData }: Props) => {
  const { userId, subscribe, userType } = useAuthContext();
  const resultModal = useModal();
  const [error, setError] = useState("");
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [isExpDateComplete, setIsExpDateComplete] = useState(false);
  const [isCVCComplete, setIsCVCComplete] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{
    id: string;
    title: string;
    code: string;
  }>();
  const [selectedState, setSelectedState] = useState<{
    id: string;
    title: string;
  }>();
  const elements = useElements();
  const stripe = useStripe();

  const handleCardNumber = (params: StripeCardNumberElementChangeEvent) => {
    setIsCardNumberComplete(params.complete);
  };
  const handleExpDate = (params: StripeCardExpiryElementChangeEvent) => {
    setIsExpDateComplete(params.complete);
  };
  const handleCVC = (params: StripeCardCvcElementChangeEvent) => {
    setIsCVCComplete(params.complete);
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <Formik
      initialValues={{
        plan_id: planId,
        user_id: userId,
        card_name: "",
        billing_country: "",
        billing_city: "",
        billing_state: "",
        billing_zip_code: "",
        billing_address1: "",
        billing_address2: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        //console.log("values", values);
        const cardElement = await elements?.getElement(CardNumberElement);
        const paymentMethod = await stripe?.createPaymentMethod({
          type: "card",
          card: cardElement as StripeCardNumberElement,
          billing_details: {
            address: {
              city: values?.billing_city,
              country: selectedCountry?.code,
              line1: values?.billing_address1,
              line2: values?.billing_address2,
              postal_code: values?.billing_zip_code,
              state: selectedState?.title,
            },
            name: values.card_name,
          },
        });
        if (!paymentMethod?.paymentMethod?.id) {
          console.log("card", cardElement, paymentMethod);

          setError(
            paymentMethod?.error?.message || 
            "Error occurred while processing payment"
          );
          resultModal.setOpen(true);
          return;
        }
        try {
          const subscriptionResponse = await submitSubscription({
            user_id: values.user_id,
            plan_id: values.plan_id,
            token: paymentMethod?.paymentMethod?.id,
          });

          // @ts-ignore
          if(subscriptionResponse?.response?.status === 400) {
            // @ts-ignore
            setError(subscriptionResponse?.response?.data?.detail);
            resultModal.setOpen(true);
            return;
          }
          subscribe(values.plan_id);
          navigate(`/auth/onboarding/profile/${userType}`);
        } catch (error: any) {
          console.log(error)
          setError(error?.response?.data?.detail);
          resultModal.setOpen(true);
        }
      }}
    >
      {({ errors, values, initialValues, isSubmitting }) => {
        const hasChanged = isEqual(values, initialValues);
        const hasErrors = Object.keys(errors).length > 0;

        return (
          <Form>
            <div className="row">
              <div className="col-md-8">
                <Folder label="Card Information">
                  <FolderItem>
                    <div className="row pb-2">
                      <FormInput
                        name="card_name"
                        isRequired
                        label="Name on Card"
                        placeholder="Full Name"
                        className="col-12 mt-2"
                      />
                      <StripeElement
                        label="Card Number"
                        className="col-12 mt-2"
                      >
                        <CardNumberElement
                          id="cardNumber"
                          options={ELEMENT_OPTIONS}
                          onChange={handleCardNumber}
                        />
                      </StripeElement>
                      <StripeElement label="Exp.Date" className="col-md-6 mt-2">
                        <CardExpiryElement
                          id="expiry"
                          options={ELEMENT_OPTIONS}
                          onChange={handleExpDate}
                        />
                      </StripeElement>
                      <StripeElement label="CVC" className="col-md-6 mt-2">
                        <CardCvcElement
                          id="cvc"
                          options={ELEMENT_OPTIONS}
                          onChange={handleCVC}
                        />
                      </StripeElement>
                    </div>
                  </FolderItem>
                </Folder>
                <Folder className="mt-4" label="Billing Address">
                  <FolderItem>
                    <div className="row pb-2">
                      <FormCountrySelect
                        name="billing_country"
                        isRequired
                        placeholder="Country"
                        label="Country"
                        className="col-12 mt-2"
                        onSelect={(e) => setSelectedCountry(e)}
                      />
                      <FormInput
                        name="billing_address1"
                        isRequired
                        label="Address Line 1"
                        placeholder="Address Line 1"
                        className="col-12 mt-2"
                      />
                      <FormInput
                        name="billing_address2"
                        placeholder="Address Line 2"
                        label="Address Line 2"
                        className="col-12 mt-2"
                      />
                      <FormStateSelect
                        name="billing_state"
                        isRequired
                        placeholder="State"
                        label="State"
                        className="col-md-6 mt-2"
                        country={values.billing_country}
                        onSelect={(e) => setSelectedState(e)}
                      />
                      <FormInput
                        name="billing_city"
                        isRequired
                        label="City"
                        placeholder="City"
                        className="col-md-6 mt-2"
                      />
                      <FormInput
                        name="billing_zip_code"
                        isRequired
                        placeholder="Zip Code"
                        label="Zip Code"
                        className="col-md-6 mt-2"
                      />
                    </div>
                  </FolderItem>
                </Folder>
              </div>
              <div className="col-md-4">
                <Card>
                  <div className="subscription-pmnt-title">Order Summary</div>
                  <div className="divider my-3"/>
                  <div className="subscription-pmnt-heading">
                    Free Trial
                  </div>
                  <div className="d-flex mt-2 justify-content-between">
                    <span className="subscription-pmnt-text">
                      6 months Trial
                    </span>
                    <b className="text-dark">${subscriptionData?.amount}</b>
                  </div>
                  <div className="divider my-3"/>
                  <div className="subscription-pmnt-heading">
                    Today's Charge
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <span className="subscription-pmnt-text">Subtotal</span>
                    <span className="subscription-pmnt-text">
                      ${subscriptionData?.amount}
                    </span>
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <span className="subscription-pmnt-text">
                      Estimated tax:
                    </span>
                    <span className="subscription-pmnt-text">$0</span>
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <span className="subscription-pmnt-text">
                      6 Months Free Trial:
                    </span>
                    <span className="subscription-pmnt-text">-${subscriptionData?.amount}</span>
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <b className="text-dark">Total</b>
                    <span className="subscription-pmnt-total">
                      {/*${subscriptionData?.amount}*/}
                      $0.00
                    </span>
                  </div>
                </Card>
                <Card className="mt-4">
                  <div className="subscription-pmnt-heading">
                    Charges Auto-renew
                  </div>
                  <p className="subscription-pmnt-text">
                    Starting {moment().add(6, 'months').format("MMMM DD, YYYY")}, unless cancel before next renew date.
                  </p>
                  <div className="d-flex mt-2 justify-content-between">
                    <span className="subscription-pmnt-text">before taxes</span>
                    <b className="text-dark">${subscriptionData?.amount}</b>
                  </div>
                </Card>
              </div>
            </div>
            <SignupBar>
              <LinkButton onClick={onBack}>Go Back</LinkButton>

              <Button
                className="ml-auto"
                buttonType="submit"
                isLoading={isSubmitting}
                disabled={
                  hasErrors ||
                  hasChanged ||
                  !stripe ||
                  !isCardNumberComplete ||
                  !isExpDateComplete ||
                  !isCVCComplete
                }
              >
                Submit and Start Membership
              </Button>
            </SignupBar>
            {
              resultModal?.open &&
              <Modal {...resultModal} title="Error - Payment Process">
                <div className="pb-4" style={{ width: 600 }}>
                  <div className="text-black" style={{ fontSize: 18 }}>
                      There was a problem processing your payment. Please check your information and try again.
                  </div>
                </div>
                <div className="d-flex mt-4">
                  <Button
                    className="ml-auto"
                    onClick={() => {
                      resultModal.setOpen(false);
                    }}
                  >
                    Ok
                  </Button>
                </div>
              </Modal>
            }
          </Form>
        );
      }}
    </Formik>
  );
};
