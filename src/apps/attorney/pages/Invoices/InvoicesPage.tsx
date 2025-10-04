import React, { useState, useEffect } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import { parse } from "query-string";
import {
  Select,
  SearchBar,
  Button,
  Pagination,
  DatePicker,
  RiseLoader,
} from "components";
import { MediatorLayout } from "apps/mediator/layouts";
import { InvoiceModal } from "modals";
import { useInput, useModal } from "hooks";
import { InvoicesTable } from "./components/InvoicesTable";
import { getInvoices } from "api";
import { useQuery } from "react-query";
import { subDays, format } from "date-fns";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import "./style.scss";

const filterData = [
  {
    title: "All",
    id: "",
  },
  {
    title: "Draft",
    id: "draft",
  },
  {
    title: "Open",
    id: "open",
  },
  {
    title: "Overdue",
    id: "overdue",
  },
  {
    title: "Paid",
    id: "paid",
  },
  {
    title: "Voided",
    id: "voided",
  },
];
const customDateRangeData = [
  {
    title: "All Time",
    id: "all",
  },
  {
    title: "Last 7 days",
    id: "7days",
  },
  {
    title: "Last 30 days",
    id: "30days",
  },
  {
    title: "Custom Date Range",
    id: "custom",
  },
];

export const InvoicesPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { userType } = useAuthContext();
    const { hasSubscription } = useContextSubscriptionAccess()
    const page = useInput(0);
    const location = useLocation();

    const getFilterValue = () => {
      let searchValue = parse(location.search)?.filter;
      if (Array.isArray(searchValue)) {
        searchValue = searchValue[0];
      }
      const newValue = searchValue || filterData[0].id || "";
      return newValue === "all" ? "" : newValue;
    }

    const filter = useInput(getFilterValue());
    const dateRange = useInput("all");
    const startDate = useInput("");
    const endDate = useInput("");
    const openCreateInvoice = useModal();
    const [sorting, setSorting] = useState("");
    const [invoiceId, setInvoiceId] = useState(0);
    const { isLoading, isError, error, data, refetch } = useQuery<
      { results: any[]; count: number },
      Error
    >(
      [
        "invoices",
        page.value,
        filter.value,
        dateRange.value,
        startDate.value,
        endDate.value,
        sorting,
      ],
      () =>
        getInvoices({
          page: page.value,
          status: filter.value,
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

    useEffect(() => {
      const newFilter = getFilterValue();
      if (newFilter !== filter.value)
        filter.onChange(newFilter)
    }, [location.search])

    return (
      <MediatorLayout title="Invoices" userType={userType}>
        <div className="invoices-page__bar">
          <div className="d-flex flex-wrap justify-content-between mt-3 mb-2">
            <div className="d-flex flex-wrap ">
              <Select
                label="Filter by"
                className="my-auto"
                data={filterData}
                width={160}
                {...filter}
              />
              <Select
                className="invoices-page__bar-filter ml-3"
                data={customDateRangeData}
                width={180}
                {...dateRange}
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
            {hasSubscription && <Button
                onClick={() => {
                  setInvoiceId(0);
                  openCreateInvoice.setOpen(true)
                }}
                className="ml-2 my-auto"
            >
                Create Invoice
            </Button>}
          </div>
        </div>
        <div className="invoices-page__content">
          {isLoading ? (
            <div className="my-auto d-flex">
              <RiseLoader />
            </div>
          ) : isError ? (
            <div>Error: {error?.message}</div>
          ) : data?.results && data?.results?.length > 0 ? (
            <>
              <InvoicesTable
                data={data.results}
                onUpdate={() => refetch()}
                onSort={setSorting}
                openEdit={id => {
                  setInvoiceId(id);
                  openCreateInvoice.setOpen(true)
                }}
                userType={userType}
              />
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
            onCreate={() => refetch()}
            invoiceId={invoiceId} 
          />
        }
      </MediatorLayout>
    );
  };
