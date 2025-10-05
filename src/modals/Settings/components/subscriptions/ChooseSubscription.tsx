import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { Button, SignupBar, RiseLoader } from "components";
import CheckImg from "assets/icons/check_circle.svg";
import { getAllPlans } from "api";
import { useCommonUIContext } from "contexts";
import { useQuery } from "react-query";
import "./style.scss";

interface Props {
  value: string;
  onChange(value: string): void;
  onChangeSubscription(value: any): void;
  onNext?(value: string): void;
}
export const ChooseSubscription = ({
  value,
  onChange,
  onNext,
  onChangeSubscription,
}: Props) => {
  const [currentPlan, setCurrentPlan] = useState("");
  const { showErrorModal } = useCommonUIContext();
  const { isLoading, isError, error, data } = useQuery<
    { results: any[]; count: number },
    Error
  >(["subscription-plans"], () => getAllPlans(), {
    keepPreviousData: true,
  });

  const handleChangeSubscription = async (params) => {
    try {
      setCurrentPlan(params?.id);
      onChange(params?.id);

      onChangeSubscription(params);
    } catch (error) {
      showErrorModal("Error", error);
    }
  };

  const monthSubscription = data?.results.find(
    (key) => key.interval === "month"
  );
  const savedMoney = (yearPrice: number) =>
    (monthSubscription.amount * 12 - yearPrice).toFixed(2);
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return isLoading ? (
    <div className="my-auto d-flex">
      <RiseLoader className="my-4" />
    </div>
  ) : isError ? (
    <div>Error: {error?.message}</div>
  ) : data?.results && data?.results?.length > 0 ? (
    <div className="row pt-4">
      <div className="col-md-6 d-flex">
        <img src={CheckImg} alt="hidden fees" />
        <span className="ml-2 my-auto">
          No hidden fees – every JustMediationHub feature included
        </span>
      </div>
      <div className="col-md-6 d-flex">
        <img src={CheckImg} alt="hidden fees" />
        <span className="ml-2 my-auto">
          Exceptional service for all – no tier-based service
        </span>
      </div>
      <div className="col-md-6 d-flex mt-2">
        <img src={CheckImg} alt="hidden fees" className="mb-auto mt-1" />
        <span className="ml-2">
          Safe & secure – only platform with patented blockchain technology
        </span>
      </div>
      <div className="col-md-6 d-flex mt-2">
        <img src={CheckImg} alt="hidden fees" className="mb-auto mt-1" />
        <span className="ml-2">
          End-to-end solution – only platform to provide an end-to-end solution
          for you & your clients
        </span>
      </div>

      {data.results.map((plan, index) => (
        <div className="col-md-6 mt-4" key={`${index}key`}>
          <div className="choose-subscription">
            <div
              className={classNames("choose-subscription__check mx-auto", {
                active: currentPlan === plan?.id,
              })}
              onClick={() => handleChangeSubscription(plan)}
            />
            <div className="choose-subscription__heading mt-3">
              {plan?.product_data?.name}
            </div>
            <div className="d-flex mx-auto mt-2">
              <div className="choose-subscription__dollar">
                $
                {plan?.interval === "year"
                  ? (plan?.amount / 12).toFixed(2)
                  : plan?.amount}
              </div>
              <div className="choose-subscription__letter mt-auto">/month</div>
            </div>
            {plan?.interval === "year" && (
              <div className="choose-subscription__dollar-save">
                Save ${savedMoney(plan.amount)}
              </div>
            )}
            <div className="mt-1 mx-auto">
              <div className="choose-subscription__letter">
                PER USER {plan?.interval === 'year' ? '(BILLED ANNUALLY)' : '(BILLED MONTHLY)'}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-12 mt-4">
        <div className="choose-subscription">
          <FeeDescription className="row ">
            JustMediationHub clients are charged a composite rate for projects initiated on our platform.
            <br />
            <br />
            The composite rate is displayed on our platform at all times and is comprised of two separate fees: 1. Your legal fees and 2. a 5% JustMediationHub management fee payable by the client for the use of our platform.
            <br />
            <br />
            Composite Rate = Mediator Legal Fees + Separate and Standalone 5% JustMediationHub Management Fee.
            <br />
            <br />
            When a client receives a proposal on our platform and a lawyer's profile has a listed rate of $250 per hour, that is the composite rate that the client would be charged if the client engaged the lawyer for the project. It is comprised of the lawyer's legal fee and a separate and standalone JustMediationHub management fee. The same formula applies to flat, hourly, contingency, and other rates on our platform.
          </FeeDescription>
        </div>
      </div>

      <div className="col-12 mt-4">
        <div className="choose-subscription">
          <div className="choose-subscription__heading mb-3">
            Feature Details
          </div>
          <FeatureDetails className="row ">
            <div className="col-md-4">
              <ul>
                <li>Community Forum Access</li>
                <li>Case Management</li>
                <li>Contact Management</li>
                <li>Secure Client Portal</li>
                <li>Referral Tracking</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul>
                <li>In-app Chat & Call </li>
                <li>e-Signature </li>
                <li>Unlimited Document Storage</li>
                <li>Time & Expense Tracking </li>
                <li>Lead Generation & New Client Acquisition</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul>
                <li>Hourly & Flat Fee Billing</li>
                <li>Accounting</li>
                <li>Mobile apps for iPhone, iPad and Android Devices</li>
              </ul>
            </div>
          </FeatureDetails>
        </div>
      </div>
      <SignupBar>
        <Button className="ml-auto" disabled={!value} onClick={onNext}>
          Next
        </Button>
      </SignupBar>
    </div>
  ) : (
    <div className="mx-auto my-auto">
      <p className=" text-center text-gray">You currently have no plans.</p>
    </div>
  );
};

const FeatureDetails = styled.div`
  li {
    color: #2e2e2e;
    font-size: 14px;
    line-height: 26px;
    margin-bottom: 12px;
  }
`;

const FeeDescription = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  line-height: 26px;
`;