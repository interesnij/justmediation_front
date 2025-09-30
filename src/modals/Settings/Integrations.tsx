import React, { useState } from "react";
import { getFinanceAuthUrl } from "api";
import { Button, Folder, FolderItem } from "components";

export const Integrations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDocuSign = (params) => {
    window.open("https://account.docusign.com/", "_blank");
  };
  const handleStripe = async (params) => {
    setIsLoading(true);
    const res = await getFinanceAuthUrl();
    window.open(res.data.url);
    setIsLoading(false);
  };
  return (
    <div className="settings settings-modal">
      <Folder label="Manage Integrations" className="jumbo">
        <FolderItem>
          <div className="d-flex justify-content-between my-1">
            <div className="heading">Stripe</div>
            <Button onClick={handleStripe} isLoading={isLoading} type="outline">
              Log In
            </Button>
          </div>
        </FolderItem>
        <FolderItem>
          <div className="d-flex justify-content-between my-1">
            <div className="heading my-auto">Docusign</div>
            <Button onClick={handleDocuSign} type="outline">
              Log In
            </Button>
          </div>
        </FolderItem>
      </Folder>
    </div>
  );
};
