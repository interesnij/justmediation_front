import React, { useState } from "react";
import { Button, Card, User, RiseLoader } from "components";
import { ProfileInformation } from "./components";
import { RouteComponentProps, useParams, navigate, useLocation } from "@reach/router";
import { ClientLayout } from "apps/client/layouts";
import { useAuthContext, useChatContext } from "contexts";
import { getMediatorById, getParalegalById, createChat } from "api";
import { useQuery } from "react-query";
import { CallStartModal } from "modals";
import { useModal } from "hooks";

export const ProfilePage: React.FunctionComponent<RouteComponentProps> = () => {
  const params = useParams();
  const location = useLocation();
  const { userId, profile } = useAuthContext();
  const [chat, setChat] = useState<any>(null)
  const { onStartCall } = useChatContext();
  const callStartModal = useModal();
  const type = window.location.pathname.includes('mediator') ? 'Mediator' : 'Paralegal';

  const { isFetching: isLoading, isError, error, data } = useQuery<any, Error>(
    ["get-profile-by-id"],
    () => type === 'Mediator' ? getMediatorById(params.id, params.id) : getParalegalById(params.id),
    {
      keepPreviousData: true,
    }
  );

  const getChat = async () => {
    if (chat) return chat;
    const data = await createChat({
      participants: [params.id],
      is_group: 0
    });
    setChat(data);
    return data;
  }

  const handleChat = async () => {
    const chatObject = await getChat();
    navigate(`/client/chats/${chatObject.id}`);
  };

  return (
    <ClientLayout
      title="Back"
      backUrl={`/client/find/results${location.search}`}
    >
      <div className="contact-page">
        {isLoading ? (
          <RiseLoader className="my-auto" />
        ) : isError ? (
          error
        ) : (
          <>
            <div className="contact-page__content">
              <Card>
                <div className="contact-page__content-top m-2">
                  <User
                    size="large"
                    avatar={data?.avatar}
                    className="mb-auto"
                  />
                  <div className="contact-page__content-top-main ml-3">
                    <div className="d-flex">
                      <span className="name my-auto mr-2">
                        {`${data?.first_name ?? ""} ${data?.middle_name ?? ""} ${data?.last_name ?? ""}`}
                      </span>
                      <span className="service ml-4 my-auto">
                        {data?.type}
                      </span>
                    </div>
                    <div className="firm mt-1">
                      {data?.firm_name}
                    </div>
                    <div className="d-flex flex-wrap">
                      {data?.specialities_data?.map(
                        (pa, index) => (
                          <span className="practice-area" key={`${index}key`}>
                            {pa?.title}
                          </span>
                        )
                      )}
                    </div>
                    <div className="d-flex flex-wrap">
                      {data?.spoken_language_data?.map((pa, index) => (
                        <span className="service" key={`${index}key`}>
                          {pa?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="mt-4">
                <ProfileInformation data={data} />
              </Card>
            </div>
            <Card className="ml-4">
              <div className="contact-page__buttons">
                {data?.website &&
                  <Button
                    type="outline"
                    className="mt-3 mb-3"
                    width={180}
                    onClick={() => { window.open(data.website, '_blank') }}
                  >
                    View Website
                  </Button>
                }
                <Button
                  type="outline"
                  className="mb-3"
                  width={180}
                  onClick={() => callStartModal.setOpen(true)}
                >
                  Start a Call
                </Button>
                <Button className="mb-3" width={180} onClick={handleChat}>
                  Chat Now
                </Button>
              </div>
            </Card>
            <CallStartModal
              {...callStartModal}
              onConfirm={() => onStartCall({ participants: [+userId, params.id] })}
              participants={[data]}
              userId={profile?.id}
            />
          </>
        )}
      </div>
    </ClientLayout>
  );
};
