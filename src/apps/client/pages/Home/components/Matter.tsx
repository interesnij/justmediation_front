import React from "react";
import { Tag, Badge, User, MultiUsers } from "components";
import numeral from "numeral";
import { Link } from "@reach/router";
import DocImg from "assets/icons/document.svg";
import EnvelopImg from "assets/icons/envelop.svg";
import { format, parseISO } from "date-fns";

interface Props {
  data: any;
}

export default function Matter({ data }: Props) {
  return (
    <div className="client-matter-control">
      <div className="d-flex justify-content-between">
        <div>
          <div className="recent-matter__name">
            <Link to={`/client/overview/matter/${data?.id}`}>
              {data?.title}
            </Link>
          </div>
          <div className="recent-matter__desc mt-1">
            {data?.speciality_data?.title}
          </div>
          <div className="recent-matter__date mt-1">
            <span className="recent-matter__date-label">START DATE:</span>&nbsp;
            {data.start_date ? format(parseISO(data.start_date), "MM/dd/yyyy") : ""}
          </div>
        </div>
        <div className="d-flex fit-height">
          <Link className="profile-link" to={`/client/find/attorneys/${data?.attorney}`}>
            <User
              userName={`${data?.attorney_data?.first_name || ""} ${
                data?.attorney_data?.middle_name || ""
              } ${data?.attorney_data?.last_name || ""}`}
              direction="toLeft"
              avatar={data?.attorney_data?.avatar}
            />
          </Link>
          {data?.shared_with_data.length !== 0 && (
            <>
              <div className="text-gray ml-4 my-auto">SHARED</div>
              <MultiUsers className="ml-4 overlapping-avatars" data={data?.shared_with_data} />
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="d-flex">
          <Tag
            className="mr-1 mt-auto status"
            type={data?.status}
          />
          <Tag
            isCustomContent
            className="mt-auto"
            type="stage"
          >{data?.stage_data?.title}</Tag>
          <div className="recent-matter__date mt-auto ml-2">
            <span className="recent-matter__date-label">RATE: &nbsp;</span>
            {data?.rate_type?.title}
          </div>
          <div className="recent-matter__date mt-auto ml-2">
            <span className="recent-matter__date-label">DUE: &nbsp;</span>
            {numeral(data?.due_amount).format("$0,0.00")}
          </div>
        </div>
        <div className="d-flex">
          <Badge count={0}>
            <Link to={`/client/overview/matter/${data?.id}/documents`}>
              <div className="recent-matter__card">
                <img src={DocImg} alt="document" />
              </div>
            </Link>
          </Badge>
          <Badge className="ml-2" count={0}>
            <Link to={`/client/overview/matter/${data?.id}/messages`}>
              <div className="recent-matter__card">
                <img src={EnvelopImg} alt="mail" />
              </div>
            </Link>
          </Badge>
        </div>
      </div>
    </div>
  );
}
