import React from "react";
import { User, Tag } from "components";
import { format, parseISO } from "date-fns";
import { getUserName } from "helpers";
import { Link } from "@reach/router";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import "./../style.scss";

export default function Recentmatter({ data }) {
  const { userType } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  return (
    <div className="leads__recent-matter">
      {hasSubscription && <div className="leads__recent-matter-name text-ellipsis">
          <Link to={`/${userType}/matters/${data?.id}`}>{data?.title}</Link>
      </div>}
      <div className="leads__recent-matter-desc text-ellipsis">
        {data?.description}
      </div>
      <div className="d-flex mt-1">
        <div>
          <div className="label">START DATE</div>
          <div>
            {data?.start_date ? format(parseISO(data?.start_date), "MM/dd/yyyy") : ""}
          </div>
        </div>
        <div className="ml-3">
          <div className="label">PRACTICE AREA</div>
          <div>{data?.speciality_data?.title}</div>
        </div>
        <div className="ml-3">
          <div className="label">RATE</div>
          <div>{data?.rate_type?.title?.replace("rates", "") || ""}</div>
        </div>
        <div className="ml-3">
          <div className="label">TOTAL AMOUNT</div>
          <div>{data?.fees_earned ? `$${data?.fees_earned}` : ""}</div>
        </div>
        <div className="ml-3">
          <div className="label">UNPAID</div>
          {/* <div>{data?.fees_earned ? `$${data?.fees_earned}` : ""}</div> */}
        </div>
      </div>
      <div className="mt-1 d-flex justify-content-between">
        <div className="d-flex">
          <Tag type={data?.status} className="mt-auto mr-1 status" />
          <Tag type="stage" isCustomContent className="mt-auto mr-1">
            {data?.stage_data?.title}
          </Tag>
        </div>
        <User
          userName={getUserName(data?.mediator_data)}
          avatar={data?.mediator_data?.avatar}
          direction="toLeft"
        />
      </div>
    </div>
  );
}
