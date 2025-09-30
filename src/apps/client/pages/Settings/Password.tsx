import React from "react";
import { Folder, FolderItem, Switch } from "components";
import { ChangePasswordModal, WelcomeModal } from "modals";
import { useModal } from "hooks";
import { update2FA, partialUpdateClientProfile } from "api";
import { useAuthContext } from "contexts";

export const Password = () => {
  const passwordModal = useModal();
  const welcomeModal = useModal();
  const {
    tfa: mfa,
    userId,
    update2FA: handleUpdate2FA,
  } = useAuthContext();

  const handlePasswordUpdate = () => {
    passwordModal.setOpen(true);
  };

  const handle2FA = async (params) => {
    if (params) {
      welcomeModal.setOpen(true);
    } else {
      await update2FA(userId, params);
      handleUpdate2FA(params);
    }
  };

  return (
    <div className="settings">
      <Folder label="Password & Security">
        <FolderItem>
          <div className="d-flex justify-content-between">
            <div>
              <div className="heading">Password</div>
              <div className="desc">Update your password here</div>
            </div>
            <div
              className="my-auto text-black font-size-md cursor-pointer"
              onClick={handlePasswordUpdate}
            >
              Update
            </div>
          </div>
        </FolderItem>
        <FolderItem>
          <div className="row">
            <div className="col-md-6">
              <div className="heading">2-Factor Authentication</div>
              <div className="desc">
                Add an extra layer of security to your account by enabling this
                2-step authentication. We'll send you a test message (SMS) of a
                one-time security code to use along with your password.
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <Switch
                className="my-auto ml-auto"
                value={mfa}
                onChange={(e) => handle2FA(e)}
              />
            </div>
          </div>
        </FolderItem>
      </Folder>
      {
        passwordModal?.open &&
        <ChangePasswordModal {...passwordModal} />
      }
      {
        welcomeModal?.open &&
        <WelcomeModal
          {...welcomeModal}
          welcome={false}
        />
      }
    </div>
  );
};
