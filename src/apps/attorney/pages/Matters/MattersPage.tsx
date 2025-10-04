import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { SearchBar, Select, Button, Pagination, RiseLoader } from "components";
import { useInput, useModal } from "hooks";
import { MattersTable } from "./components/MattersTable";
import { NewMatterModal } from "modals";
import { MediatorLayout } from "apps/mediator/layouts";
import { useQuery } from "react-query";
import { getMatters } from "api";
import { useMatterContext, useAuthContext } from "contexts";
import { MATTERS_PER_PAGE } from "config";
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

export const MattersPage: React.FunctionComponent<RouteComponentProps> = () => {
  const filter = useInput("");
  const ownership = useInput("all");
  const newMatterModal = useModal();
  const page = useInput(0);
  const search = useInput("");
  const { updateMatters, createdId } = useMatterContext();
  const { userId, userType } = useAuthContext();
  const [sorting, setSorting] = useState("");

  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    ["matters", page, search.value, filter.value, ownership.value, sorting],
    () =>
      getMatters({
        page: page.value,
        pageSize: MATTERS_PER_PAGE,
        search: search.value,
        status: filter.value,
        mediator: ownership.value === "mine" ? userId : "",
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

  useEffect(() => {
    if (createdId){
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdId])

  const isParalegal = !!(userType && ['paralegal', 'other'].indexOf(userType) !== -1);

  return (
    <MediatorLayout title="Matters" userType={userType}>
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
        {!isParalegal && (
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
      <div className="matters-page__content">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader className="my-4" />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <MattersTable
              data={data.results}
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
          <div className="mx-auto my-auto">
            <p className=" text-center text-gray">
              You currently have no matters.
            </p>
            {!isParalegal && (
              <Button
                icon="plus"
                onClick={() => {
                  newMatterModal.setOpen(true);
                }}
                className="mx-auto mt-1"
              >
                New matter
              </Button>
            )}
          </div>
        )}
      </div>
      {
        newMatterModal?.open &&
        <NewMatterModal {...newMatterModal} onCreate={() => refetch()} />
      }
    </MediatorLayout>
  );
};
