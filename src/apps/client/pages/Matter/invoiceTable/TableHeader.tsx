import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./InvoicesTable";
import "./style.scss";

interface Props {
  onSort(
    row: "created" | "title" | "due_date" | "total_amount" | "number",
    state: "up" | "down" | "normal"
  ): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="client-matter-invoice-table-header">
      <div className="client-matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.total_amount}
          label="Amount"
          onClick={(state) => onSort("total_amount", state)}
        />
      </div>

      <div className="client-matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.title}
          label="Title"
          onClick={(state) => onSort("title", state)}
        />
      </div>
      <div className="client-matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.number}
          label="Invoice Number"
          onClick={(state) => onSort("number", state)}
        />
      </div>
      <div className="client-matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.due_date}
          label="Due Date"
          onClick={(state) => onSort("due_date", state)}
        />
      </div>

      <div className="client-matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.created}
          label="Created"
          onClick={(state) => onSort("created", state)}
        />
      </div>

      <div className="client-matter-invoice-table-header-item">
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
