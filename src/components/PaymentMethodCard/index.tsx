import React, { useState } from "react";
import classNames from "classnames";
import { Button, Checkbox, Tag } from "components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CardImg from "assets/images/card_visa.png";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import { useInput } from "hooks";
import "./style.scss";

interface IProps {
  title?: string;
  subtitle?: string;
  isCard?: boolean;
  isAccount?: boolean;
  last4card?: boolean;
  isDefaultPaymentMethod?: boolean;
  methodStatus?: string;
  isConfirmedAccount?: boolean;
  onRemove: (cardData: ICardData) => void;
  data: any;
  handleUpdateCard: (cardData: ICardData) => void;

}

interface ICardData {
  id: string;
}

export const PaymentMethodCard: React.FC<IProps> = ({
                                         isCard = false,
                                         isConfirmedAccount = false,
                                         isDefaultPaymentMethod = false,
                                         last4card = 1234,
                                         methodStatus = "",
                                         onRemove = () => {},
                                         data = {},
                                         handleUpdateCard,
                                       }) => {
  const defaultMethod = useInput(false);
  const [show, setShow] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const methodStatusTypes = {
    savings: "Savings",
    checking: "Checking",
  };

  const billingAddress: string[] = [
    data?.billing_details?.address?.line1,
    data?.billing_details?.address?.line2,
    data?.billing_details?.address?.city,
    data?.billing_details?.address?.state,
    data?.billing_details?.address?.country,
    data?.billing_details?.address?.postal_code
  ];

  const isEmptyBillingAddress = billingAddress.every(value => value === null)

  return (
    <section className={classNames("payment-method-item")}>
      <div
        onClick={() => setShow((prevState) => !prevState)}
        className="payment-method-item__section section-main cursor-pointer"
      >
        <div className="align-items-center">
          <LazyLoadImage alt="img" wrapperClassName="card-icon mr-2" src={CardImg} />
          <div>
            <h4 className="my-0 capitalize">{data?.card?.brand}</h4>
            {/* Default payment method (bank account) */}
            {!isCard && isConfirmedAccount && (
              <div className="payment-method-item__desc font-size-sm">
                Preferred method
              </div>
            )}
          </div>

          {/* Non confirmed bank account status */}
          {!isConfirmedAccount && !isCard && (
            <Tag
              type="referral-pending"
              className="ml-2"
              isCustomContent={true}
            >
              Pending Verification
            </Tag>
          )}
        </div>
        <div className="text-dark ">
          ****
          {data?.card?.last4}
          <img
            src={ArrowIcon}
            className={classNames("payment-method-item__icon-arrow upcoming-bill__arrow ml-2", {show})}
            alt="arrow"
          />
        </div>
      </div>

      {show && (
        <div
          className={classNames(
            // eslint-disable-next-line no-multi-str
            " \
          payment-method-item__section section-additional mt-3"
          )}
        >
          <div className="section-additional__left-side">
            <div className="d-flex align-items-center">
              {isCard ? (
                  <div className="flex-column text-dark">
                    <p>
                      <span className="text-bold">Name on Card: </span>
                      <br />
                      {data?.billing_details?.name || "Doesn't have name information on the card."}
                    </p>
                    <p>
                      <span className="text-bold">Exp. Date: </span>
                      <br />
                      {data?.card?.exp_month} / {data?.card?.exp_year}
                    </p>
                    <p>
                      <span className="text-bold">Billing Address: </span>
                      <br/>
                      {isEmptyBillingAddress ? <span>Doesn't have billing address information.</span> : <>
                        {data?.billing_details?.address?.line1}, {data?.billing_details?.address?.line2 || ""} <br/>
                        {data?.billing_details?.address?.city},  {data?.billing_details?.address?.state},
                        {data?.billing_details?.address?.country},  {data?.billing_details?.address?.postal_code}
                      </>}
                    </p>
                  </div>
                ) : // bank account - non confirmed
                !isConfirmedAccount ? (
                    <>
                      <div className="mr-3">
                        Please complete and verify this account.
                      </div>
                      <Button size="large">Verify Now</Button>
                    </>
                  ) : // bank account - confirmed
                  isConfirmedAccount ? (
                    <>
                      <span className="text-black text-bold mr-1">Status: </span>
                      <Tag type="done" isCustomContent={true}>
                        Confirmed
                      </Tag>
                    </>
                  ) : null}
            </div>
          </div>

          <div
            className={classNames("section-additional__right-side", {
              "card-block": isCard,
            })}
          >
            {!isCard && isDefaultPaymentMethod && (
              // bank account default payment method
              <Checkbox {...defaultMethod} className="mb-4" isReversed>
                Preferred payment method
              </Checkbox>
            )}


            <Button
              size="large"
              theme="white"
              isLoading={isRemoving}
              onClick={() => onRemove(data)}
            >
              Remove
            </Button>
            {isCard && (
              <Button size="large" className="ml-3" onClick={() => handleUpdateCard(data)}>
                Update Card
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
