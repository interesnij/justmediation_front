import React from "react";
import { User } from "components";
import { Link } from "@reach/router";
import { format } from "date-fns";
import styled from "styled-components";
import { renderBudget } from "helpers";

export const RecentPost = ({ data, userId, userType }) => {
  const link = data?.proposals?.length && data?.proposals.find(p => p?.mediator_data?.id === userId) 
    ? `/${userType}/engagement/submitted_post/${data.id}`
    : `/${userType}/engagement/post/${data?.id}`;
  return (
    <div className="recent-post">
      <Link to={link}>
        <div className="d-flex">
          <User alt={"authorName"} avatar={data?.client_data?.avatar} />
          <div className="ml-1 flex-2">
            <div className="recent-post__title">{data?.title}</div>
            <div className="d-flex w-100">
              <div className="recent-post__author">{data?.client_data?.first_name} {data?.client_data?.last_name} </div>
              <div className="recent-post__post-date">
                {data?.created
                  ? format(new Date(data?.created), "MM/dd/yy")
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </Link>
      {data?.practice_area_data && (
        <PracticeArea className="mt-1">{data?.practice_area_data?.title}</PracticeArea>
      )}
      {data?.budget_min && (
        <Budget className="mt-1">
          <span className="mr-05">Budget:</span>
          {renderBudget(data)}
        </Budget>
      )}
      <div className="recent-post__content">{data?.description}</div>
    </div>
  );
};

const PracticeArea = styled.div`
  height: fit-content;
  line-height: 24px;
  font-size: 12px;
  border-radius: 4px;
  color: #2e2e2e;
  background: #ffffff;
  border: 1px solid #e0e0e1;
  width: fit-content;
  box-sizing: border-box;
  padding: 0 12px;
`;

const Budget = styled.div`
  font-size: 16px;
  color: #000;
`;
