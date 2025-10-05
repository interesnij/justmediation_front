import React from "react";
import { useQuery } from "react-query";
import { RouteComponentProps } from "@reach/router";
import { MediatorLayout } from "apps/mediator/layouts";
import { useParams } from "@reach/router";
import { getNewsById } from "api";
import { css } from "@emotion/react";
import { format } from "date-fns";
import RiseLoader from "react-spinners/RiseLoader";
import { NewsDto } from "types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ReactHtmlParser from "react-html-parser";
import { useAuthContext } from "contexts";

export const NewsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { userType } = useAuthContext();
  const params = useParams();
  const { isLoading, isError, data, error } = useQuery<NewsDto, Error>(
    ["news", params.id],
    () => getNewsById(params.id)
  );

  return (
    <MediatorLayout showButtons={false} userType={userType}>
      <div className="news-page">
        {isLoading ? (
          <div className="my-4 d-flex">
            <RiseLoader
              size={15}
              margin={2}
              color="rgba(0,0,0,.6)"
              css={css`
                display: block;
                margin: 200px auto;
              `}
            />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          <>
            <div className="news-page__card">
              <LazyLoadImage
                alt={data?.title}
                effect="blur"
                wrapperClassName="news-page__image"
                src={data?.image}
              />
              <div className="news-page__content">
                <div className="news-page__title">{data?.title}</div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="news-page__date">JustMediationHub</div>
                  <div className="news-page__date">
                    {format(new Date(data?.created ?? ""), "MM/dd/yyy")}
                  </div>
                </div>
              </div>
            </div>
            <div className="news-page__card news-page__content news-page__text">
              {ReactHtmlParser(data?.description ?? "")}
            </div>
          </>
        )}
      </div>
    </MediatorLayout>
  );
};
