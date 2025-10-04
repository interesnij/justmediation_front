import React, { useState } from "react";
import {
  Folder,
  FolderItem,
  Button,
  // RecentActivity,
  Note,
  User,
  RiseLoader,
  IconButton,
  ReferralRequestMessage,
  ReferralPendingMessage,
} from "components";
import { useAuthContext } from "contexts";
import { getMatterNotes } from "api";
import { useQuery } from "react-query";
import { useParams } from "@reach/router";
import {
  InvoiceModal,
  AddBillingItemModal,
  NewMatterNoteModal,
  ShareWithModal,
  EditNoteModal,
  DirectChatDetailModal,
} from "modals";
import styled from "styled-components";
import { useModal } from "hooks";
import numeral from "numeral";
import { format, parseISO } from "date-fns";
import { getUserName } from "helpers";

interface Props {
  isLoading: boolean;
  isMatterError: boolean;
  matterError: any;
  matterData?: any;
  onUpdate(): void;
}

export default function Overview({
  isLoading: isMatterLoading,
  isMatterError,
  matterError,
  matterData,
  onUpdate,
}: Props) {
  const invoiceModal = useModal();
  const billingModal = useModal();
  const shareModal = useModal();
  const noteModal = useModal();
  const previewNoteModal = useModal();
  const previewUserModal = useModal();
  const [ previewNote, setPreviewNote ] = useState<any>(null);
  const [ previewUser, setPreviewUser ] = useState<any>(null);
  const params = useParams();
  const { userId, profile } = useAuthContext();

  const {
    isLoading: isNotesLoading,
    isError: isNotesError,
    error: notesError,
    data: notesData,
    refetch: notesRefetch,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["matter-overview-notes", params.id],
    () => getMatterNotes({ matter: params.id, pageSize: 3, created_by: +userId, }),
    {
      keepPreviousData: true,
    }
  );

  const rateTypeId = matterData?.rate_type?.id;
  const rateAmount = rateTypeId === 1 ? `${matterData?.rate} ${matterData?.currency_data?.title}` : rateTypeId === 2 ? matterData?.rate : rateTypeId === 3 ? `${profile?.fee_rate} ${profile?.fee_currency_data?.title}` : rateTypeId === 4 ? matterData?.fee_note : "";

  const handleCreateInvoice = () => {
    invoiceModal.setOpen(true);
  };
  const handleAddBillingItems = () => {
    billingModal.setOpen(true);
  };

  const handleAddNote = () => {
    noteModal.setOpen(true);
  };

  const handleShare = () => {
    shareModal.setOpen(true);
  };

  const handlePreviewUser = (_userType, _user) => {
    _user.user_type = _userType
    if (!_user.address){
      _user.address = {
        address1: _user.address1,
        address2: _user.address2,
        city_data: _user.city_data,
        city: _user.city_data?.name,
        country_data: _user.country_data,
        country: _user.country_data?.name,
        state_data: _user.state_data,
        state: _user.state_data?.name,
        zip_code: _user.zip_code
      }
    }
    setPreviewUser(_user);
    previewUserModal.setOpen(true);
  }

  return (
    <div className="matter-detail-overview">
      <div className="row">
        {matterData?.referral_request && (
          <div className="col-12 mb-3">
            <ReferralRequestMessage
              matterData={matterData}
              data={matterData?.referral_data}
              onUpdate={onUpdate}
            />
          </div>
        )}
        {matterData?.referral_pending && (
          <div className="col-12 mb-3">
            <ReferralPendingMessage
              matterData={matterData}
              data={matterData?.referral_data}
            />
          </div>
        )}
        <div className="col-md-8">
          <Folder label="Billing">
            {isMatterLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isMatterError ? (
              <div className="my-4 text-center text-gray">{matterError}</div>
            ) : (
              <>
                <FolderItem>
                  <div className="d-flex">
                    <Price className="text-gray my-auto">Total amount:</Price>
                    <Price className="text-black ml-1 my-auto">
                      {numeral(matterData?.total_amount ?? 0).format("$0,0.00")}
                    </Price>
                    <Button className="ml-auto" onClick={handleCreateInvoice}>
                      Create Invoice
                    </Button>
                    <Button
                      type="outline"
                      icon="plus"
                      className="ml-3"
                      onClick={handleAddBillingItems}
                    >
                      Billing Items
                    </Button>
                  </div>
                </FolderItem>
                <FolderItem>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-gray">UNPAID</div>
                      <Price className="text-dark">
                        {numeral(matterData?.unpaid ?? 0).format("$0,0.00")}
                      </Price>
                    </div>
                    <div className="col-md-4">
                      <div className="text-gray">OVERDUE</div>
                      <Price className="text-dark">
                        {numeral(matterData?.overdue ?? 0).format("$0,0.00")}
                      </Price>
                    </div>
                    <div className="col-md-4">
                      <div className="text-gray">UNBILLED</div>
                      <Price className="text-dark">
                        {numeral(matterData?.unbilled ?? 0).format("$0,0.00")}
                      </Price>
                    </div>
                  </div>
                </FolderItem>
              </>
            )}
          </Folder>
          <Folder label="Details" className="mt-4 details">
            {isMatterLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isMatterError ? (
              <div className="my-4 text-center text-gray">{matterError}</div>
            ) : (
              <>
                <FolderItem>
                  <div className="row">
                    <div className="col-12">
                      <div className="text-gray label">MATTER DESCRIPTION</div>
                      <Desc className="text-dark content">
                        {matterData?.description}
                      </Desc>
                    </div>
                  </div>
                </FolderItem>
                <FolderItem>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-gray label">BILLABLE</div>
                      <div className="text-dark content">
                        {matterData?.rate_type?.title} <br />
                        {rateAmount}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-gray label">START DATE</div>
                      <div className="text-dark content">
                        {matterData?.start_date
                          ? format(parseISO(matterData?.start_date), "MM/dd/yy")
                          : ""}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-gray label">CLOSE DATE</div>
                      <div className="text-dark content">
                        {matterData?.completed
                          ? format(new Date(matterData?.completed), "MM/dd/yy")
                          : "-"}
                      </div>
                    </div>
                  </div>
                </FolderItem>
                <FolderItem>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-gray label">PRACTICE AREA</div>
                      <div className="text-dark content">
                        {matterData?.speciality_data?.title}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-gray label">JURISDICTION</div>
                      <div className="text-dark content">{ matterData ? matterData?.state_data?.name + ', ' + matterData?.country_data?.name : '-'}</div>
                    </div>
                  </div>
                </FolderItem>
              </>
            )}
          </Folder>
          <Folder label="Recent Activity" className="mt-4">
            {isMatterLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isMatterError ? (
              <div className="my-4 text-center text-gray">{matterError}</div>
            ) : (
              <>
                <FolderItem>
                  <div className="my-3 text-center text-gray">
                    You currently have no activities
                  </div>
                </FolderItem>
              </>
            )}
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
        <div className="col-md-4">
          <Folder label="Contacts" className="contacts">
            {isMatterLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isMatterError ? (
              <div className="my-4 text-center text-gray">{matterError}</div>
            ) : (
              <>
                <FolderItem>
                  <ContactHeading>Client</ContactHeading>
                  <User
                    avatar={matterData?.client_data?.avatar}
                    userName={getUserName(matterData?.client_data)}
                    className="my-1 cursor-pointer"
                    onClick={() => { handlePreviewUser('client', matterData.client_data) }}
                  />
                </FolderItem>
                <FolderItem>
                  <ContactHeading>Principle</ContactHeading>
                  <User
                    avatar={matterData?.mediator_data?.avatar}
                    userName={getUserName(matterData?.mediator_data)}
                    className="my-1"
                  />
                </FolderItem>
                <FolderItem>
                  <div className="d-flex">
                    <ContactHeading>Shared with</ContactHeading>
                    <div className="text-gray ml-2 my-auto shared-length">
                      {matterData?.shared_with?.length}
                    </div>
                    {!matterData?.is_shared && (
                      <IconButton
                        type="plus_gray"
                        className="ml-auto my-auto"
                        size="small"
                        onClick={handleShare}
                      />
                    )}
                  </div>
                  {matterData?.shared_with &&
                    matterData?.shared_with_data.map((user, index) => (
                      <div className="d-flex my-1 shared-user" key={`${index}key`}>
                        <User
                          avatar={user?.avatar}
                          userName={getUserName(user)}
                          onClick={() => { handlePreviewUser(user.user_type, user)  }}
                          className="cursor-pointer"
                        />
                        <span className="user-type">{user.user_type}</span>
                      </div>
                    ))}
                </FolderItem>
              </>
            )}
          </Folder>
          <Folder label="Notes" className="mt-4" viewAll={`?tab=notes`} onPlus={handleAddNote}>
            {isNotesLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isNotesError ? (
              <FolderItem>{notesError}</FolderItem>
            ) : notesData && notesData?.results?.length === 0 ? (
              <FolderItem>
                <div className="text-center text-gray my-2">Empty notes</div>
              </FolderItem>
            ) : notesData && notesData?.results?.length > 0 ? (
              notesData.results.map((note, index) => (
                <FolderItem key={`${index}key`}>
                  <Note data={note} onClick={()=> { setPreviewNote(note); previewNoteModal.setOpen(true); }}/>
                </FolderItem>
              ))
            ) : null}
          </Folder>
        </div>
      </div>
      {
        invoiceModal?.open &&
        <InvoiceModal
          {...invoiceModal}
          matter={params.id}
          client={matterData?.client}
        />
      }
      {
        billingModal?.open &&
        <AddBillingItemModal
          {...billingModal}
          matter={params.id}
          client={matterData?.client}
          onCreate={onUpdate}
        />
      }
      {
        noteModal?.open &&
        <NewMatterNoteModal
          {...noteModal}
          matter={params.id}
          onCreate={() => notesRefetch()}
        />
      }
      {
        previewNoteModal?.open &&
        <EditNoteModal
          {...previewNoteModal}
          data={{
            id: previewNote?.id,
            matter: previewNote?.id,
            text: previewNote?.text,
            title: previewNote?.title,
            attachments: previewNote?.attachments_data,
          }}
          onUpdate={notesRefetch}
        />
      }
      {
        previewUserModal?.open &&
        <DirectChatDetailModal {...previewUserModal} Opponent={previewUser} />
      }
      {
        shareModal?.open &&
        <ShareWithModal
          {...shareModal}
          matter={params.id}
          sharedWith={matterData?.shared_with}
          onUpdate={() => onUpdate()}
        />
      }
    </div>
  );
}

const Desc = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  font-size: 22px;
  line-height: 28px;
`;

const ContactHeading = styled.div`
  font-size: 16px;
  letter-spacing: -0.01em;
  color: #000000;
`;
