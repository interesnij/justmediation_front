import React from "react";
import { User } from "components";
import { format } from "date-fns";
// import DocIcon from "assets/icons/document.svg";
import "./style.scss";
interface Props {
  data?: any;
}

export const RecentActivity = ({ data }: Props) => {
  return (
    <div className="recent-activity-control">
      <div className="d-flex">
        <User className="mt-1" avatar={data?.avatar} />
        <div className="ml-2">
          <div>{data?.title}</div>
          <div className="label">
            {data?.created
              ? format(new Date(data.created), "HH:mm:ss a MM/dd/yyy")
              : ""}
          </div>
        </div>
      </div>
      {/* <div className="doc-file">
        <img src={DocIcon} alt="doc" />
        <span className="my-auto">Certificate of Incorporation.PDF (3MB)</span>
      </div>
      <div className="doc-file">
        <img src={DocIcon} alt="doc" />
        <span className="my-auto">Certificate of Incorporation.PDF (3MB)</span>
      </div> */}
    </div>
  );
};
