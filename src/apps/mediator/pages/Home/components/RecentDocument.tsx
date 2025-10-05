import React from "react";
import DocImg from "assets/icons/document.svg";
import "./../style.scss";

export const RecentDocument = () => {
  return (
    <div className="recent-document">
      <img src={DocImg} className="recent-document__img" alt="document" />
      <div>
        <div className="recent-document__name">
          Corporate Records Maintenance.docx
        </div>
        <div className="recent-document__detail">
          <span className="recent-document__size">(233 KB) </span>
          <span>Uploaded by Ashly Chan</span>
        </div>
      </div>
      <div className="recent-document__time">11:32 AM</div>
    </div>
  );
};
