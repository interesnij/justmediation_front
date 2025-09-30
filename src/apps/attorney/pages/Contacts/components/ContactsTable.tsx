import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";
import "./../style.scss";
interface Props {
  data: any[];
  onDelete?(): void;
}
export interface ISortData {
  name: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  name: "normal",
};
export const ContactsTable = ({ data, onDelete = () => {} }: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (row: "name", state: "up" | "down" | "normal") => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
  };
  return (
    <>
      <div className="contacts-page__table">
        <TableHeader
          onSort={(row, state) => handleSort(row, state)}
          sortData={sortData}
        />
        {data.map((item, index) => {
          return (
            <TalbeRow contact={item} onDelete={onDelete} key={`key${index}`} />
          );
        })}
      </div>
    </>
  );
};
