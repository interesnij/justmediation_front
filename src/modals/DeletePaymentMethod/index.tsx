import React from "react";
import {DeleteConfirmationModal} from "modals";
import {LazyLoadImage} from "react-lazy-load-image-component";
import CardImg from "../../assets/images/card_visa.png";

export const DeletePaymentMethod = ({activeCard, handleDelete, modalProps}) => {
  return (
    <DeleteConfirmationModal
      {...modalProps}
      containerClassName="fit-content"
      title="Are you sure you want to remove this payment method?"
      message=""
      children={
        <div>
          <div className="align-items-center justify-content-center">
            <LazyLoadImage
              alt="img"
              wrapperClassName="align-items-center mr-2"
              src={CardImg}
              style={{display: 'flex'}}
            />
            <span>
              {
                activeCard?.card?.generated_from
                || activeCard?.card?.brand
                || "Card"
              }
            </span>
            <span className="mx-1">Checking</span>
            <span>****{activeCard?.card?.last4}</span>
          </div>
          <p>Any pending payments on this account will be processed even after you remove it.</p>
        </div>
      }
      onDelete={handleDelete}
      buttonConfirmText="Remove"
    />
  )
}