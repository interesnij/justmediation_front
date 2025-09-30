import React from "react";
import { Link } from "@reach/router";

export const Topic = ({ data, userType }) => {
  return (
    <Link
      className="topic-control"
      to={`/${userType}/engagement/topic/${data?.id}`}
    >
      <div className="topic-control__main">
        <div className="topic-control__title">{data?.title}</div>
        <div className="topic-control__description">{data?.description}</div>
      </div>
      <div className="topic-control__post-count ml-3 mt-3">
        <div className="topic-control__title text-center">
          {data?.posted_matters_count}
        </div>
        <div className="topic-control__description text-center">Posts</div>
      </div>
    </Link>
  );
};
