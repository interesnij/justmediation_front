import React, { useState } from "react";
import { Modal, Button, FormTextarea, FormSelect, RiseLoader } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormMultiEmails } from "./FormMultiEmails";
import { useAuthContext, useCommonUIContext } from "contexts";
import { useQuery } from "react-query";
import { enterpriseInviteTeamMembers, getAttorneysAndParalegals } from "api";
import "./style.scss";

const validationSchema = Yup.object().shape({
  userType: Yup.string().required("User Type is required"),
  message: Yup.string(),
});

const userTypeData = [
  {
    title: "Attorney",
    id: "attorney",
  },
  {
    title: "Paralegal",
    id: "paralegal",
  },
];
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  seatsAvailable: number;
}
export const InviteMembersModal = ({ open, setOpen, seatsAvailable }: Props) => {
  const { showErrorModal } = useCommonUIContext();
  const [isLoading, setIsLoading] = useState(false);
  const { userId, userType, profile, setProfile } = useAuthContext();
  const [registeredTeamMembers, setRegisteredTeamMembers] = useState<{ id:number, email:string }[]>(
    []
  );

  let reset = () => {};

  const { isLoading: isSharesLoading, data } = useQuery<any[], Error>(
    ["attorneys_paralegals"],
    () => getAttorneysAndParalegals({}),
    {
      keepPreviousData: true,
      enabled: open,
    }
  );

  return (
    <Modal
      title="Invite Memebers"
      subtitle={`${seatsAvailable} Seats Available`}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      {isLoading && (
        <div className="overlay-spinner">
          <div>
            <RiseLoader className="my-4" />
          </div>
        </div>
      )}
      <div className="add-time-entry-modal">
        <Formik
          initialValues={{
            userType: "",
            to: [],
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              setIsLoading(true);
              const teamMembers = values.to.map((email, index) => {
                return {
                  email: email,
                  type: values.userType,
                };
              });
              const team_members_registered = registeredTeamMembers.map(
                (user) => {
                  return user.id;
                }
              );
              const res = await enterpriseInviteTeamMembers(userId, {
                team_members: teamMembers,
                team_members_registered: team_members_registered,
              });
              const {
                team_members_data,
                team_members_registered_data,
                team_members_stats,
              } = res;
              setProfile({
                ...profile,
                team_members: team_members_data,
                team_members_registered_data: team_members_registered_data,
                team_members_stats: team_members_stats,
              });
              setIsLoading(false);
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
              setIsLoading(false);
            }
          }}
        >
          {({ resetForm }) => {
            reset = resetForm;
            return (
              <Form>
                <FormSelect
                  name="userType"
                  label="User Type"
                  isRequired
                  values={userTypeData}
                  placeholder="Select user type"
                />
                <div className="select-control__label mt-2">To:</div>
                <FormMultiEmails
                  values={data}
                  isRequired
                  placeholder="Enter email to invite members"
                  name="to"
                  showAvatar
                  isLoading={isSharesLoading}
                  value={[]}
                  registeredTeamMembers={registeredTeamMembers}
                  setRegisteredTeamMembers={setRegisteredTeamMembers}
                />
                <FormTextarea
                  name="message"
                  label="Invitation Message"
                  className="mt-2"
                  placeholder="Enter message"
                />
                <div className="d-flex mt-3">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="ml-3" buttonType="submit" size="large">
                    Send Invitations
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
