import React, { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { SearchBar, Select, Button, Pagination, RiseLoader } from "components";
import { useInput, useModal } from "hooks";
import { MattersTable } from "./mattersTable/MattersTable";
import { NewMatterModal } from "modals";
import { useQuery } from "react-query";
import { getMatters } from "api";
import { MATTERS_PER_PAGE } from "config";
import {useMatterContext, useAuthContext, useContextSubscriptionAccess} from "contexts";
import "./style.scss";

const filterData = [
  {
    title: "All",
    id: "",
  },
  {
    title: "Open",
    id: "open",
  },
  {
    title: "Closed",
    id: "close",
  },
  {
    title: "Refer Matter",
    id: "referral",
  },
];
const ownershipData = [
  {
    title: "All matters",
    id: "all",
  },
  {
    title: "My matters",
    id: "mine",
  },
  {
    title: "Created by others",
    id: "other",
  },
];
interface IProps  {
  userData: any
}
export const Matters: React.FC<IProps> = ({userData}) => {
  const filter = useInput("");
  const ownership = useInput("all");
  const newMatterModal = useModal();
  const page = useInput(0);
  const search = useInput("");
  const { updateMatters } = useMatterContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  const params = useParams();
  const { userId, userType } = useAuthContext();
  const [sorting, setSorting] = useState("");

  const { isLoading, isError, error, data } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    [
      "lead-matters",
      page,
      search.value,
      params.id,
      filter.value,
      ownership.value,
      sorting,
    ],
    () =>
      getMatters({
        page: page.value,
        pageSize: MATTERS_PER_PAGE,
        search: search.value,
        client: params.id,
        status: filter.value,
        attorney: ownership.value === "mine" ? userId : "",
        shared_with: ownership.value === "other" ? userId : "",
        ordering: sorting,
      }),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    page.onChange(0);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.value]);

  useEffect(() => {
    if (data?.results) {
      updateMatters(data.results);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.results]);

  const isParalegal = !!(userType && ['paralegal', 'other'].indexOf(userType) !== -1);

  return (
    <>
      <div className="matters-page__bar">
        <div className="matters-page__bar-input">
          <SearchBar
            icon="search"
            {...search}
            placeholder="Search in Matters"
          />
        </div>
        <Select
          label="Filter by"
          className="matters-page__bar-filter"
          data={filterData}
          width={120}
          {...filter}
        />
        <Select
          label="Principle"
          className="matters-page__bar-filter"
          data={ownershipData}
          width={180}
          {...ownership}
        />
        {!isParalegal && hasSubscription && (
          <Button
            icon="plus"
            onClick={() => {
              newMatterModal.setOpen(true);
            }}
            className="ml-auto my-auto"
          >
            New matter
          </Button>
        )}
      </div>
      <div className="matters-page__content flex-1 d-flex flex-column">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <MattersTable
              data={data.results}
              onSort={setSorting}
            />
            <Pagination
              className="mt-auto"
              tatalCount={data?.count}
              {...page}
            />
          </>
        ) : (
          <div className="mx-auto my-auto">
            <p className="text-center text-gray">
              You currently have no matters.
            </p>
            {!isParalegal && (
              <Button
                icon="plus"
                onClick={() => {
                  newMatterModal.setOpen(true);
                }}
                className="mx-auto mt-1 mb-auto"
              >
                New matter
              </Button>
            )}
          </div>
        )}
      </div>
      {
        newMatterModal?.open &&
        <NewMatterModal {...newMatterModal} client={params.id} clientData={userData}/>
      }
    </>
  );
};
