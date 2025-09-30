import React from "react";
import { Button } from "components";
import "./style.scss";

export default function Balances() {
  return (
    <div className="bank-balances-page">
      <div className="d-flex justify-content-between">
        <h2>USD Balance</h2>
        <Button>Add to balance</Button>
      </div>
      <div className="divider my-1"></div>
      <div className="d-flex justify-content-between">
        <span>On the way to your bank</span>
        <span>$ 0.00</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Estimated future payouts</span>
        <span>$ 394.86</span>
      </div>
      <div className="divider my-1"></div>
      <div className="d-flex justify-content-between">
        <b>Estimated future payouts</b>
        <b>$ 394.86</b>
      </div>
      <div className="d-flex mt-4 justify-content-between">
        <h2>On the way to your bank</h2>
        <Button>Payout settings</Button>
      </div>
      <div className="divider my-1"></div>
      <div className="d-flex justify-content-between">
        <b>Total</b>
        <b>$ 0.0</b>
      </div>
      <div className="d-flex mt-4 justify-content-between">
        <h2>USD Balance</h2>
      </div>
      <div className="divider my-1"></div>
      <div className="d-flex justify-content-between">
        <span>3 payments</span>
        <span>$ 408.86</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>1 refund</span>
        <span>-$ 14.00</span>
      </div>
      <div className="divider my-1"></div>
      <div className="d-flex justify-content-between">
        <b>Total</b>
        <b>$ 394.86</b>
      </div>
    </div>
  );
}
