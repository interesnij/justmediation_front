import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  FormRadio,
  Card,
  Button,
  SignupBar,
  LinkButton,
  FormCheckboxGroup2,
  FormMultiSelect, FormTaxRate,
} from "components";
import { nanoid } from "nanoid";

import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import {
  useAuthContext,
  useBasicDataContext,
  useCommonUIContext,
} from "contexts";
import { onboardUser, uploadFiles } from "api";
import { Formik, Form } from "formik";
import { AttorneyRegisterDto } from "types";
import * as Yup from "yup";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import "./../style.scss";
import { unset } from "lodash";

const bidData = [
  {
    title: "Yes",
    id: true,
  },
  {
    title: "No",
    id: false,
  },
];

const validationSchema = Yup.object().shape({
  fee_types: Yup.array().min(1, "Fees and Payment are required"),
  appointment_type: Yup.array().min(1, "Accepted Appointment Type is required"),
  payment_type: Yup.array().min(1, "Accepted Payment Method is required"),
  is_submittable_potential: Yup.bool().oneOf(
    [true, false],
    "This field is required"
  ),
  tax_rate:  Yup.number().required("Tax rate is required"),
});

interface Props {
  onBack(): void;
  initData: AttorneyRegisterDto;
}

export const ProfileForm4 = ({ onBack, initData }: Props) => {
  const { onboard, userId, userType } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const { feeTypes, currencies, appointmentTypes, paymentTypes, languages } =
    useBasicDataContext();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  
  return (
    <Formik
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const avatars = await uploadFiles(
            [values.avatar, values.team_logo], 
            "user_avatars",
            0
          );
          if (values.practice_jurisdictions.length !== 0 &&
            (values.practice_jurisdictions[0].number === "" ||
            values.practice_jurisdictions[0].country === 0 ||
            values.practice_jurisdictions[0].state === 0 ||
            values.practice_jurisdictions[0].year === 0)
          ) {
            unset(values, "practice_jurisdictions");
          }

          await onboardUser(userId, userType, {
            ...values,
            avatar: avatars[0],
            team_logo: avatars[1],
            website: values?.website === "https://" ? "" : values.website,
          });

          onboard(avatars[0], userType);
        } catch (error: any) {
          showErrorModal("Error", error);
        }
      }}
    >
      {({ errors, values, isSubmitting }) => {
        const hasErrors = Object.keys(errors).length > 0;
        return (
          <Form>
            <Card className="p-4">
              <div className="row">
                <div className="heading col-12">
                  Accepted Appointment Type
                  <span className="text-gray ml-2">Select all that apply</span>
                </div>
                <div className="mt-1 d-flex flex-wrap col-12">
                  <FormCheckboxGroup2
                    name="appointment_type"
                    values={appointmentTypes}
                  />
                </div>
                <div className="heading mt-3 col-12 ">Fees and Payment</div>
                <div className="text-black mt-2 col-12 ">
                  Fee Type
                  <span className="text-gray ml-2">Select all that apply</span>
                </div>
                <div className="mt-0 d-flex flex-wrap col-12">
                  <FormCheckboxGroup2 name="fee_types" values={feeTypes} />
                </div>
                <div className="text-black mt-2 col-12 ">
                  Accepted Payment Methods
                  <span className="text-gray ml-2">Select all that apply</span>
                </div>
                <div className="mt-0 d-flex flex-wrap col-12">
                  <FormCheckboxGroup2
                    name="payment_type"
                    values={paymentTypes}
                  />
                </div>

                <div className="text-black mt-3 w-100">
                  <div className="col-6 d-flex">
                    <span>Hourly Rate</span>
                    <div className="text-gray ml-auto mt-auto">Optional</div>
                  </div>
                </div>
                <div className="col-6">
                  <HourlyRateWrapper>
                    <FormHourlyInput
                      name="fee_rate"
                      placeholder="Enter your hourly rate"
                    />
                    <FormCurrencySelect
                      name="fee_currency"
                      values={currencies}
                    />
                  </HourlyRateWrapper>
                </div>
                <div className="heading mt-3 w-100">
                  <div className="col-6 d-flex">
                    <span className="mb-1">Languages spoken</span>
                    <div className="text-gray ml-auto mt-auto">Optional</div>
                  </div>
                </div>
                <FormMultiSelect
                  className="mt-0 col-6"
                  values={languages}
                  name="spoken_language"
                  placeholder="Select langauges"
                  isRequired
                />
                <div className="heading mt-3 col-12">
                  Do you want to submit proposals for potential client
                  engagements?
                </div>
                <div className="col-12">
                  <FormRadio values={bidData} name="is_submittable_potential" />
                </div>

                <div className="heading mt-3 w-100">
                  <div className="col-6 d-flex">
                    <span className="mb-1">Tax Rate</span>
                    {/* <div className="text-gray ml-auto mt-auto">Optional</div> */}
                  </div>
                </div>
                <div className="col-6">
                  <FormTaxRate
                    name="tax_rate"
                    placeholder="0.00"
                  />
                </div>
              </div>

            </Card>
            <SignupBar>
              <LinkButton onClick={onBack}>Go Back</LinkButton>
              <div className="ml-auto">
                You can change your profile information at anytime under{" "}
                <b>Edit Profile</b>
              </div>
              <Button
                className="ml-auto"
                buttonType="submit"
                isLoading={isSubmitting}
                disabled={hasErrors}
              >
                Next
              </Button>
            </SignupBar>
          </Form>
        );
      }}
    </Formik>
  );
};

