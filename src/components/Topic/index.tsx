import React, { useState } from "react";
import { Button } from "components";
import { useAuthContext } from "contexts";
import { followTopic, unfollowTopic } from "api";
import "./style.scss";

interface Props {
  data: any;
  onRefresh?(): void;
}

export const Topic = ({ data, onRefresh = () => {} }: Props) => {
  const { userType } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    await followTopic(data.id);
    setIsLoading(false);
    onRefresh();
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    await unfollowTopic(data.id);
    setIsLoading(false);
    onRefresh();
  };

  return (
    <div className="topic-control">
      <div className="topic-control__main">
        <a
          href={`/${userType}/forums/topic/${data?.id}`}
          className="topic-control__title"
        >
          {data?.title}
        </a>
        <div className="topic-control__description">{data?.description}</div>
      </div>
      <div className="topic-control__post-count mx-3">
        <div className="topic-control__title text-center">
          {data?.post_count}
        </div>
        <div className="topic-control__description text-center">Posts</div>
      </div>
      <div className="topic-control__follow">
        {data?.followed ? (
          <Button
            className="mx-auto"
            onClick={handleUnfollow}
            isLoading={isLoading}
            type="outline"
          >
            Unfollow
          </Button>
        ) : (
          <Button
            className="mx-auto"
            isLoading={isLoading}
            onClick={handleFollow}
          >
            Follow
          </Button>
        )}
        <div className="mt-1 text-center mx-auto">
          {data?.followers_count}&nbsp;Followers{" "}
        </div>
      </div>
    </div>
  );
};
