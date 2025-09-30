import React from "react";
import {navigate, RouteComponentProps, useParams} from "@reach/router";
import styled from "styled-components";
import {RiseLoader, Message, Dropdown} from "components";
import { ClientLayout } from "apps/client/layouts";
import { useQuery } from "react-query";
import {getMatterPosts, getMatterTopicById, deleteMatterTopic} from "api";
import { useInput } from "hooks";
import ActionIcon from "assets/icons/action_gray.svg";

export interface IDataMessageDetail {
  attachments?: (null)[] | null;
  comment_count: number;
  created: string;
  id: number;
  last_comment: LastComment;
  matter: number;
  modified: string;
  participants: number[];
  participants_data: IParticipantData[];
  seen: boolean;
  seen_by_client: boolean;
  title: string;
}

interface IParticipantData {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
}

export interface LastComment {
  id: number;
  post: number;
  author: any;
  text: string;
  created: string;
}

const rowActions = [
  {
    label: "Delete",
    action: "delete",
  },
];

export const MatterMessageDetailPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const message = useInput("");
    const params = useParams();

    const { isLoading, isError, error, data } = useQuery<
      IDataMessageDetail,
      Error
    >(
      ["matter-message-topic", params.id],
      () =>
        getMatterTopicById(params.id),
      {
        keepPreviousData: true
      }
    );
    const {
      isLoading: isPostLoading,
      data: postData,
      refetch: refetchMessages,
    } = useQuery<{ results: any[]; count: number }, Error>(
      ["matter-message-msg", params.matter, params.id],
      () =>
        getMatterPosts({
          topic: params.id
        }),
      {
        keepPreviousData: true,
      }
    );

    const handleActionClick = async (type) => {
      switch (type) {
        case "delete":
          await deleteMatterTopic(params.id);
          navigate(`/client/overview/matter/${params.matter}/messages`);
          break;
        default:
          break;
      }
    };

    return (
      <ClientLayout
        title="Back to Message"
        backUrl={`/client/overview/matter/${params.matter}/messages`}
      >
        <Main>
          <Content className="p-4">
            {isLoading || isPostLoading ? (
              <div className="my-auto d-flex">
                <RiseLoader />
              </div>
            ) : isError ? (
              <div>Error: {error?.message}</div>
            ) : data ? (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <Title>{data && data?.title}</Title>
                  <div className="client-matter-message-page__table-row-item">
                    <Dropdown
                      data={rowActions}
                      onActionClick={handleActionClick}
                      className="mx-auto"
                    >
                      <img
                        src={ActionIcon}
                        alt="action"
                        className="client-matter-message-page__table-row-item-action"
                      />
                    </Dropdown>
                  </div>
                </div>
                <div className="divider" />
                <div className="d-flex flex-column flex-1 pr-2">
                  {postData?.results &&
                    postData.results.map((item, key) => {
                      return (
                        <div key={`${key}key`}>
                          <Message
                            postData={postData}
                            data={item}
                            message={message}
                            refetchMessages={refetchMessages}
                            postParticipants={data.participants}
                            postParticipantsData={data.participants_data}
                            isLastItem={postData.results?.length === key + 1}
                          />
                          <div className="divider"/>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <>
                <p className="mx-auto my-auto text-center text-gray">
                  You currently have no message.
                </p>
              </>
            )}
          </Content>
        </Main>
      </ClientLayout>
    );
  };

const Title = styled.h2`
  font-style: normal;
  font-weight: normal;
  font-size: 26px;
  line-height: 36px;
  color: #000000;
  font-family: var(--font-family-secondary);
`;

const Main = styled.div`
  flex: 1 1;
  overflow: auto;
  background: #f4f5f9;
  padding: 40px 40px 0 40px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;
