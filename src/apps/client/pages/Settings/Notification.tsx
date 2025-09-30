import React, { useEffect, useState } from "react";
import { Switch, Folder, FolderItem, RiseLoader } from "components";
import { useQuery } from "react-query";
import { getNotificationSettings, updateNotificationSettings } from "api";
import "./style.scss";

export const Notification = () => {
  const [chats, setChats] = useState(false);
  const [matters, setMatters] = useState(false);
  const [forums, setForums] = useState(false);
  const [push, setPush] = useState(false);
  const [email, setEmail] = useState(false);

  const { isLoading, isError, error, data } = useQuery<
    {
      chats: boolean;
      matters: boolean;
      forums: boolean;
      documents: boolean;
      engagements: boolean;
      events: boolean;
      push: boolean;
      email: boolean;
    },
    Error
  >(["notification-settings"], () => getNotificationSettings(), {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setChats(data.chats);
      setMatters(data.matters);
      setForums(data.forums);
      setPush(data.push);
      setEmail(data.email);
    }
    return () => {};
  }, [data]);

  return (
    <div className="settings-modal">
      <Folder label="JustLaw Dashboard">
        {isLoading ? (
          <FolderItem>
            <div className="my-auto d-flex">
              <RiseLoader className="my-4" />
            </div>
          </FolderItem>
        ) : isError ? (
          <FolderItem>
            <div>Error: {error?.message}</div>
          </FolderItem>
        ) : (
          <>
            <FolderItem>
              <div className="row">
                <div className="col-md-6">
                  <div className="heading">Chats</div>
                  <div className="desc">
                    This includes all chat and video calls.
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <Switch
                    className="my-auto ml-auto"
                    value={chats}
                    onChange={(e) => {
                      updateNotificationSettings({ chats: e });
                      setChats(e);
                    }}
                  />
                </div>
              </div>
            </FolderItem>
            <FolderItem>
              <div className="row">
                <div className="col-md-6">
                  <div className="heading">Matter Related Activities</div>
                  <div className="desc">
                    Notify you of all matter related activities including new
                    messages, invoices and billing, status updates, and shared
                    documents.
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <Switch
                    className="my-auto ml-auto"
                    value={matters}
                    onChange={(e) => {
                      updateNotificationSettings({ matters: e });
                      setMatters(e);
                    }}
                  />
                </div>
              </div>
            </FolderItem>
            <FolderItem>
              <div className="row">
                <div className="col-md-6">
                  <div className="heading">Forum Activities</div>
                  <div className="desc">
                    Receive notifications on forum activities including posts
                    you’re invloved in and new posts from the topics you are
                    following.
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <Switch
                    className="my-auto ml-auto"
                    value={forums}
                    onChange={(e) => {
                      updateNotificationSettings({ forums: e });
                      setForums(e);
                    }}
                  />
                </div>
              </div>
            </FolderItem>
          </>
        )}
      </Folder>
      <Folder label="Delivery Options" className="mt-3">
        {isLoading ? (
          <FolderItem>
            <div className="my-auto d-flex">
              <RiseLoader className="my-4" />
            </div>
          </FolderItem>
        ) : isError ? (
          <FolderItem>
            <div>Error: {error?.message}</div>
          </FolderItem>
        ) : (
          <>
            <FolderItem>
              <div className="row">
                <div className="col-md-6">
                  <div className="heading">Email Alerts</div>
                  <div className="desc">
                    Receive emails of notifications on the above.
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <Switch
                    className="my-auto ml-auto"
                    value={email}
                    onChange={(e) => {
                      updateNotificationSettings({ email: e });
                      setEmail(e);
                    }}
                  />
                </div>
              </div>
            </FolderItem>
            <FolderItem>
              <div className="row">
                <div className="col-md-6">
                  <div className="heading">Push Notifications</div>
                  <div className="desc">
                    Receive alerts and messages on your mobile device.
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <Switch
                    className="my-auto ml-auto"
                    value={push}
                    onChange={(e) => {
                      updateNotificationSettings({ push: e });
                      setPush(e);
                    }}
                  />
                </div>
              </div>
            </FolderItem>
          </>
        )}
      </Folder>
    </div>
  );
};
