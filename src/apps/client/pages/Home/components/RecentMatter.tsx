import React from "react";
import numeral from "numeral";
import { Badge, User, Tag } from "components";
import { Link } from "@reach/router";
import DocImg from "assets/icons/document.svg";
import EnvelopImg from "assets/icons/envelop.svg";
import { format, parseISO } from "date-fns";

export const Recentmatter = ({ data }) => {

  return (
    <>
      <div className="d-flex">
        <div>
          <div className="recent-matter__name">
            {" "}
            <Link to={`/client/overview/matter/${data?.id}`}>
              {data?.title}
            </Link>
          </div>
          <div className="recent-matter__desc">
            {data?.speciality_data?.title}
          </div>
          <div className="recent-matter__date">
            <span className="recent-matter__date-label mr-1">START DATE:</span>
            {data.start_date ?  format(parseISO(data.start_date), "MM/dd/yyyy") : ""}
          </div>
        </div>
        <div className="d-flex ml-auto fit-height">
          <Link className="profile-link" to={`/client/find/attorneys/${data?.attorney_id}`}>          
            <User
              userName={data?.attorney_name}
              direction="toLeft"
              avatar={data?.attorney_avatar}
            />
          </Link>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Tag
            className="mr-1 mt-auto status"
            type={data?.status}
          />
          <Tag
            isCustomContent={true}
            className="mt-auto"
            type="stage"
          >{data?.stage}</Tag>
         
          <div className="recent-matter__date mt-auto ml-2">
            <span className="recent-matter__date-label">DUE: &nbsp;</span>
            {numeral(data?.due_amount).format("$0,0.00")}
          </div>
        </div>
        <div className="d-flex">
          <Badge count={data?.unread_message_count}>
            <Link to={`/client/overview/matter/${data?.id}/messages`}>
              <div className="recent-matter__card">
                <img src={EnvelopImg} alt="mail" />
              </div>
            </Link>
          </Badge>
          <Badge className="ml-2" count={data?.unread_document_count}>
            <Link to={`/client/overview/matter/${data?.id}/documents`}>
              <div className="recent-matter__card">
                <img src={DocImg} alt="document" />
              </div>
            </Link>
          </Badge>
        </div>
      </div>
    </>
  );
};
