import React from "react";
import { format } from "date-fns";
import filesize from "filesize";
import DocImg from "assets/icons/document.svg";
import "./../style.scss";

export const RecentDocument = ({ data }) => {
  return (
    <div className="recent-document">
      <img src={DocImg} className="recent-document__img" alt="document" />
      <div>
        <div className="recent-document__name">{data?.title}</div>
        <div className="recent-document__time">
          {data?.created
            ? format(new Date(data?.created), "MM/dd/yyyy hh:mm:ss a")
            : ""}
        </div>
        <div className="recent-document__detail">
          <span className="recent-document__size mr-2">
            ({filesize(data?.file_size)}){" "}
          </span>
          <span>Uploaded by {data?.uploaded_by}</span>
        </div>
      </div>
    </div>
  );
};
