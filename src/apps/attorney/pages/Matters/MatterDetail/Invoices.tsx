import React from "react";
import {
  Select,
  Pagination,
  DatePicker,
  RiseLoader,
  SearchBar,
  Button,
} from "components";
import { useInput, useModal } from "hooks";
import { InvoicesTable } from "./invoiceTable/InvoicesTable";
import { getInvoices } from "api";
import { useQuery } from "react-query";
import { useParams } from "@reach/router";
import { InvoiceModal } from "modals";

const filterData = [
  {
    title: "All",
    id: "All",
  },
  {
    title: "Paid",
    id: "paid",
  },
  {
    title: "Unpaid",
    id: "unpaid",
  },
  {
    title: "Voided",
    id: "voided",
  },
];
const sortData = [
  {
    title: "All Time",
    id: "all",
  },
  {
    title: "Last 7 Days",
    id: "7days",
  },
  {
    title: "Last 30 Days",
    id: "30days",
  },
  {
    title: "Custom Date Range",
    id: "custom",
  },
];

export default function InvoicesPage({ matterData }) {
  const page = useInput(0);
  const filterBy = useInput(filterData[0].id);
  const dateRange = useInput(sortData[0].id);
  const startDate = useInput("");
  const endDate = useInput("");
  const params = useParams();
  const openCreateInvoice = useModal();
  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    ["matter-invoices", page.value],
    () =>
      getInvoices({
        page: page.value,
        matter: params.id
      }),
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="d-flex flex-column flex-1">
      <div className="client-matters-page__top justify-content-between mb-3">
        <div className="d-flex">
          <Select
            data={filterData}
            {...filterBy}
            label="Filter by"
            className="my-auto"
          />

          <Select data={sortData} {...dateRange} className="ml-4 my-auto" />
          {dateRange.value === "custom" && (
            <>
              <DatePicker
                className="ml-3"
                placeholder="Select Start Date"
                {...startDate}
              />
              <DatePicker
                className="ml-3"
                placeholder="Select End Date"
                {...endDate}
              />
            </>
          )}
        </div>
        <Button
          onClick={() => openCreateInvoice.setOpen(true)}
          className="ml-2 my-auto"
          type="outline"
        >
          Create Invoice
        </Button>
      </div>
      <div className="client-matters-page__content d-flex flex-column flex-1">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <InvoicesTable data={data.results} onUpdate={() => refetch()} />
            <Pagination
              className="mt-auto"
              tatalCount={data?.count}
              {...page}
            />
          </>
        ) : (
          <>
            <p className="mx-auto my-auto text-center text-gray">
              You currently don't have any invoices.
            </p>
          </>
        )}
      </div>
      {
        openCreateInvoice?.open &&
        <InvoiceModal
          {...openCreateInvoice}
          matter={params.id}
          client={matterData?.client}
          onCreate={() => refetch()}
        />
      }
    </div>
  );
}
