import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./InvoicesTable";
import "./style.scss";

interface Props {
  onSort(
    row: "amount" | "invoiceNumber" | "dueDate" | "created",
    state: "up" | "down" | "normal"
  ): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="matter-invoice-table-header">
      <div className="matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.amount}
          label="Amount"
          onClick={(state) => onSort("amount", state)}
        />
      </div>

      <div className="matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.invoiceNumber}
          label="Invoice Number"
          onClick={(state) => onSort("invoiceNumber", state)}
        />
      </div>
      <div className="matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.dueDate}
          label="Due Date"
          onClick={(state) => onSort("dueDate", state)}
        />
      </div>

      <div className="matter-invoice-table-header-item sortable">
        <SortIcon
          state={sortData.created}
          label="Created"
          onClick={(state) => onSort("created", state)}
        />
      </div>

      <div className="matter-invoice-table-header-item">
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
