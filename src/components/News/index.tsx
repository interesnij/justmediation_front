import React from "react";
import classNames from "classnames";
import { format } from "date-fns";
import { Link } from "@reach/router";
import { NewsDto } from "types";
import ReactHtmlParser from "react-html-parser";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import "./style.scss";
interface Props {
  type?: "portrait" | "landscape";
  data: NewsDto;
}

export const News = ({ type = "portrait", data }: Props) => {
  const { title, id, description, image_thumbnail, created, tags } = data;
  return (
    <div className={classNames("news-control", type)}>
      <LazyLoadImage
        alt={title}
        effect="blur"
        wrapperClassName="news-control__image"
        src={image_thumbnail}
      />
      <div className="news-control__main flex-1">
        <div className="d-flex justify-content-between">
          <div className="news-control__date">{tags.join(", ")}</div>
          <div className="news-control__date">
            {format(new Date(created), "MM/dd/yyyy")}
          </div>
        </div>
        <div className="news-control__title">
          <Link to={`${id}`}>{title}</Link>
        </div>
        <div className="news-control__content">
          {ReactHtmlParser(description)}
        </div>
      </div>
    </div>
  );
};
