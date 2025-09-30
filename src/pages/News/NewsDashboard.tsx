import React from "react";
import "./style.scss";
import { News, Pagination, Select } from "components";
import { useInput } from "hooks";
import { RouteComponentProps } from "@reach/router";
import { getNewsByPage } from "api";
import { NewsDto } from "types";
import { NEWS_PER_PAGE } from "config";
import { useQuery } from "react-query";
import { css } from "@emotion/react";
import RiseLoader from "react-spinners/RiseLoader";
const filterOptions = [
  { title: "Most Recent", id: "recent" },
  { title: "By Author", id: "author" },
];

export const NewsDashboardPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const sortBy = useInput(filterOptions[0].id);
    const page = useInput(0);

    const { isLoading, isError, error, data } = useQuery<
      { results: NewsDto[]; count: number },
      Error
    >(["newslist", page], () => getNewsByPage(page.value, NEWS_PER_PAGE), {
      keepPreviousData: true,
    });

    return (
      <div className="news-dashboard">
        <div className="d-flex mb-4">
          <Select
            data={filterOptions}
            className="ml-auto mr-2"
            label="Sort by"
            width={120}
            {...sortBy}
            alignRight
          />
        </div>
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
        ) : (
          <>
            <div className="row">
              {data?.results?.map((news, index) => {
                return (
                  <News
                    type={(index + 1) % 3 === 0 ? "landscape" : "portrait"}
                    data={news}
                    key={`${index}key`}
                  />
                );
              })}
            </div>
            <div className="mt-auto">
              <Pagination
                tatalCount={data?.count}
                countPerPage={NEWS_PER_PAGE}
                {...page}
              />
            </div>
          </>
        )}
      </div>
    );
  };
