import React, { useState } from "react";
import {
  Select,
  Pagination,
  DatePicker,
  RiseLoader,
  SearchBar,
} from "components";
import { useInput } from "hooks";
import { InvoicesTable } from "./invoiceTable/InvoicesTable";
import { getInvoices } from "api";
import { useQuery } from "react-query";
import { useParams } from "@reach/router";
import { useAuthContext } from "contexts";
import { subDays, format } from "date-fns";
const filterData = [
  {
    title: "All",
    id: "",
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
const dateRangeData = [
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

export default function InvoicesPage() {
  const page = useInput(0);
  const filterBy = useInput("");
  const dateRange = useInput(dateRangeData[0].id);
  const startDate = useInput("");
  const endDate = useInput("");
  const params = useParams();
  const { userId } = useAuthContext();
  const [sorting, setSorting] = useState("");

  const { isLoading, isError, error, data } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    [
      "client-matter-invoices",
      page.value,
      params.id,
      userId,
      filterBy.value,
      dateRange.value,
      startDate.value,
      endDate.value,
      sorting,
    ],
    () =>
      getInvoices({
        page: page.value,
        matter: params.id,
        client: userId,
        status: filterBy.value,
        fromDate:
          dateRange.value === "all"
            ? undefined
            : dateRange.value === "7days"
            ? format(subDays(new Date(), 7), "yyyy-MM-dd")
            : dateRange.value === "30days"
            ? format(subDays(new Date(), 30), "yyyy-MM-dd")
            : startDate.value.toString(),
        toDate:
          dateRange.value === "custom" ? endDate.value.toString() : undefined,
        ordering: sorting,
      }),
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="client-matters-page">
      <div className="client-matters-page__top d-flex mb-3">
        <div className="d-flex">
          <Select
            data={filterData}
            {...filterBy}
            label="Filter by"
            className="my-auto"
          />

          <Select
            data={dateRangeData}
            {...dateRange}
            className="ml-4 my-auto"
          />
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
      </div>
      <div className="client-matters-page__content">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader className="my-4" />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <InvoicesTable data={data.results} onSort={setSorting} />
            <Pagination
              className="mt-auto"
              tatalCount={data?.count}
              {...page}
            />
          </>
        ) : (
          <>
            <p className="mx-auto my-auto text-center my-4 text-gray">
              You currently don't have any invoices.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
