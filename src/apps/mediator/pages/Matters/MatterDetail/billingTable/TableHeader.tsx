import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./BillingsTable";
import "./style.scss";

interface Props {
  onSort(row: string, state: "up" | "down" | "normal"): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="matter-billing-header">
      <div className="matter-billing-header-item"></div>
      <div className="matter-billing-header-item">
        <span className="my-auto">Type</span>
      </div>
      <div className="matter-billing-header-item">
        <span className="my-auto">Hours</span>
      </div>
      <div className="matter-billing-header-item">
        <span className="my-auto">Description</span>
      </div>
      <div className="matter-billing-header-item">
        <span className="my-auto">Billable</span>
      </div>

      <div className="matter-billing-header-item sortable">
        <SortIcon
          state={sortData.client__user__first_name}
          label="Client"
          onClick={(state) => onSort("client__user__first_name", state)}
        />
      </div>
      <div className="matter-billing-header-item">
        <span className="my-auto">Amount</span>
      </div>
      <div className="matter-billing-header-item sortable">
        <SortIcon
          state={sortData.date}
          label="Date"
          onClick={(state) => onSort("date", state)}
        />
      </div>
      <div className="matter-billing-header-item sortable">
        <SortIcon
          state={sortData.billed_by__first_name}
          label="Billed by"
          onClick={(state) => onSort("billed_by__first_name", state)}
        />
      </div>
      <div className="matter-billing-header-item">
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
