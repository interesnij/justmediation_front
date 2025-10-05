import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";
import { nanoid } from "nanoid";

interface Props {
  data: any[];
  onUpdate?(): void;
  onSort?(param): void;
}
export interface ISortData {
  matters_count: "up" | "down" | "normal";
  name: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  matters_count: "normal",
  name: "normal",
};
export const LeadsTable = ({
  data,
  onUpdate = () => {},
  onSort = () => {},
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (
    row: "matters_count" | "name",
    state: "up" | "down" | "normal"
  ) => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };
  return (
    <div className="leads-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => {
        return <TalbeRow data={item} key={nanoid()} onUpdate={onUpdate} />;
      })}
    </div>
  );
};
