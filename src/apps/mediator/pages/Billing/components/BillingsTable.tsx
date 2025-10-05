import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TableRow from "./TableRow";
interface Props {
  data: any[];
  checkedValues?: any[];
  onCheck?(params: number): void;
  onDelete?(): void;
  onSort?(param): void;
}
export interface ISortData {
  matter__title: "up" | "down" | "normal";
  client__user__first_name: "up" | "down" | "normal";
  date: "up" | "down" | "normal";
  billed_by__first_name: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  matter__title: "normal",
  client__user__first_name: "normal",
  date: "normal",
  billed_by__first_name: "normal",
};
export const BillingsTable = ({
  data,
  checkedValues = [],
  onCheck = () => {},
  onDelete = () => {},
  onSort = () => {},
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (row: string, state: "up" | "down" | "normal") => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };

  return (
    <div className="billings-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => (
        <TableRow
          data={item}
          key={`${index}key`}
          isChecked={checkedValues.map((a) => a?.id).includes(item?.id)}
          onCheck={onCheck}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
