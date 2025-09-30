import React, {useEffect, useState} from "react";
import {
  Button,
  Folder,
  FolderItem,
  FormCountrySelect,
  FormInput, FormStateSelect,
  FullScreenModal, Modal,
  RiseLoader,
  StripeElement
} from "components";
import {
  getAllPlans, getPaymentMethod, updateFinanceProfile,
} from "api";
import {useQuery} from "react-query";
import {useAuthContext, useCommonUIContext} from "contexts";
import "./style.scss";
import {Form, Formik} from "formik";
import {CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent
} from "@stripe/stripe-js";
import {isEqual} from "lodash";
import {useModal} from "../../hooks";
import * as Yup from "yup";

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
  open: boolean;
  setOpen(param: boolean): void;
  onUpdate?(): void;
  subscriptionData: any;
}

export const PaymentFormModal = ({
                                   open,
                                   setOpen,
                                   onUpdate = () => {
                                   },
                                 }: Props) => {

  const {userId} = useAuthContext();
  const resultModal = useModal();
  const [errorValidation, setValidationError] = useState("");
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {

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
        name: values.card_name
      },
    });

    setLoading(true);

    try {
      if (!paymentMethod?.paymentMethod?.id) new Error("Payment method doesn't create.");
      await updateFinanceProfile({
        payment_method: paymentMethod?.paymentMethod?.id
      })
      await onUpdate();
      setOpen(false);
    } catch (error: any) {
      setValidationError(error?.response?.data?.detail);
      resultModal.setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FullScreenModal title="Edit payment method" open={open} setOpen={setOpen}>
      <div className="pt-4 change-subscription-modal">

          <Formik
            initialValues={{
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
            onSubmit={async (values, { resetForm }) => {
              await handleSubmit(values);
              resetForm();
            }}
          >
            {({errors, values, initialValues, isSubmitting}) => {
              const hasChanged = isEqual(values, initialValues);
              const hasErrors = Object.keys(errors).length > 0;
              return (
                <Form>
                  <div className="row pl-4 pr-4">
                    <div className="col-md-6">
                      <Folder label="Card Information" className="jumbo">
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
                    </div>
                    <div className="col-md-6 ">
                      <Folder label="Billing Address" className="jumbo">
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
                  </div>
                  <div className="col-12 mt-4">
                    <div className="px-3">
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
                          !isCVCComplete ||
                          loading ||
                          isSubmitting
                        }>Save</Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>


      </div>
    </FullScreenModal>
  );
};

