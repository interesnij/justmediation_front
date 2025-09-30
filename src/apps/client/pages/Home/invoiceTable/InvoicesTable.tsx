import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";

export interface ISortData {
  amount: "up" | "down" | "normal";
  invoiceNumber: "up" | "down" | "normal";
  dueDate: "up" | "down" | "normal";
  created: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  amount: "normal",
  invoiceNumber: "normal",
  dueDate: "normal",
  created: "normal",
};
interface Props {
  data: any;
  onUpdate?(): void;
}

export const InvoicesTable = ({ data = [], onUpdate = () => {} }: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (
    row: "amount" | "invoiceNumber" | "dueDate" | "created",
    state: "up" | "down" | "normal"
  ) => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
  };
  return (
    <div className="invoices-page__table">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item, index) => (
        <TalbeRow data={item} key={`${index}key`} onUpdate={onUpdate} />
      ))}
    </div>
  );
};
