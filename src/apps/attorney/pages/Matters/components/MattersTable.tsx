import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";
interface Props {
  data: any[];
  onUpdate?(): void;
  onSort?(param): void;
}
export interface ISortData {
  title: "up" | "down" | "normal";
  client__user__first_name: "up" | "down" | "normal";
  start_date: "up" | "down" | "normal";
  attorney__user__first_name: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  title: "normal",
  client__user__first_name: "normal",
  start_date: "normal",
  attorney__user__first_name: "normal",
};
export const MattersTable = ({
  data,
  onUpdate = () => {},
  onSort = () => {},
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (
    row:
      | "title"
      | "client__user__first_name"
      | "start_date"
      | "attorney__user__first_name",
    state: "up" | "down" | "normal"
  ) => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };
  return (
    <div className="matters-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => {
        return (
          <TalbeRow matter={item} key={`key${index}`} onUpdate={onUpdate} />
        );
      })}
    </div>
  );
};
