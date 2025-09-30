import React, {useState, useEffect} from "react";
import {
  Modal,
  Button,
  FormInput,
  StripeElement,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect
} from "components";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {isEqual} from "lodash";
import {
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardCvcElementChangeEvent
} from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import {addPaymentMethod} from "api";
import CvcIcon from "assets/icons/cvc.svg";
import {useModal} from "hooks";
import "./styles.scss";

interface IProps {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
  data?: any;
}

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
  country: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postal_code: Yup.string().required("Zip Code is required"),
  line1: Yup.string().required("Address Line 1 is required"),
});

export const UpdatePaymentCard: React.FC<IProps> = ({
                                                 open, setOpen, onCreate = () => {
  }, data
                                               }) => {
  const elements = useElements();
  const stripe = useStripe();
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [isExpDateComplete, setIsExpDateComplete] = useState(false);
  const [isCVCComplete, setIsCVCComplete] = useState(false);
  const [countries, setCountries] = useState<{ title: string; id: string; code: string; }[]>([]);
  const [states, setStates] = useState<{ title: string; id: string; }[]>([]);
  const [cities, setCities] = useState<{ name: string; id: string; }[]>([]);
  const resultModal = useModal();

  let reset = () => {
  };

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
    if (open) {
      reset();
    }
    return () => {
    };
  }, [open]);
  console.log(data)

  return (
    <Modal
      title="Update Card"
      open={open}
      disableOutsideClick
      setOpen={(param) => {
        setOpen(param);
      }}
      modalWrapperClass="modal-control-container--add-card"
    >
      <div className="form-update-card">
        <Formik
          initialValues={{
            card_name: data.billing_details.name || "",
            country: "",
            city: "",
            state: "",
            line1: data.billing_details.address.line1 || "",
            line2: data.billing_details.address.line2 || "",
            postal_code: data.billing_details.address.postal_code || ""
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const state: {title: string} | undefined = states.find(({id}) => Number(id) === Number(values.state))
            const country: {code: string} | undefined = countries.find(({id}) => Number(id) === Number(values.country))
            const city: {name: string} | undefined = cities.find(({id}) => Number(id) === Number(values.city))

            const cardElement = await elements?.getElement(CardNumberElement);
            const expiryElement = await elements?.getElement(CardExpiryElement);
            const cvcElement = await elements?.getElement(CardCvcElement);

            const paymentMethod = await stripe?.createPaymentMethod({
              type: "card",
              card: cardElement as StripeCardNumberElement,
              billing_details: {
                name: values.card_name,
                address: {
                  line1: values.line1,
                  line2: values.line2,
                  postal_code: values.postal_code,
                  country: country!.code,
                  state: state!.title,
                  city: city!.name
                }
              },
            });

            if (!paymentMethod?.paymentMethod?.id) {
              resultModal.setOpen(true);
              return;
            }
            try {
              await addPaymentMethod(paymentMethod?.paymentMethod?.id);

              // @ts-ignore
              if(response?.response?.status === 400) {
                resultModal.setOpen(true);
                return;
              }

              await onCreate();
              await setOpen(false);
            } catch (error: any) {
              resultModal.setOpen(true);
              console.log("Error: addPaymentMethod", error)

            } finally {
              await reset();
              await cardElement?.clear();
              await expiryElement?.clear();
              await cvcElement?.clear();
            }
          }}
        >
          {({errors, values, initialValues, isSubmitting, resetForm}) => {
            reset = resetForm;
            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0;

            return (
              <Form>
                <div className="row">
                  <div className="col-12">
                    <div className="row form-add-card-container">
                      <h4 className="col-12 title-block">Card Information</h4>
                      <FormInput
                        name="card_name"
                        isRequired
                        label="Name on Card"
                        placeholder="Enter name on card"
                        className="col-12"
                      />
                      <StripeElement
                        label="Card Number"
                        className="input-control col-12"
                      >
                        <CardNumberElement
                          id="cardNumber"
                          options={ELEMENT_OPTIONS}
                          onChange={handleCardNumber}
                        />
                      </StripeElement>
                      <StripeElement label="Exp.Date" className="input-control col-5">
                        <CardExpiryElement
                          id="expiry"
                          options={ELEMENT_OPTIONS}
                          onChange={handleExpDate}
                        />
                      </StripeElement>
                      <StripeElement label="CVC" className="input-control col-5">
                        <CardCvcElement
                          id="cvc"
                          options={ELEMENT_OPTIONS}
                          onChange={handleCVC}
                        />
                      </StripeElement>
                      <div className="col-2 align-items-center">
                        <img
                          src={CvcIcon}
                          className=""
                          alt="cvc icon"
                        />
                      </div>
                      <h4 className="col-12 title-block">Billing Address</h4>
                      <FormCountrySelect
                        className="input-control col-12"
                        label="Country"
                        name="country"
                        placeholder="Select a Country"
                        countryData={(countries) => setCountries(countries)}
                        isRequired
                      />
                      <FormInput
                        name="line1"
                        isRequired
                        label="Address Line 1"
                        placeholder="Enter Street Address"
                        className="col-12"
                      />
                      <FormInput
                        name="line2"
                        placeholder="Enter Apt, Suite, etc."
                        label="Address Line 2"
                        className="input-control col-12"
                      />
                      <FormStateSelect isRequired
                                       className="input-control col-12"
                                       label="State"
                                       name="state"
                                       placeholder="Select State"
                                       country={values.country}
                                       statesData={(states) => setStates(states)}
                      />
                      <FormCitySelect isRequired
                                      className="input-control col-6"
                                      label="City"
                                      name="city"
                                      placeholder="Select city"
                                      state={values.state}
                                      citiesData={(cities) => setCities(cities)}
                      />
                      <FormInput
                        className="col-6"
                        label="Zip code"
                        name="postal_code"
                        placeholder="Enter zip code"
                        isRequired
                      />
                    </div>
                    <div className="col-12 ">
                      <Button
                        className="mb-4 w-100"
                        buttonType="submit"
                        isLoading={isSubmitting}
                        disabled={
                          hasErrors ||
                          hasChanged ||
                          !stripe ||
                          !isCardNumberComplete ||
                          !isExpDateComplete ||
                          !isCVCComplete || isSubmitting
                        }
                      >
                        Update Card
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      {resultModal?.open &&
        <Modal {...resultModal} title="Error - Payment Process">
              <div className="pb-4" style={{ width: 600 }}>
                  <div className="text-black" style={{ fontSize: 18 }}>
                      There was a problem processing your payment. <br/>
                      Please check your information and try again.
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
    </Modal>
  );
};
