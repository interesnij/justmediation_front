import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./DocumentsTable";
import "./style.scss";
interface Props {
  onSort(row: "date", state: "up" | "down" | "normal"): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="matter-document-table-header">
      <div className="matter-document-table-header-item sortable">
        <SortIcon
          state={sortData.date}
          label="Name"
          onClick={(state) => onSort("date", state)}
        />{" "}
      </div>

      <div className="matter-document-table-header-item sortable">
        <span className="my-auto">Owner</span>
      </div>
      <div className="matter-document-table-header-item sortable">
        <SortIcon
          state={sortData.date}
          label="Last Modified"
          onClick={(state) => onSort("date", state)}
        />
      </div>
      <div className="matter-document-table-header-item">
        <span className="my-auto">Actions</span>
      </div>
    </div>
  );
};
interface ISortIconProps {
  state: "up" | "down" | "normal";
  onClick(state: "up" | "down" | "normal"): void;
  label: string;
}
const SortIcon = ({ state, onClick, label }: ISortIconProps) => {
  return (
    <>
      {state === "up" ? (
        <>
          <span className="my-auto" onClick={() => onClick("down")}>
            {label}
          </span>
          <img src={SortUpImg} alt="sort up" />
        </>
      ) : state === "down" ? (
        <>
          <span className="my-auto" onClick={() => onClick("normal")}>
            {label}
          </span>
          <img src={SortDownImg} alt="sort down" />
        </>
      ) : (
        <>
          <span className="my-auto" onClick={() => onClick("up")}>
            {label}
          </span>
          <img src={SortImg} alt="sort" />
        </>
      )}
    </>
  );
};
