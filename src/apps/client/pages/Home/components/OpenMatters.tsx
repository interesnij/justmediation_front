import React from "react";
import classNames from "classnames";
import { User } from "components";
import "./../style.scss";
interface Props {
  className?: string;
}
export default function OpenMatters({ className }: Props) {
  return (
    <div className={classNames("open-matters", className)}>
      <div className="open-matters__header">
        <div className="open-matters__item">
          <span>Matter</span>
        </div>
        <div className="open-matters__item">
          <span>Client</span>
        </div>
        <div className="open-matters__item">
          <span>Rate</span>
        </div>
        <div className="open-matters__item">
          <span>Practice area</span>
        </div>
        <div className="open-matters__item">
          <span>Principle</span>
        </div>
      </div>
      <div className="open-matters__row">
        <div className="open-matters__item">
          <span>00003- Matter name</span>
        </div>
        <div className="open-matters__item">
          <User userName="Davon Lane" />
        </div>
        <div className="open-matters__item">
          <span>Hourly</span>
        </div>
        <div className="open-matters__item">
          <span>Private Funds</span>
        </div>
        <div className="open-matters__item">
          <User userName="Courtney Henry" />
        </div>
      </div>
      <div className="open-matters__row">
        <div className="open-matters__item">
          <span>00003- Matter name</span>
        </div>
        <div className="open-matters__item">
          <User userName="Davon Lane" />
        </div>
        <div className="open-matters__item">
          <span>Hourly</span>
        </div>
        <div className="open-matters__item">
          <span>Private Funds</span>
        </div>
        <div className="open-matters__item">
          <User userName="Courtney Henry" />
        </div>
      </div>
      <div className="open-matters__row">
        <div className="open-matters__item">
          <span>00003- Matter name</span>
        </div>
        <div className="open-matters__item">
          <User userName="Davon Lane" />
        </div>
        <div className="open-matters__item">
          <span>Hourly</span>
        </div>
        <div className="open-matters__item">
          <span>Private Funds</span>
        </div>
        <div className="open-matters__item">
          <User userName="Courtney Henry" />
        </div>
      </div>
    </div>
  );
}
