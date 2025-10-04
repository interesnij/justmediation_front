import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { SearchBar, Select, Button, Pagination } from "components";
import { useInput, useModal } from "hooks";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import { LeadsTable } from "./components/LeadsTable";
import { MediatorLayout } from "apps/mediator/layouts";
import { NewContactModal } from "modals";
import { useQuery } from "react-query";
import { css } from "@emotion/react";
import RiseLoader from "react-spinners/RiseLoader";
import { getLeadClients } from "api";
import "./style.scss";
const filterData = [
  {
    title: "All",
    id: "All",
  },
  {
    title: "Leads",
    id: "lead",
  },
  {
    title: "Clients",
    id: "client",
  },
  {
    title: "Pending",
    id: "pending",
  },
];
export const LeadsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { hasSubscription } = useContextSubscriptionAccess();
  const filter = useInput(filterData[0].id);
  const contactModal = useModal();
  const page = useInput(0);
  const search = useInput("");
  const { userId, userType, profile } = useAuthContext();
  const [sorting, setSorting] = useState("");

  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    ["leads_clients", page.value, search.value, sorting, filter],
    () =>
      getLeadClients(userId, userType, profile.role, {
        page: page.value,
        pageSize: 10,
        search: search.value,
        ordering: sorting,
        type: filter.value
      }),
    {
      keepPreviousData: true,
    }
  );

  const handleNewContact = () => {
    contactModal.setOpen(true);
  };

  return (
    <MediatorLayout title="Leads & Clients" userType={userType}>
      <div className="leads-page__bar">
        <div className="leads-page__bar-input">
          <SearchBar
            icon="search"
            {...search}
            placeholder="Search in Leads & Clients"
          />
        </div>
        <Select
          label="Type"
          className="leads-page__bar-filter"
          data={filterData}
          width={120}
          {...filter}
        />
        {hasSubscription &&
          <Button
            icon="plus"
            className="ml-auto my-auto"
            onClick={handleNewContact}>
            New Contact
          </Button>
        }
      </div>
      <div className="leads-page__content">
        {isLoading ? (
          <div className="my-4 d-flex">
            <RiseLoader
              size={15}
              margin={2}
              color="rgba(0,0,0,.6)"
              css={css`
                display: block;
                margin: 200px auto;
              `}
            />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <LeadsTable
              data={data?.results}
              onUpdate={() => refetch()}
              onSort={setSorting}
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
              No leads and clients.
            </p>
            {/* <Button
              icon="plus"
              onClick={() => {
                contactModal.setOpen(true);
              }}
              className="mx-auto mt-1 mb-auto"
            >
              New Contact
            </Button> */}
          </>
        )}
      </div>
      {
        contactModal?.open &&
        <NewContactModal {...contactModal} onAdd={() => refetch()} />
      }
    </MediatorLayout>
  );
};
