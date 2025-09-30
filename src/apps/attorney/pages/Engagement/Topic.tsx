import React, { useState, useEffect } from "react";
import {
  Select,
  Breadcrumb,
  Button,
  Folder,
  FolderItem,
  RiseLoader,
  Pagination
} from "components";
import { Post } from "./components";
import { useInput } from "hooks";
import { RouteComponentProps, useParams } from "@reach/router";
import { AttorneyLayout, EngagementLayout } from "apps/attorney/layouts";
import { useQuery } from "react-query";
import { getPracticeAreaPostedMatters } from "api";
import { useAuthContext } from "contexts";

const sortData = [
  {
    title: "Most Recent",
    id: "-created",
  },
  {
    title: "Oldest",
    id: "created",
  }
];
export const EngagementTopicPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { userType } = useAuthContext();
    const sortBy = useInput(sortData[0].id);
    const page = useInput(0);
    const params = useParams();
    const [topic, setTopic] = useState<any>(null);
    const { isLoading, isFetching, isError, error, data, refetch } = useQuery<any, Error>(
      ["engagement-topic-id"],
      () => getPracticeAreaPostedMatters(params.id, {
        page: page.value,
        pageSize: 10,
        ordering: sortBy.value
      }),
      {
        keepPreviousData: false,
      }
    );

    useEffect(() => {
      if (!data?.results?.length) return;
      setTopic({
        posted_matters_count: data?.count,
        id: data.results[0]?.practice_area_data?.id,
        title: data.results[0]?.practice_area_data?.title
      })
    }, [data])

    useEffect(() => {
      refetch();
    }, [sortBy.value, page.value])
    
    return (
      <AttorneyLayout showButtons={false} userType={userType}>
        <EngagementLayout tab="Browse Inquiries" userType={userType}>
          <div className="forums-page__topic">
            {isLoading || isFetching ? (
              <div className="post-page__post mt-3">
                <RiseLoader className="my-4" />
              </div>
            ) : isError ? (
              <div className="post-page__post mt-3">
                <div className="my-4 text-center text-gray">{error}</div>
              </div>
            ) : (
              <>
                <Breadcrumb
                  previous={[
                    { label: "Browse Inquiries", url: "/attorney/engagement" },
                  ]}
                  current={topic?.title}
                  className="mb-3"
                />
                {topic && (
                  <div className="forums-page__topic-heading justify-content-between">
                    <div className="forums-page__topic-heading-main">
                      <div className="title">{topic?.title}</div>
                      <div className="desc mt-1">{topic?.description}</div>
                    </div>
                    <div className="forums-page__topic-heading-posts flex-column my-auto text-center">
                      <div>{topic?.posted_matters_count}</div>
                      <div className="desc text-center mt-0">Posts</div>
                    </div>
                  </div>
                )}
                <Folder label="Posts" className="mt-4">
                  {data?.results?.length 
                    ? data.results.map((post, index) => (
                      <FolderItem key={`${index}key`}>
                        <Post post={post} userType={userType} />
                      </FolderItem>
                    ))
                    : <FolderItem>
                        <div className="my-4 text-center">No posts</div>
                      </FolderItem>
                  }
                  <div className="folder__filter d-flex">
                    <Select data={sortData} label="Sort by" {...sortBy} />
                  </div>
                </Folder>{" "}
                {!isLoading && !isError && (
                  <div className="mt-3 pb-4">
                    <Pagination tatalCount={data?.count} {...page} />
                  </div>
                )}
              </>
            )}
          </div>
        </EngagementLayout>
      </AttorneyLayout>
    );
  };