const HourlyRateWrapper = styled.div`
  height: 48px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  transition: all 300ms ease;
  font-size: 16px;
  padding: 0 0 0 16px;
  color: #00000080;
  font-family: var(--font-family-primary);
`;

type HourlyProps = FieldHookConfig<string> & {
  className?: string;
  placeholder?: string;
  isRequired?: boolean;
};

const FormHourlyInput: React.FC<HourlyProps> = ({
  className,
  placeholder,
  isRequired,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const id = nanoid();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(
      event.target.validity.valid ? event.target.value : field.value
    );
  };
  return (
    <div className="flex-1 d-flex">
      <FormHourlyInputContainer className={className}>
        <input
          value={parseInt(field.value) === 0 ? "" : field.value}
          id={id}
          pattern="[0-9]*"
          onChange={handleChange}
          placeholder={placeholder}
        />
      </FormHourlyInputContainer>
      {meta.touched && meta.error && (
        <div className="input-control__footer">
          <div className="input-control__validation">{meta.error}</div>
        </div>
      )}
    </div>
  );
};

const FormHourlyInputContainer = styled.div`
  height: 26px;
  font-size: 14px;
  display: flex;
  flex: 1;
  margin: auto 0 auto 0;
  padding-right: 12px;
  border-right: 1px solid #e0e0e1;

  input {
    width: 100%;
    border: none;
    outline: none;
  }
`;

type CurrencyProps = FieldHookConfig<number> & {
  values?: {
    title: string;
    id: number;
  }[];
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
};

const FormCurrencySelect: React.FC<CurrencyProps> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  isRequired,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    helpers.setValue(param);
  };

  return (
    <CurrencyContainer>
      <div
        className="select-control__container w-100"
        ref={actionRef}
        tabIndex={0}
      >
        <div
          className={classNames("select-control__main border-none w-100", {
            active: field.value,
          })}
        >
          <div className="d-flex">
            <span className="my-auto">
              {field.value
                ? values.find((item) => item.id === field.value)?.title
                : placeholder}
            </span>
          </div>
          <img
            src={ArrowIcon}
            className="select-control__arrow ml-auto"
            alt="arrow"
          />
        </div>
        <div className={classNames("select-control__menu")}>
          {values.map(({ id, title }) => {
            return (
              <div
                className={classNames("select-control__menu-item", {
                  active: field.value === id,
                })}
                key={id}
                onClick={() => handleChange(id)}
              >
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="select-control__footer">
        {meta.touched && meta.error && (
          <div className="select-control__validation">{meta.error}</div>
        )}
        {help && <div className="select-control__help ml-auto">{help}</div>}
      </div>
    </CurrencyContainer>
  );
};

const CurrencyContainer = styled.div`
  width: 88px;
  display: flex;
  flex-direction: column;
`;
