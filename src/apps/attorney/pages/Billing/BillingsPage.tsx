import React, {useEffect, useState} from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import {
  SearchBar,
  Select,
  Button,
  Pagination,
  DatePicker,
  RiseLoader,
} from "components";
import styled from "styled-components";
import { useInput, useModal } from "hooks";
import { AddTimeEntry, AddExpenseEntry, InvoiceModal } from "modals";
import { BillingsTable } from "./components/BillingsTable";
import { getBillings } from "api";
import { AttorneyLayout } from "apps/attorney/layouts";
import CloseImg from "assets/icons/close_white.svg";
import { useQuery } from "react-query";
import { subDays, format } from "date-fns";
import { useCommonUIContext, useAuthContext } from "contexts";
import numeral from "numeral";
import "./style.scss";

const filterData = [
  {
    title: "All entries",
    id: "",
  },
  {
    title: "Time entries",
    id: "time",
  },
  {
    title: "Expense entries",
    id: "expense",
  },
];
const billableData = [
  {
    title: "All",
    id: "",
  },
  {
    title: "Billable",
    id: true,
  },
  {
    title: "Non-billable",
    id: false,
  },
];
const dateRangeData = [
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

export const BillingsPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const search = useInput("");
    const page = useInput(0);
    const filter = useInput(filterData[0].id);
    const billable = useInput(billableData[0].id);
    const dateRange = useInput(dateRangeData[0].id);
    const startDate = useInput("");
    const endDate = useInput("");
    const openExpenseModal = useModal();
    const openTimeModal = useModal();
    const invoiceModal = useModal();
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [sorting, setSorting] = useState("");
    const { showAlert } = useCommonUIContext();
    const { userType } = useAuthContext();

    const handleCreateInvoice = () => {
      if (
        selectedItems
          .map((a) => a?.client)
          .every((item, i, arr) => item === arr[0])
      ) {
        invoiceModal.setOpen(true);
      } else {
        showAlert("Error", "Selected billing items should be tagged to the same client");
      }
    };

    const handleChangeSelectedItems = (params: any) => {
      if (selectedItems.map((a) => a?.id).includes(params?.id)) {
        setSelectedItems(selectedItems.filter((a) => a?.id !== params?.id));
      } else {
        setSelectedItems([...selectedItems, params]);
      }
    };
    const clearAllSelections = () => {
      setSelectedItems([]);
    };

    // reset page to 0 if change range date
    useEffect(() => {
        page.onChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate.value, endDate.value, dateRange.value]);

    const { isLoading, isError, error, data, refetch } = useQuery<
      { results: any[]; count: number; total_fees; total_time },
      Error
    >(
      [
        "billings",
        page.value,
        search.value,
        billable.value,
        dateRange.value,
        startDate.value,
        endDate.value,
        filter.value,
        sorting,
      ],
      () =>
        getBillings({
          page: page.value,
          search: search.value,
          billing_type: filter.value,
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
          isBillable: billable.value,
          ordering: sorting,
        }),
      {
        keepPreviousData: true,
      }
    );

    return (
      <AttorneyLayout title="Billing Items" userType={userType}>
        <div className="billings-page__bar">
          <div className="d-flex mt-3">
            <div className="billings-page__bar-input">
              <SearchBar
                {...search}
                icon="search"
                placeholder="Search in billing items"
              />
            </div>
            <Button
              onClick={() => openExpenseModal.setOpen(true)}
              type="outline"
              className="ml-auto my-auto"
            >
              Add Expense
            </Button>
            <Button
              onClick={() => openTimeModal.setOpen(true)}
              type="outline"
              className="ml-2 my-auto"
            >
              Add Time
            </Button>
          </div>
          <div className="d-flex flex-wrap mb-2 mt-3">
            <Select
              label="Filter by"
              className="mr-3 my-auto"
              data={filterData}
              width={150}
              {...filter}
            />
            <Select
              label="Billable"
              className="my-auto"
              data={billableData}
              width={150}
              {...billable}
            />
            <Select
              className="ml-3 my-auto"
              data={dateRangeData}
              width={180}
              {...dateRange}
            />
            {dateRange.value === "custom" && (
              <>
                <DatePicker
                  className="ml-3"
                  placeholder="Select Start Date"
                  onChange={value => {
                    page.onChange(0);
                    startDate.onChange(value);
                  }}
                  value={startDate.value}
                />
                <DatePicker
                  className="ml-3"
                  placeholder="Select End Date"
                  onChange={value => {
                    page.onChange(0);
                    endDate.onChange(value);
                  }}
                  value={endDate.value}
                />
              </>
            )}
          </div>
        </div>
        <div className="billings-page__content">
          {isLoading ? (
            <div className="my-auto d-flex">
              <RiseLoader />
            </div>
          ) : isError ? (
            <div>Error: {error?.message}</div>
          ) : data?.results && data?.results?.length > 0 ? (
            <>
              <BillingsTable
                data={data.results}
                checkedValues={selectedItems}
                onCheck={handleChangeSelectedItems}
                onDelete={() => refetch()}
                onSort={setSorting}
              />
              <Summary hours={data?.total_time} amount={data?.total_fees} />
              <Pagination
                className="mt-auto"
                tatalCount={data?.count}
                {...page}
              />
            </>
          ) : (
            <>
              <p className="mx-auto my-auto text-center text-gray">
                You currently don't have any billing items.
              </p>
            </>
          )}
        </div>
        {
          openExpenseModal?.open &&
          <AddExpenseEntry {...openExpenseModal} onCreate={() => refetch()} />
        }
        {
          openTimeModal?.open &&
          <AddTimeEntry {...openTimeModal} onCreate={() => refetch()} />
        }
        {selectedItems.length > 0 && (
          <SelectedBar>
            <img
              src={CloseImg}
              alt="close"
              className="close cursor-pointer mr-3"
              onClick={clearAllSelections}
            />
            <div className="my-auto">
              {selectedItems.length} Billing items selected
            </div>
            <Button
              className="ml-auto my-auto"
              onClick={handleCreateInvoice}
              theme="yellow"
            >
              Create Invoice
            </Button>
          </SelectedBar>
        )}
        {
          invoiceModal?.open &&
          <InvoiceModal
            {...invoiceModal}
            defaultBilling={selectedItems.map((billing) => ({
              ...billing,
              matter: +billing.matter,
              client: +billing.client,
            }))}
            matter={
              selectedItems.length > 0 ? +selectedItems[0]?.matter : undefined
            }
            client={
              selectedItems.length > 0 ? +selectedItems[0]?.client : undefined
            }
            onCreate={() => navigate(`/${userType}/invoices`)}
          />
        }
      </AttorneyLayout>
    );
  };

const SelectedBar = styled.div`
  height: 80px;
  background: #0d4925;
  width: calc(100vw - 280px);
  display: flex;
  position: fixed;
  right: 0;
  top: 0;
  padding: 0 40px;
  color: white;
  font-size: 18px;
  .close {
    width: 12px;
  }
`;

const Summary = ({ hours, amount }) => {
  return (
    <div className="billings-page__table-row table-row-summary mb-4">
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item">
        <span className="billings-page__table-row-item__label total-hours mr-2">Total Hours</span>
        {hours}
      </div>
      <div className="billings-page__table-row-item "/>
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item" />
      <div className="billings-page__table-row-item ">
        <span className="mr-2">Total Amount</span>
        {numeral(amount || 0).format("$0,0.00")}
      </div>
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item"/>
      <div className="billings-page__table-row-item"/>
    </div>
  );
};

