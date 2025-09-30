import React from "react";
import numeral from "numeral";
import { useModal } from "hooks";
import { NewMatterNoteModal } from "modals";
import { useParams } from "@reach/router";
import { getMatterNotes, getClientMatterOverview } from "api";
import { useQuery } from "react-query";
import { useAuthContext } from "contexts";
import { format, parseISO } from "date-fns";
import {
  Folder,
  FolderItem,
  RecentActivity,
  Note,
  Tag,
  RiseLoader,
} from "components";

export default function Overview({ matterData }) {
  const noteModal = useModal();
  const params = useParams();
  const { userId } = useAuthContext();
  const {
    isLoading: isNotesLoading,
    isError: isNotesError,
    error: notesError,
    data: notesData,
    refetch: notesRefetch,
  } = useQuery<any, Error>(
    ["client-matter-overview-notes", params.id],
    () => getMatterNotes({ matter: params.id, pageSize: 3, created_by: +userId, }),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    data: overviewData,
  } = useQuery<any, Error>(
    ["client-matter-overview"],
    () => getClientMatterOverview(userId, params.id),
    {
      keepPreviousData: true,
    }
  );

  const handleNoteAdd = () => {
    noteModal.setOpen(true);
  };

  return (
    <div className="matter-detail-overview">
      <div className="row">
        <div className="col-12">
          <Folder label="Details">
            {isOverviewLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isOverviewError ? (
              <FolderItem> {overviewError} </FolderItem>
            ) : (
              <>
                <FolderItem>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="text-dark text-bold">
                        {matterData?.speciality_data?.title}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">START DATE</div>
                      <div className="text-dark">
                        {matterData?.start_date
                          ? format(parseISO(matterData?.start_date), "MM/dd/yyyy")
                          : ""}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">STATUS</div>
                      <div>
                        <Tag className="status" type={matterData?.status} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">STAGE</div>
                      <div>
                        <Tag isCustomContent type="stage">{matterData?.stage_data?.title}</Tag>
                      </div>
                    </div>
                  </div>
                </FolderItem>
                <FolderItem>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="text-gray">RATE</div>
                      <div className="text-dark">
                        {overviewData?.rate?.title}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">AMOUNT PAID</div>
                      <div className="text-gray">
                        {numeral(overviewData?.amount_paid).format("$0,0.00")}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">TOTAL BALANCE</div>
                      <div className="text-dark">
                        {numeral(overviewData?.total_balance).format("$0,0.00")}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-gray">
                        DUE ON{" "}
                        {overviewData?.due_date
                          ? format(
                              new Date(overviewData.due_date),
                              "MM/dd/yyyy"
                            )
                          : ""}
                      </div>

                      <div className="text-dark">
                        {numeral(overviewData?.due_amount).format("$0,0.00")}
                      </div>
                    </div>
                  </div>
                </FolderItem>
              </>
            )}
          </Folder>
        </div>
        <div className="col-md-8">
          <Folder label="Recent Activity" className="mt-4">
            {isOverviewLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isOverviewError ? (
              <FolderItem> {overviewError} </FolderItem>
            ) : overviewData && overviewData?.activity.length > 0 ? (
              overviewData.activity.map((item, index) => (
                <FolderItem key={`${index}key`}>
                  <RecentActivity data={item} />
                </FolderItem>
              ))
            ) : (
              <FolderItem>
                <div className="my-3 text-center text-gray">
                  Currently you have no activities
                </div>
              </FolderItem>
            )}
          </Folder>
        </div>
        <div className="col-md-4">
          <Folder label="Notes" className="mt-4" onPlus={handleNoteAdd}>
            {isNotesLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isNotesError ? (
              <FolderItem>{notesError}</FolderItem>
            ) : notesData && notesData.results.length === 0 ? (
              <FolderItem>
                <div className="text-center text-gray my-2">Empty notes</div>
              </FolderItem>
            ) : notesData && notesData.results.length > 0 ? (
              notesData.results.map((note, index) => (
                <FolderItem key={`${index}key`}>
                  <Note data={note} />
                </FolderItem>
              ))
            ) : null}
          </Folder>
        </div>
      </div>
      {
        noteModal?.open &&
        <NewMatterNoteModal
          {...noteModal}
          matter={params.id}
          onCreate={() => notesRefetch()}
        />
      }
    </div>
  );
}
