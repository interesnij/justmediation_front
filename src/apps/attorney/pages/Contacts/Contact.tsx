import React, { useState} from "react";
import { Button, Card, User, RiseLoader } from "components";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
import { AttorneyLayout } from "apps/attorney/layouts";
import { useQuery } from "react-query";
import { getIndustryContactDetailForAttorney, createChat } from "api";
import { useAuthContext, useChatContext } from "contexts";
import { Paralegal, Attorney } from "./components";
import { CallStartModal } from "modals";
import { useModal } from "hooks";
import "./style.scss";

export const ContactPage: React.FunctionComponent<RouteComponentProps> = () => {
  const params = useParams();
  const { userId, profile, userType } = useAuthContext();
  const [chat, setChat] = useState<any>(null)
  const { onStartCall } = useChatContext();
  const callStartModal = useModal();

  const { isLoading, isError, error, data } = useQuery<any, Error>(
    ["industry-contact-detail"],
    () => getIndustryContactDetailForAttorney(userId, params.id),
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
    navigate(`/${userType}/chats/network?id=${chatObject.id}`);
  };

  const handleWebsite = () => {};

  return (
    <AttorneyLayout
      title="Back to Industry Contacts"
      backUrl={`/${userType}/contacts`}
      userType={userType}
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
                    avatar={data?.about?.avatar}
                    className="mb-auto"
                  />
                  <div className="contact-page__content-top-main ml-3">
                    <div className="d-flex">
                      <span className="name my-auto mr-2">
                        {data?.personal_details?.name}
                      </span>

                      <span className="service ml-4 my-auto">
                        {data?.personal_details?.type}
                      </span>
                    </div>
                    <div className="firm mt-1">
                      {data?.personal_details?.firm}
                    </div>
                    <div className="d-flex flex-wrap">
                      {data?.personal_details?.practice_areas.map(
                        (pa, index) => (
                          <span className="practice-area" key={`${index}key`}>
                            {pa?.title}
                          </span>
                        )
                      )}
                    </div>
                    <div className="d-flex flex-wrap">
                      {data?.personal_details?.languages.map((pa, index) => (
                        <span className="service" key={`${index}key`}>
                          {pa?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="mt-4">
                {data?.type === "paralegal" ? (
                  <Paralegal data={data} />
                ) : (
                  <Attorney data={data} />
                )} 
              </Card>
            </div>
            <Card className="ml-4">
              <div className="contact-page__buttons">
                {data?.type === "attorney" ? (
                  <Button
                    type="outline"
                    className="mt-3 mb-3"
                    width={180}
                    onClick={handleWebsite}
                  >
                    View Website
                  </Button>
                ) : null}
                <Button
                  type="outline"
                  className="mt-3 mb-3"
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
          </>
        )}
      </div>
      <CallStartModal 
        {...callStartModal} 
        onConfirm={() =>  onStartCall({ participants: [+userId, params.id] })} 
        participants={[data?.about]} 
        userId={profile?.id} 
      />
    </AttorneyLayout>
  );
};
