import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./MattersTable";
import "./../style.scss";

interface Props {
  onSort(
    row:
      | "title"
      | "client__user__first_name"
      | "start_date"
      | "mediator__user__first_name",
    state: "up" | "down" | "normal"
  ): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="matters-page__table-header">
      <div className="matters-page__table-header-item sortable">
        <SortIcon
          state={sortData.title}
          label="Matter"
          onClick={(state) => onSort("title", state)}
        />
      </div>
      <div className="matters-page__table-header-item sortable">
        <SortIcon
          state={sortData.client__user__first_name}
          label="Client"
          onClick={(state) => onSort("client__user__first_name", state)}
        />
      </div>
      <div className="matters-page__table-header-item">
        <span className="my-auto">Status</span>
      </div>
      <div className="matters-page__table-header-item">
        <span className="my-auto">Rate</span>
      </div>
      <div className="matters-page__table-header-item">
        <span className="my-auto">Practice area</span>
      </div>
      <div className="matters-page__table-header-item sortable">
        <SortIcon
          state={sortData.start_date}
          label="Start date"
          onClick={(state) => onSort("start_date", state)}
        />
      </div>
      <div className="matters-page__table-header-item sortable">
        <SortIcon
          state={sortData.mediator__user__first_name}
          label="Principle"
          onClick={(state) => onSort("mediator__user__first_name", state)}
        />
      </div>
      <div className="matters-page__table-header-item">
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
