import React, {LegacyRef, forwardRef} from "react";
import classNames from "classnames";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  label: string;
  className?: string;
  hideFooter?: boolean;
  isExpanded?: boolean;
  onCollapseAll?(params: boolean): void;
  onCollapse?(): void;
  onNextSection?(): void;
  isCollapseAll?: boolean;
  isShowNext?: boolean;
}
export const FolderExpandable = forwardRef(({
  children,
  label,
  className,
  hideFooter,
  onCollapseAll = () => {},
  onNextSection = () => {},
  onCollapse = () => {},
  isExpanded = true,
  isCollapseAll = false,
  isShowNext = true,
}: Props, ref: LegacyRef<HTMLDivElement>) => {


  return (
    <div ref={ref} className={classNames("folder-expandable", className)}>
      <div className="folder-expandable-header">
        <div className="d-flex">
          <div className="folder-expandable-heading">
            <img
              src={ArrowIcon}
              alt="arrow"
              className={classNames({ isExpanded })}
            />
            {label}
          </div>
          <div className="folder-expandable-heading-after"/>
        </div>
        <div className="folder-expandable-expand" onClick={() => onCollapse()}>
          {isExpanded ? "Collapse section" : "Expand section"}
        </div>
      </div>
      <div
        className={classNames("folder-expandable-content", "mb-4", {
          isExpanded,
        })}
      >
        {children}
        {!hideFooter && (
          <div className="d-flex mt-3 mb-4">
            {isShowNext && (
              <div
                className="folder-expandable__btn next-btn"
                onClick={onNextSection}
              >
                Continue to next section
              </div>
            )}
            <div
              className="folder-expandable__btn ml-auto"
              onClick={() => onCollapseAll(isCollapseAll)}
            >
              {isCollapseAll ? "Expand all" : "Collapse all"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
