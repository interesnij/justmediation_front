import React, { useEffect } from "react";
import "./style.scss";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import classNames from "classnames";
import { MATTERS_PER_PAGE } from "config";

interface Props {
  pageRangeDisplayed?: number;
  tatalCount?: number;
  countPerPage?: number;
  marginPagesDisplayed?: number;
  onChange?(selected: number): void;
  className?: string;
  value?: number;
  currentFolderId?: number;
}
export const Pagination = ({
  value,
  pageRangeDisplayed = 2,
  tatalCount = 10,
  marginPagesDisplayed = 1,
  onChange = () => {},
  className,
  countPerPage = MATTERS_PER_PAGE,
  currentFolderId,
}: Props) => {
  
  useEffect(() =>{
  //  onChange(0); // when folder path changes, make page number to 0 as initial
  }, [currentFolderId]);

  return tatalCount ? (
    <ReactPaginate
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={Math.abs((tatalCount ?? 0) / countPerPage)}
      marginPagesDisplayed={marginPagesDisplayed}
      pageClassName="pagination-control__page"
      activeClassName="pagination-control__active"
      previousClassName="pagination-control__arrow"
      nextClassName="pagination-control__arrow"
      disabledClassName="pagination-control__page"
      breakClassName="pagination-control__page"
      containerClassName={classNames(
        "pagination-control__container",
        className
      )}
      previousLabel={<FaAngleLeft />}
      nextLabel={<FaAngleRight />}
      forcePage={value}
      onPageChange={({ selected }) => onChange(selected)}
    />
  ) : null;
};
