import React, { useEffect } from "react";
import { Select, Pagination, DatePicker, RiseLoader } from "components";
import { RouteComponentProps, useLocation } from "@reach/router";
import { parse } from "query-string";
import { useInput } from "hooks";
import { InvoicesTable } from "./invoiceTable/InvoicesTable";
import { DashboardLayout } from "apps/client/layouts";
import { useAuthContext } from "contexts";
import { getInvoices } from "api";
import { useQuery } from "react-query";
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

export const InvoicesPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const location = useLocation();
    
    const getFilterValue = () => {
      let searchValue = parse(location.search)?.filter;
      if (Array.isArray(searchValue)) {
        searchValue = searchValue[0];
      }
      const newValue = searchValue || filterData[0].id || "";
      return newValue === "all" ? "" : newValue;
    }
    
    const filterBy = useInput(getFilterValue());
    const dateRange = useInput("all");
    const startDate = useInput("");
    const endDate = useInput("");
    const { userId } = useAuthContext();
    const page = useInput(0);
    
    const { isLoading, isError, error, data, refetch } = useQuery<
      { results: any[]; count: number },
      Error
    >(
      ["client-invoices", page.value, userId, filterBy.value],
      () =>
        getInvoices({
          page: page.value,
          client: userId,
          status: filterBy.value,
        }),
      {
        keepPreviousData: true,
      }
    );

    useEffect(() => {
      const newFilter = getFilterValue();
      if (newFilter !== filterBy.value)
        filterBy.onChange(newFilter)
    }, [location.search])

    return (
      <DashboardLayout tab="Invoices & Payments">
        <div className="client-matters-page">
          <div className="client-matters-page__top">
            <Select
              data={filterData}
              {...filterBy}
              label="Filter by"
              className="my-auto"
            />
            <Select data={sortData} {...dateRange} className="ml-2 my-auto" />
            {dateRange.value === "custom" && (
              <>
                <DatePicker
                  className="ml-3 my-auto"
                  placeholder="Select Start Date"
                  {...startDate}
                />
                <DatePicker
                  className="ml-3 my-auto"
                  placeholder="Select End Date"
                  {...endDate}
                />
              </>
            )}
          </div>
          <div className="client-matters-page__content">
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
        </div>
      </DashboardLayout>
    );
  };
