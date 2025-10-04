import React, { useState, useEffect } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";
import SearchIcon from "assets/icons/search.svg";
import "./style.scss";

interface Props {
  members: {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone?: string;
    is_mediator: boolean;
    is_paralegal: boolean;
    state: string;
  }[];
  onDelete?(): void;
}

const initSortData = { first_name: "normal" };

export const MembersTable = ({
  members,
  onDelete = () => {}
}: Props) => {
  const [sortData, setSortData] = useState(initSortData);
  const [list, setList] = useState(members);
  const [sortField, setSortField] = useState("first_name");
  const [query, setQuery] = useState("");

  const handleSort = (row: string, state: "up"|"down"|"normal") => {
    const newSortData = { 
      ...initSortData,
      [row]: state
    };
    setSortData(newSortData);
    setSortField(row);
    setList(
      filterList(
        sortList(row, state)
      )
    );
  };

  const sortList = (row: string, state) => {
    switch (state) {
      case 'up': 
        return [...members].sort((a,b) => a[row] > b[row] ? 1 : a[row] < b[row] ? -1 : 0);
      case 'down': 
        return [...members].sort((a,b) => b[row] > a[row] ? 1 : b[row] < a[row] ? -1 : 0);
      case 'normal': 
      default:
        return members;
    }
  }

  const filterList = (list) => {
    if (!query) 
      return list;
    return list.filter(item => 
      String(item?.first_name)?.toLowerCase().indexOf(query) !== -1 ||
      String(item?.last_name)?.toLowerCase().indexOf(query) !== -1
    );
  }

  useEffect(() => {
    setList(
      filterList(
        sortList(sortField, sortData[sortField])
      )
    );
  }, [query])

  useEffect(() => {
    setList(members);
  }, [members]);

  return (
    <div className="members-page__table">
      <div className="search-bar-container mt-4 mb-2">
        <img src={SearchIcon} alt="search" />
        <input placeholder="Search members" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {list?.length ? (
        <>
          <TableHeader
            onSort={(row, state) => handleSort(row, state)}
            sortData={sortData}
          />
          {list.map((item, index) => {
            return (
              <TalbeRow member={item} key={`key${index}`} onDelete={onDelete} />
            );
          })}
        </>
      ) : (
        <div className="my-3 text-center text-gray">No results</div>  
      )}
    </div>
  );
};
