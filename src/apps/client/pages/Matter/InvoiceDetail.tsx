import React from "react";
import styled from "styled-components";
import { Button, RiseLoader } from "components";
import { RouteComponentProps, useParams } from "@reach/router";
import { ClientLayout } from "apps/client/layouts";
import { getInvoiceById, downloadInvoice } from "api";
import { useQuery } from "react-query";
import { getUserName } from "helpers";
import { useBasicDataContext } from "contexts";
import { format } from "date-fns";
import numeral from "numeral";
import "./style.scss";

export const InvoiceDetailPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const params = useParams();
    const { data, isLoading, isError, error } = useQuery<any, Error>(
      ["invoice-detail"],
      () => getInvoiceById(params.id),
      {
        keepPreviousData: true,
      }
    );
    const { currencies } = useBasicDataContext();

    const handleDownload = async () => {
      const url = await downloadInvoice(params.id);
      window.open(url);
    };

    return (
      <ClientLayout
        title="Back to Invoices"
        backUrl="/client/overview/invoices"
      >
        {isLoading ? (
          <RiseLoader className="my-auto" />
        ) : isError ? (
          error
        ) : (
          <div className="p-4">
            <h2>{data?.number}</h2>
            <div className="d-flex">
              <h3 className="my-auto">Summary</h3>
              <Button
                size="normal"
                type="outline"
                className="ml-auto"
                onClick={() => handleDownload()}
              >
                Invoice PDF
              </Button>
            </div>
            <div className="row mb-4 mt-2">
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Billed to</SummaryTitle>
                <div>{getUserName(data?.mediator_data)}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Invoice number</SummaryTitle>
                <div>{data?.invoice_id}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Name</SummaryTitle>
                <div>{getUserName(data?.client_data)}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Due date</SummaryTitle>
                <div>{data?.due_date}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Address</SummaryTitle>
                <div>{`${data?.client_data?.city_data?.name}, ${data?.client_data?.state_data?.name}, ${data?.client_data?.country_data?.name}`}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Billing method</SummaryTitle>
                <div>
                  {data?.payment_method_data &&
                    data?.payment_method_data
                      .map((method) => method?.title)
                      .join(", ")}
                </div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Phone number</SummaryTitle>
                <div>{data?.client_data?.phone}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Memo</SummaryTitle>
                <div>{data?.note}</div>
              </div>
              <div className="col-md-6 d-flex my-1">
                <SummaryTitle>Currency</SummaryTitle>
                <div>
                  {data?.billing_items_data.length > 0
                    ? currencies.find(
                        (item) =>
                          item.id === data?.billing_items_data[0].currency
                      )?.title
                    : ""}
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <Row>
                <div>Type</div>
                <div>Date</div>
                <div>Description</div>
                <div>Rate</div>
                <div>Units</div>
                <div>Billed By</div>
                <div>Total Amount</div>
              </Row>
              {data?.billing_items_data &&
                data?.billing_items_data.map((item, index) => {
                  return (
                    <Row key={`${index}key`}>
                      <div>{index + 1}</div>
                      <div>
                        {item?.created
                          ? format(new Date(item?.created), "MM/dd/yyyy")
                          : ""}
                      </div>
                      <div>{item?.description}</div>
                      <div>${item?.rate}</div>
                      <div>{item?.quantity}</div>
                      <div>{getUserName(item?.billed_by_data)}</div>
                      <div>${item?.fees}</div>
                    </Row>
                  );
                })}

              <SummaryRow className="d-flex mt-3">
                <div>Subtotal</div>
                <div>
                  {numeral(
                    data?.billing_items_data.reduce(
                      (a, b) => ({
                        fees: +a.fees + +b.fees,
                      }),
                      { fees: 0 }
                    ).fees || 0
                  ).format("$0,0.00")}
                </div>
              </SummaryRow>
              <SummaryRow className="d-flex mt-2">
                <div>Tax</div>
                <div>$0</div>
              </SummaryRow>
              <TotalRow className="d-flex mt-3">
                <div>Total</div>
                <div>
                  {numeral(
                    data?.billing_items_data.reduce(
                      (a, b) => ({
                        fees: +a.fees + +b.fees,
                      }),
                      { fees: 0 }
                    ).fees || 0
                  ).format("$0,0.00")}
                </div>
              </TotalRow>
            </div>
            <h3>Recent activities</h3>
            <div className="d-flex flex-column">
              {data?.activities_data &&
                data?.activities_data.map((item, index) => {
                  return (
                    <RecentActivity key={`${index}key`}>
                      <div>{item?.activity}</div>
                      <div className="ml-auto text-right">
                        {item?.created
                          ? format(
                              new Date(item?.created),
                              "MM/dd/yyyy hh:mm:ss a"
                            )
                          : ""}
                      </div>
                    </RecentActivity>
                  );
                })}
            </div>
            <FeeDescription>
              Notes:<br />
              The total is equivalent to the “composite rate.” Composite Rate = Mediator Legal Fees + Separate and Standalone 5% JustMediation Management Fee.
            </FeeDescription>
          </div>
        )}
      </ClientLayout>
    );
  };

const RecentActivity = styled.div`
  display: flex;
  box-shadow: inset 0px -1px 0px #e7e7ed;
  flex: 1;
  width: 100%;
  height: 64px;
  line-height: 64px;
  color: #2e2e2e;
`;
const Row = styled.div`
  display: flex;
  box-shadow: inset 0px -1px 0px #e7e7ed;
  flex: 1;
  width: 100%;
  height: 64px;
  line-height: 64px;
  color: #2e2e2e;

  & > div:nth-child(1) {
    width: 100px;
  }
  & > div:nth-child(2) {
    width: 120px;
    margin-left: 10px;
  }
  & > div:nth-child(3) {
    flex: 1;
    margin-left: 10px;
  }
  & > div:nth-child(4) {
    width: 120px;
    margin-left: 10px;
  }
  & > div:nth-child(5) {
    width: 120px;
    margin-left: 10px;
  }
  & > div:nth-child(6) {
    width: 240px;
    margin-left: 10px;
  }
  & > div:nth-child(7) {
    width: 120px;
    margin-left: 10px;
    text-align: right;
  }
`;

const SummaryRow = styled.div`
  color: #2e2e2e;
  & > div:nth-child(1) {
    margin-left: auto;
    width: 250px;
  }
  & > div:nth-child(2) {
    width: 120px;
    text-align: right;
    margin-right: 60px;
  }
`;
const TotalRow = styled(SummaryRow)`
  color: rgba(0,0,0,.6);
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
`;

const SummaryTitle = styled.div`
  width: 240px;
`;

const FeeDescription = styled.div`
color: #2e2e2e;
margin-top: 20px;
line-height: 24px;
`;