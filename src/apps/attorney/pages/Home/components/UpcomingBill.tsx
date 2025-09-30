import React from "react";
import { Tag, Button } from "components";
import ArrowImg from "assets/icons/arrow_right.svg";
import "./../style.scss";
export const UpcomingBill = () => {
  return (
    <div className="upcoming-bill">
      <div className="d-flex justiy-content-between">
        <div>
          <div className="upcoming-bill__name">Expense Report</div>
          <div className="upcoming-bill__detail">
            <span>INVOICE #: &nbsp;</span>
            <span>AO5434Db8-01</span>
          </div>
        </div>
        <img src={ArrowImg} className="upcoming-bill__arrow" alt="arrow" />
      </div>
      <div className="upcoming-bill__cost">$950.25</div>
      <div className="d-flex">
        <Tag type="overdue" />
        <span className="ml-1 upcoming-bill__detail">11/05/20</span>
      </div>
      <Button theme="green" className="mt-2">
        Make Payment
      </Button>
    </div>
  );
};
