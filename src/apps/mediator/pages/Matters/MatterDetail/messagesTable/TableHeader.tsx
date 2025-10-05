import SortImg from "assets/icons/sort.svg";
import SortUpImg from "assets/icons/sort_asc.svg";
import SortDownImg from "assets/icons/sort_desc.svg";
import { ISortData } from "./MessagesTable";

interface Props {
  onSort(row: "modified", state: "up" | "down" | "normal"): void;
  sortData: ISortData;
}
export const TableHeader = ({ onSort, sortData }: Props) => {
  return (
    <div className="client-matter-message-page__table-header">
      <div className="client-matter-message-page__table-header-item">
        <span className="my-auto">From</span>
      </div>
      <div className="client-matter-message-page__table-header-item">
        <span className="my-auto">Subject</span>
      </div>

      <div className="client-matter-message-page__table-header-item sortable">
        <span className="my-auto">Message</span>
      </div>
      <div className="client-matter-message-page__table-header-item sortable">
        <SortIcon
          state={sortData.modified}
          label="Date"
          onClick={(state) => onSort("modified", state)}
        />
      </div>
      <div className="client-matter-message-page__table-header-item">
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
