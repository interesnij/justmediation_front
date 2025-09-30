import React, {useState, useEffect} from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { RiseLoader} from "components";
import CloseIcon from "assets/icons/close.svg";
import {cancelSubscription, reactivateSubscriptionPlan} from "api";
import {useCommonUIContext} from "contexts";
import CheckmarkIcon from "assets/icons/check_circle.svg";
import CancelIcon from "assets/icons/cancel.svg";
import moment from "moment";
import "./style.scss"

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onOk?(): void;
  data: any;
}

export const CancelSubscriptionModal = ({
    open,
    setOpen,
    onOk = () => {},
    data
  }: Props) => {
  const {showErrorModal} = useCommonUIContext();
  const [isLoading, setIsLoading] = useState(false);
  const expired = data?.next_subscription_data?.current_period_end
  const isAnnually = data?.next_subscription_data?.plan_data?.interval === "year";

  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await reactivateSubscriptionPlan();
      await cancelSubscription();
      onOk();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      showErrorModal("Error", error);
      setIsLoading(false);
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
    return () => {
    };
  }, [open]);

  return (
    <div className={classNames("alert-control-container cancel-subscription", {open})}>
      <div ref={ref} tabIndex={-1} className="alert-control">
        <div className="alert-control__header">
          <div className="cancel-subscription__title">Cancel Subscription</div>
          <button className="cancel-subscription__close-btn" onClick={() => setOpen(false)}>
            <img
              className="my-auto ml-auto close"
              src={CloseIcon}
              alt="close"
            />
          </button>
        </div>
        <div className="alert-control__content">
          {isLoading ? (
            <RiseLoader className="my-4"/>
          ) : (
            <>
              <div className={
                classNames("cancel-subscription__warning", {
                  "is-annually": isAnnually, "is-monthly": !isAnnually
                })}>
                If you choose to cancel your subscription,
                you will lose full access to your dashboard when your current
                subscription expires on <strong>{moment(expired).format("MMM DD, YYYY")}</strong>.
              </div>
              <div className="cancel-subscription__chapter">
                <h5 className="cancel-subscription__chapter-title">
                  As an unsubscriber, you will lose the following:
                </h5>
                <ul className="cancel-subscription__list warning-list">
                  <li><img className="cancel-subscription__icon"
                           src={CancelIcon}
                           alt="icon" />
                    Access to Notifications, Chats, Billing Items, Potential Engagements, Jus Law News, and Forums.
                  </li>
                  <li><img className="cancel-subscription__icon"
                           src={CancelIcon}
                           alt="icon" />
                    You can no longer add or edit items related to your matters, folders, documents, invoices, billing items, contacts, messages, and notes.</li>
                  <li><img className="cancel-subscription__icon"
                           src={CancelIcon}
                           alt="icon" />
                    Your profile will be removed from the JustLaw database and you will no longer be able to submit proposals to JustLaw client users and your profile will be removed from the database and clients will no longer be able to search or view your profile.</li>
                  <li><img className="cancel-subscription__icon"
                           src={CancelIcon}
                           alt="icon" />
                    Existing Jus Law clients will no longer be able to contact you through our platform.</li>
                </ul>
              </div>
              <div className="cancel-subscription__chapter">
                <h5 className="cancel-subscription__chapter-title">
                  As an unsubscriber, you can still:
                </h5>
                <ul className="cancel-subscription__list success-list">
                  <li><img className="cancel-subscription__icon"
                           src={CheckmarkIcon}
                           alt="icon" /> View existing Documents, Leads & Clients, Industry Contacts, and Invoices.</li>
                  <li><img className="cancel-subscription__icon"
                           src={CheckmarkIcon}
                           alt="icon" /> Access Settings and its secondary pages.</li>
                </ul>
              </div>

              <div className="cancel-subscription__footer">
                To cancel your subscription to Jus Law, please contact support at:<br/>
                <a href="mailto:support@justlaw.com">support@justlaw.com</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
