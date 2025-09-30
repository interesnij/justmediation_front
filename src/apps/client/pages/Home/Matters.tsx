import React from "react";
import { SearchBar, Select, Pagination, RiseLoader } from "components";
import { useInput } from "hooks";
import Matter from "./components/Matter";
import { RouteComponentProps } from "@reach/router";
import { useQuery } from "react-query";
import { getMatters } from "api";
import { DashboardLayout } from "apps/client/layouts";
import { MATTERS_PER_PAGE } from "config";
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
];
const sortData = [
  {
    title: "Most Recent",
    id: "-created",
  },
  {
    title: "Oldest",
    id: "created",
  },
];

export const MattersPage: React.FunctionComponent<RouteComponentProps> = () => {
  const filterBy = useInput(filterData[0].id);
  const sortBy = useInput(sortData[0].id);
  const page = useInput(0);
  const search = useInput("");

  const { isLoading, isError, error, data } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    ["matters", page, search.value, filterBy.value, sortBy.value],
    () =>
      getMatters({
        page: page.value,
        pageSize: MATTERS_PER_PAGE,
        search: search.value,
        status: filterBy.value,
        ordering: sortBy.value
      }),
    {
      keepPreviousData: true,
    }
  );

  return (
    <DashboardLayout tab="Matters">
      <div className="client-matters-page">
        <div className="client-matters-page__top">
          <SearchBar icon="search" {...search} className="my-auto" placeholder='Search in Matters' />
          <Select data={filterData} {...filterBy} label='Filter by' className="ml-4 my-auto" />
          <Select data={sortData} {...sortBy} className="ml-auto my-auto" label='Sort by' />
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
              {data?.results.map((item, index) => (
                <Matter key={`${index}key`} data={item} />
              ))}
              <Pagination
                className="mt-auto"
                tatalCount={data?.count}
                {...page}
              />
            </>
          ) : (
            <p className="mx-auto my-auto text-center text-gray">
              You currently have no matters.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
