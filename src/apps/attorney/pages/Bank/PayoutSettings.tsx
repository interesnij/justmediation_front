import React from "react";
import { Button } from "components";
import "./style.scss";

export default function PayoutSettings() {
  return (
    <div className="bank-payout-settings-page">
      <div className="d-flex justify-content-between">
        <h2>Bank accounts</h2>
        <Button icon="plus">Add bank account</Button>
      </div>
      <div className="divider mt-4"></div>
      <div className="mt-4">
        <h2>Bank accounts</h2>
        <p>
          Set a schedule to automatically receive payouts, or send manual
          payouts via the API or Dashboard.
        </p>
      </div>
      <div className="mt-2 d-flex">
        <Button className="ml-auto" theme="white">
          Cancel
        </Button>
        <Button className="ml-3">Save</Button>
      </div>
    </div>
  );
}
