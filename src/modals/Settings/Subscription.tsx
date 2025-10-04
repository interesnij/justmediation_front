import React, {useState} from "react";
import {Button, Folder, FolderItem,  RiseLoader, PaymentMethodCard} from "components";
import {getCurrentSubscriptionProfile, getPaymentMethod, removePaymentMethod} from "api";
import {useQuery} from "react-query";
import {useModal} from "hooks";
import {
  ChangeSubscriptionModal,
  CancelSubscriptionModal,
  AddCardModal,
  UpdatePaymentCard,
  DeletePaymentMethod
} from "modals";
import {SubscriptionHeaderSubscribed} from "./components/SubscriptionHeaderSubscribed";
import {SubscriptionHeaderUnsubscribed} from "./components/SubscriptionHeaderUnsubscribed"
import {format} from "date-fns";
import {useCommonUIContext, useContextSubscriptionAccess, useAuthContext} from "contexts";
import {SubscriptionAdd} from "./components/subscriptions/Subscription";
import styled from "styled-components";

export const Subscription = () => {
  const { showErrorModal } = useCommonUIContext();
  const { hasSubscription, unsubscribed } = useContextSubscriptionAccess();
  const { userType } = useAuthContext()
  const changeModal = useModal();
  const cancelModal = useModal();
  const paymentModal = useModal();
  const confirmDeleteModal = useModal();
  const updateModal = useModal();
  const chooseModal = useModal();
  const [activeCard, setActiveCard] = useState<any | null>(null);

  const {isLoading, isError, error, data, refetch} = useQuery<any, Error>(
    ["subscription-profile"],
    () => getCurrentSubscriptionProfile(),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: isLoadingPaymentMethods,
    data: dataPaymentMethods,
    refetch: refetchPaymentMethods
  } = useQuery<any, Error>(
    ["client-payment"],
    () => getPaymentMethod(),
    {
      keepPreviousData: true,
    }
  );

  const isCancelled: boolean = data?.subscription_data?.cancel_at_period_end;

  const handleCancelSubscription = async () => {
    cancelModal.setOpen(true);
  };

  const handleChangeSubscription = () => {
    changeModal.setOpen(true);
  };

  const handleChooseSubscription = () => chooseModal.setOpen(true)

  const handleUpdateCard = (data) => {
    setActiveCard(data)
    updateModal.setOpen(true);
  };

  const handleAddCard = () => {
    paymentModal.setOpen(true);
  };

  const showConfirmDeleteModal = card => {
    confirmDeleteModal.setOpen(true);
    setActiveCard(card);
  }

  const handleDelete = async () => {
    try {
      await removePaymentMethod(activeCard?.id);
      await refetch();
      await refetchPaymentMethods()
    } catch (error) {
      showErrorModal("Error", error);
    } finally {
      await confirmDeleteModal.setOpen(false)
      setActiveCard(null);
    }
  }

  return (
    <div className="settings">
      <Folder label="Current Subscription" className="jumbo">
        <FolderItem>
          { userType === "enterprise" ? (
          <div>
            <div className="text-lg-black">Enterprise Subscription</div>
            <div className="mt-2 text-dark">You are on the Enterprise subscription for Law Firm users</div>
          </div>
          ) : isLoading ? (
            <RiseLoader className="my-4"/>
          ) : isError ? (
            <div>{error}</div>
          ) : (
            <>
              {hasSubscription && <SubscriptionHeaderSubscribed
                  data={data}
                  handleChangeSubscription={handleChangeSubscription}
              />}
              {!hasSubscription && <SubscriptionHeaderUnsubscribed
                  data={data}
                  handleChooseSubscription={handleChooseSubscription}
              />}
            </>
          )}
        </FolderItem>
      </Folder>
      { userType === "mediator" ? (
    <div>
      <Folder
        label="Cards"
        className="mb-4 mt-4"
        headerComponent={<Button onClick={handleAddCard}>Add Card</Button>}
      >
        {(isLoadingPaymentMethods || isLoading) ? (
          <FolderItem>
            <RiseLoader className="my-4"/>
          </FolderItem>
        ) : isError ? (
          <div className="my-4">{error}</div>
        ) : dataPaymentMethods && dataPaymentMethods.length > 0 ? (
          dataPaymentMethods.map((item, index) => (
            <FolderItem key={`${index}key`}>
              <PaymentMethodCard
                isCard
                isConfirmedAccount={true}
                isDefaultPaymentMethod={true}
                data={item}
                onRemove={showConfirmDeleteModal}
                handleUpdateCard={handleUpdateCard}
              />
            </FolderItem>
          ))
        ) : (
          <FolderItem>
            <div className="my-4 text-center">No Cards</div>
          </FolderItem>
        )}
      </Folder>
      <Folder label="Billing History" className="jumbo mt-3">
        {isLoading ? (
          <FolderItem>
            <RiseLoader className="my-4"/>
          </FolderItem>
        ) : isError ? (
          <div>{error}</div>
        ) : (
          <>
            <FolderItem>
              <div className="row">
                <div className="col md-4">
                  <span className="desc">
                    {data?.billing_item?.current_invoice?.date
                      ? format(
                        new Date(data?.billing_item?.current_invoice?.date),
                        "MMM dd, yyyy"
                      )
                      : ""}
                  </span>
                </div>
                <div className="col md-8 d-flex justify-content-between">
                  <span className="label">
                    ${data?.billing_item?.current_invoice?.amount}
                  </span>
                  <a target="_blank"
                     rel="noreferrer"
                     href={data?.billing_item?.next_invoice?.link}
                     className="text-gray cursor-pointer">Invoice</a>
                </div>
              </div>
            </FolderItem>
            {data?.billing_item?.next_invoice?.date && (
              <FolderItem>
                <div className="row">
                  <div className="col md-4">
                    <span className="desc">
                      {data?.billing_item?.next_invoice?.date
                        ? format(
                          new Date(data?.billing_item?.next_invoice?.date),
                          "MMM dd, yyyy"
                        )
                        : ""}
                    </span>
                  </div>
                  <div className="col md-8 d-flex justify-content-between">
                    <span className="label">
                      ${data?.billing_item?.next_invoice?.amount}
                    </span>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={data?.billing_item?.next_invoice?.link}
                      className="text-gray cursor-pointer"
                    >
                        Invoice
                    </a>
                  </div>
                </div>
              </FolderItem>
            )}
          </>
        )}
      </Folder>
      {hasSubscription && (
        <div className="d-flex">
          <div
            className="ml-auto mt-2 text-gray cursor-pointer font-size-md"
            onClick={handleCancelSubscription}
          >
            Cancel subscription
          </div>
        </div>
      )}
      {data && (
        <>
          {
            changeModal?.open &&
            <ChangeSubscriptionModal
              {...changeModal}
              onUpdate={() => refetch()}
              plan={
                data?.next_subscription_data
                  ? data?.next_subscription_data?.plan_data?.id
                  : data?.subscription_data?.plan_data?.id
              }
            />
          }
          {
            cancelModal?.open &&
            <CancelSubscriptionModal {...cancelModal} data={data} onOk={() => refetch()} />
          }
          {
            paymentModal?.open &&
              <AddCardModal {...paymentModal} onCreate={() => refetch()} />
          }
        </>
      )}
      {
        chooseModal?.open && <SubscriptionAdd {...chooseModal} />
      }
      {confirmDeleteModal?.open &&
        <DeletePaymentMethod
          modalProps= {confirmDeleteModal}
          handleDelete={handleDelete}
          activeCard={activeCard}
        />
      }
      {updateModal?.open &&
        <UpdatePaymentCard
          {...updateModal}
          onCreate={() => refetch()}
          data={activeCard}
        />
      }
    </div>
    ) : (
      <TeamContact className="mt-4 justify-content-between align-items-center px-5 rounded">
        <div>
          <div className="text-lg-black">Contact Us</div>
          <div className="mt-2 text-dark">For help and support with your subscription plan and billing questions, contact our support team.</div>
        </div>
        <Button type="outline">
            Contact Support
        </Button>
      </TeamContact>
      )}
    </div>
  );
};

const TeamContact = styled.div`
  background: white;
  padding:24px 40px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-shadow: inset 0px -1px 0px #dcdcdc;
`;