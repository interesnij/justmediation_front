import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";

export interface ISortData {
  modified: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  modified: "normal",
};
interface Props {
  data: any[];
  onUpdate?(): void;
  onSort?(param): void;
}
export const NotesTable = ({
  data = [],
  onUpdate = () => {},
  onSort = () => {},
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (row: "modified", state: "up" | "down" | "normal") => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };
  return (
    <div className="client-matter-message-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => (
        <TalbeRow key={`${index}key`} data={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
};
