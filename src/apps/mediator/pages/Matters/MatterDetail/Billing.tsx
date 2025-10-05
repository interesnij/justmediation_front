import React, { useState } from "react";
import {
  SearchBar,
  Select,
  Button,
  Pagination,
  DatePicker,
  RiseLoader,
} from "components";
import { useInput, useModal } from "hooks";
import { AddTimeEntry, AddExpenseEntry, InvoiceModal } from "modals";
import { BillingsTable } from "./billingTable/BillingsTable";
import { getBillings } from "api";
import { useParams } from "@reach/router";
import { useQuery } from "react-query";
import CloseImg from "assets/icons/close_white.svg";
import styled from "styled-components";
import { MATTERS_PER_PAGE } from "config";
import numeral from "numeral";
import { subDays, format } from "date-fns";
import { useCommonUIContext } from "contexts";

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

export default function BillingsPage({ matterData }) {
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
  const [sorting, setSorting] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const params = useParams();
  const { showAlert } = useCommonUIContext();

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

  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number; total_fees; total_time },
    Error
  >(
    [
      "matter-billings",
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
        matter: params.id,
        pageSize: MATTERS_PER_PAGE,
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
    <div className="flex-1 d-flex flex-column">
      <div className="client-matters-page__top d-flex mb-3">
        <div className="billings-page__bar-input">
          <SearchBar
            icon="search"
            placeholder="Search in billing items"
            {...search}
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

      <div className="d-flex flex-wrap mb-3">
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
          width={120}
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

      <div className="client-matters-page__content flex-1 d-flex flex-column">
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
              handleDelete={() => refetch()}
              onUpdate={() => refetch()}
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
        <AddExpenseEntry
          {...openExpenseModal}
          onCreate={() => refetch()}
          matter={params.id}
          client={matterData?.client}
        />
      }
      {
        openTimeModal?.open &&
        <AddTimeEntry
          {...openTimeModal}
          onCreate={() => refetch()}
          matter={params.id}
          client={matterData?.client}
        />
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
            {selectedItems.length} Billing item selected
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
          defaultBilling={selectedItems}
          {...invoiceModal}
          matter={params.id}
          client={matterData?.client}
        />
      }
    </div>
  );
}

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
    <SummaryContainer className="billings-page__table-row">
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item my-auto">Total Hours</div>
      <div className="billings-page__table-row-item my-auto">{hours}</div>
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item text-right my-auto">
        Total Amount
      </div>
      <div className="billings-page__table-row-item my-auto">
        {numeral(amount || 0).format("$0,0.00")}
      </div>
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item"></div>
      <div className="billings-page__table-row-item"></div>
    </SummaryContainer>
  );
};

const SummaryContainer = styled.div`
  display: flex;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 4px;
  height: 40px;
  background: white;
  color: #2e2e2e;
  font-size: 12px;
  margin-bottom: 30px;
`;
