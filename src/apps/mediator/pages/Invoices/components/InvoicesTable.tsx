import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";
interface Props {
  data: any[];
  onUpdate?(): void;
  onSort?(param): void;
  openEdit?(id:number): void;
  userType: string;
}
export interface ISortData {
  created: "up" | "down" | "normal";
  title: "up" | "down" | "normal";
  due_date: "up" | "down" | "normal";
  total_amount: "up" | "down" | "normal";
  number: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  created: "normal",
  title: "normal",
  due_date: "normal",
  total_amount: "normal",
  number: "normal",
};
export const InvoicesTable = ({
  data = [],
  onUpdate = () => {},
  onSort = () => {},
  openEdit = () => {},
  userType
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (
    row: "created" | "title" | "due_date" | "total_amount" | "number",
    state: "up" | "down" | "normal"
  ) => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };
  return (
    <div className="invoices-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => (
        <TalbeRow data={item} key={`${index}key`} onUpdate={onUpdate} openEdit={openEdit} userType={userType} />
      ))}
    </div>
  );
};
