import React, { useState, FC } from "react";
import numeral from "numeral";
import { Tag, Button } from "components";
import ArrowImg from "assets/icons/arrow_right.svg";
import {payInvoice} from "api";
import {useCommonUIContext} from "contexts";
import {Link} from "@reach/router"
import "./../style.scss";

interface IProps {
  data: {
    amount: number;
    due_date: string;
    invoice_form: string;
    id: number;
    invoice_id: any;
    invoice_from: string;
    status: any;
  }
}

export const UpcomingBill: FC<IProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showErrorModal } = useCommonUIContext();

  const handleClick = async  () => {
    setIsLoading(true)
    try {
      const res:any = await payInvoice(data?.id);
      if (res?.status !== 200)
        showErrorModal("Error", res);
    } catch (error) {
      showErrorModal("Error", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="upcoming-bill">
      <Link to={`/client/overview/invoice/${data.id}`}
        className="upcoming-bill__card-link"
      >
        <div className="d-flex justiy-content-between">
          <div>
            <div className="upcoming-bill__name">{data?.invoice_from}</div>
            <div className="upcoming-bill__detail">
              <span>INVOICE #: &nbsp;</span>
              <span>{data?.invoice_id}</span>
            </div>
          </div>
          <img src={ArrowImg} className="upcoming-bill__arrow" alt="arrow" />
        </div>
        <div className="upcoming-bill__cost">
          {numeral(data?.amount).format("$0,0.00")}
        </div>
        <div className="d-flex">
          {data?.status === "due" ? (
            <div className="text-gray mr-1">DUE</div>
          ) : (
            <Tag className="status" type={data?.status} />
          )}
          <span className="ml-1 upcoming-bill__detail">{data?.due_date}</span>
        </div>
      </Link>
      <Button onClick={handleClick}
              theme="green"
              className="mt-2"
              disabled={isLoading}
              isLoading={isLoading}>
        Make Payment
      </Button>
    </div>
  );
};
