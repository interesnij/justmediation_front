import React, { useState } from "react";
import { Button, Folder, FolderItem, FormInput, FormProfilePhoto, RiseLoader } from "components";
import { Formik, Form } from "formik";
import { useAuthContext, useCommonUIContext } from "contexts";
import { uploadFiles, updateProfile, getCurrentProfile } from "api"; 
import { MembersTable } from "./components/MembersTable";
import { useModal } from "hooks";
import { InviteMembersModal } from "modals";
import { useQuery } from "react-query";


export const TeamSettings = () => { 
  const { profile, setProfile, userType } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const [isLoading, setIsLoading] = useState(false);
  const inviteMembers = useModal();
  const { data } = useQuery<any, Error>(
    [`enterprise-profile`],
    () => {
      return getCurrentProfile(userType)
    },
    { keepPreviousData: true }
  );
  console.log(data);
  const members = [ 
    ...data.team_members_registered_data,
    ...data.team_members,
  ]
  const { attorney_count, paralegal_and_other_count, pending_invites_count, seats_used, seats_available } = data.team_members_stats;

  const updateLogo = async (file: any) => {
    try {
      setIsLoading(true)
      const files = await uploadFiles(
        [file],
        "user_avatars",
        0
      );
      const res = await updateProfile(userType, { team_logo: files[0] });
      setProfile(res);
    } catch (error: any) {
      showErrorModal("Error", error);
    } finally {
      setIsLoading(false)
    }
  }

  const removeLogo = async () => {
    try {
      setIsLoading(true)
      const res = await updateProfile(userType, { team_logo: null });
      setProfile(res);
    } catch (error: any) {
      showErrorModal("Error", error);
    } finally {
      setIsLoading(false)
    }
  }

  const updateFirmName = async (value: string) => {
    try {
      setIsLoading(true)
      const res = await updateProfile(userType, { firm_name: value });
      setProfile(res);
    } catch (error: any) {
      showErrorModal("Error", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="settings-modal">
      {isLoading && (
        <div className="overlay-spinner">
          <div>
            <RiseLoader className="my-4" />
          </div>
        </div>
      )}
      <Formik
        initialValues={data}
        onSubmit={() => {}} // data handling is split 
      >
        {({ values }) => {
          return (
            <Form>
              <Folder label="Team" className="jumbo">
                <FolderItem>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="heading mb-2">Firm Name</div>
                      <FormInput
                        isRequired
                        name="firm_name"
                        value={data.firm_name}
                      /> 
                    </div>
                    <Button size="normal" className="mt-4" onClick={() => updateFirmName(values.firm_name)}>
                      Save
                    </Button>
                  </div>
                  <div className="row my-2">
                    <div className="col-12 mt-4 mb-1">
                      <div className="heading mb-2">Logo</div>
                      <FormProfilePhoto name="team_logo" className="team-logo" onChangeCallback={updateLogo} onRemoveCallback={removeLogo} isRequired={false}/>
                    </div> 
                  </div>
                </FolderItem>
              </Folder>
            </Form>
          );
        }}
      </Formik>
      <Button size="normal" className="folder-btn float-right mt-4" onClick={() => inviteMembers.setOpen(true)}>
        Invite Members
      </Button>
      <Folder label="Members" className="jumbo mt-3">
        <FolderItem>
          <div className="row">
            <div className="col-3 members-count py-2">
              <div>Attorneys</div>
              <div>{attorney_count}</div>
            </div>
            <div className="col-3 members-count py-2">
              <div>Paralegals and Others</div>
              <div>{paralegal_and_other_count}</div>
            </div>
            <div className="col-3 members-count py-2">
              <div>Pending</div>
              <div>{pending_invites_count}</div>
            </div>
            <div className="col-3 members-count py-2">
              <div>Seats Used</div>
              <div>
                {seats_used}/{seats_available}
              </div>
            </div>
          </div>
          <MembersTable members={members} />
        </FolderItem>
      </Folder>
      <InviteMembersModal {...inviteMembers} seatsAvailable={seats_available} />
    </div>
  );
};
