import React from "react";
import { Link } from "@reach/router";
import classNames from "classnames";
import { User, Button } from "components";
import styled from "styled-components";
import { useModal } from "hooks";
import { NewMatterModal } from "modals";
import "./../style.scss";
interface Props {
  className?: string;
  data: any[];
  onUpdate?(): void;
  userType: string;
}
export default function OpenMatters({
  className,
  data = [],
  onUpdate = () => {},
  userType
}: Props) {
  const matterModal = useModal();

  const isParalegal = userType && ['paralegal', 'other'].indexOf(userType) !== -1
    ? true : false;

  return (
    <div className={classNames("open-matters", className)}>
      <div className="open-matters__header">
        <div className="open-matters__item">
          <span>Matter</span>
        </div>
        <div className="open-matters__item">
          <span>Client</span>
        </div>
        <div className="open-matters__item">
          <span>Rate</span>
        </div>
        <div className="open-matters__item">
          <span>Practice area</span>
        </div>
        <div className="open-matters__item">
          <span>Principle</span>
        </div>
      </div>
      {data.length === 0 ? (
        <Back>
          <div className="d-flex justify-content-center pt-2">
            <div className="my-2 text-center text-gray">
              You currently have no open matters
            </div>
          </div>
          {!isParalegal && (
            <div className="d-flex justify-content-center pb-4">
              <Button onClick={() => matterModal.setOpen(true)} type="outline">
                + New Matter
              </Button>
            </div>
          )}
        </Back>
      ) : (
        data.map((item, index) => (
          <div key={`${index}key`} className="open-matters__row">
            <div className="open-matters__item text-ellipsis">
              <Link to={`/${userType}/matters/${item.id}`}>{item?.title}</Link>
            </div>
            <div className="open-matters__item">
              <User userName={item?.client_name} avatar={item?.client_avatar} />
            </div>
            <div className="open-matters__item">
              <span>{item?.fee_type}</span>
            </div>
            <div className="open-matters__item">
              <span className="text-ellipsis d-block" style={{ maxWidth: 140 }}>
                {item?.practice_area}
              </span>
            </div>
            <div className="open-matters__item">
              <User
                userName={item?.principle_name}
                avatar={item?.principle_avatar}
              />
            </div>
          </div>
        ))
      )}
      {matterModal?.open && data.length === 0 && (
        <NewMatterModal {...matterModal} onCreate={onUpdate} />
      )}
    </div>
  );
}

const Back = styled.div`
  background: white;
`;
