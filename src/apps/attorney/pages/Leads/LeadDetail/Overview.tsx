import React from "react";
import { useParams } from "@reach/router";
import {
  Folder,
  User,
  FolderItem,
  PendingLeadMessage,
  RiseLoader,
} from "components";
import { useQuery } from "react-query";
import { getMatters } from "api";
import { getUserName, formatPhoneNumber } from "helpers";
import RecentMatter from "./../components/RecentMatter";
import { useModal } from "hooks";
import { NewMatterModal } from "modals";
import {useContextSubscriptionAccess} from "contexts";

export default function Overview({ data, isLoading, error, type }) {
  const newMatterModal = useModal();
  const { hasSubscription } = useContextSubscriptionAccess();

  const addMatter = () => {
    newMatterModal.setOpen(true);
  };
  const params = useParams();

  const {
    isLoading: isMattersLoading,
    isError: isMatterError,
    error: matterError,
    data: matterData,
    refetch: refetchMatters,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["lead-matters", params.id],
    () =>
      getMatters({
        client: params.id,
        pageSize: 3,
      }),
    {
      keepPreviousData: true,
      enabled: type !== "pending",
    }
  );

  return (
    <div style={{ padding: 40 }}>
      {type === "pending" && data && (
        <PendingLeadMessage data={data} className="mb-4" />
      )}
      <Folder label="Details">
        <FolderItem>
          {isLoading ? (
            <RiseLoader className="my-4" />
          ) : error ? (
            error
          ) : (
            <div className="d-flex flex-wrap">
              <User size="large" avatar={data?.avatar} />
              <div className="ml-4">
                <div className="label">CONTACT NAME</div>
                <div className="value">{getUserName(data)}</div>
                <div className="label mt-3">PHONE</div>
                <div className="value">{formatPhoneNumber(data?.phone)}</div>
              </div>
              <div className="ml-4">
                <div className="label">EMAIL</div>
                <div className="value">{data?.email}</div>
                <div className="label mt-3">ADDRESS</div>
                <div className="value">
                  {`${data?.address1 || ""} ${data?.address2 || ""}`}
                </div>
              </div>
              <div className="ml-4">
                <div className="label">COMPANY NAME</div>
                <div className="value">{data?.organization_name}</div>
                <div className="label mt-3">ROLE</div>
                <div className="value">{data?.job}</div>
              </div>
            </div>
          )}
        </FolderItem>
      </Folder>
      <div className="row mt-4">
        <div className="col-md-8">
          <Folder label="Recent Matters" onPlus={hasSubscription ? addMatter : null}>
            {isMattersLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isMatterError ? (
              <FolderItem> {matterError} </FolderItem>
            ) : matterData && matterData.results.length > 0 ? (
              matterData.results.map((item, index) => (
                <FolderItem key={`${index}key`}>
                  <RecentMatter data={item} />
                </FolderItem>
              ))
            ) : (
              <FolderItem>
                <div className="text-center my-3">No matters</div>
              </FolderItem>
            )}
          </Folder>
        </div>
        <div className="col-md-4">
          <Folder label="Recent Activities">
            <FolderItem>
              <div className="my-3 text-center text-gray">
                Recent activities will be there.
              </div>
            </FolderItem>
            {/* <FolderItem>
              <RecentActivity />
            </FolderItem>
            <FolderItem>
              <RecentActivity />
            </FolderItem>
            <FolderItem>
              <RecentActivity />
            </FolderItem> */}
          </Folder>
        </div>
      </div>
      {newMatterModal?.open && data && (
        <NewMatterModal
          {...newMatterModal}
          client={params.id}
          clientData={{
            name: getUserName(data),
            organization_name: data?.organization_name || data?.company || "",
            job: data?.job,
            phone: data?.phone,
            email: data?.email,
            avatar: data?.avatar,
          }}
          onCreate={() => refetchMatters()}
        />
      )}
    </div>
  );
}
