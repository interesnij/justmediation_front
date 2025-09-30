import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import TalbeRow from "./TableRow";

export interface ISortData {
  title: "up" | "down" | "normal";
  modified: "up" | "down" | "normal";
}
const initSortData: ISortData = {
  title: "normal",
  modified: "normal",
};
interface Props {
  data: any[];
  onFolderClick?(params): void;
  onUpdate?(): void;
  onSort?(param): void;
}
export const DocumentsTable = ({
  data,
  onFolderClick,
  onUpdate = () => {},
  onSort = () => {},
}: Props) => {
  const [sortData, setSortData] = useState<ISortData>(initSortData);
  const handleSort = (
    row: "title" | "modified",
    state: "up" | "down" | "normal"
  ) => {
    let temp = { ...initSortData };
    temp[row] = state;
    setSortData(temp);
    onSort(state === "normal" ? "" : state === "up" ? row : `-${row}`);
  };
  return (
    <div className="my-documents-page__table mt-2">
      <TableHeader
        onSort={(row, state) => handleSort(row, state)}
        sortData={sortData}
      />
      {data.map((item: any, index: number) => (
        <TalbeRow
          data={item}
          key={`${index}key`}
          onFolderClick={onFolderClick}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
