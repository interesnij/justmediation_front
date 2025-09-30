import React, {useState} from "react";
import { useModal } from "hooks";
import { NewMatterStageModal } from "modals";
import { getStages, deleteMaterStage } from "api";
import { useQuery } from "react-query";
import { Button, Folder, FolderItem, RiseLoader } from "components";
import styled from "styled-components";
import { useAuthContext } from "contexts";
import DeleteImg from "assets/icons/delete_green.svg";
import EditImg from "assets/icons/edit.svg";
import {ActionConfirm, EditMatterStage} from "modals";

import "./style.scss";

export const MatterStages = () => {
  const stageModal = useModal();
  const editModal = useModal();
  const confirmDeleteModal = useModal();
  const { userId } = useAuthContext();
  const [activeStage, setActiveStage] = useState<{ id: number, title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleNewStage = () => {
    stageModal.setOpen(true);
  };

  const handleConfirmDeleteModal = (item: any) => {
    setActiveStage(item);
    confirmDeleteModal.setOpen(true);
  };

  const handleEditModal = (item: any) => {
    setActiveStage(item);
    editModal.setOpen(true);
  }

  const handleDeleteStage = async () => {
      setIsDeleting(true);
      try {
        await deleteMaterStage(activeStage!.id);
        await refetch();
      } catch (error) {
        console.log(error)
      } finally {
        setActiveStage(null);
        setIsDeleting(false);
        confirmDeleteModal.setOpen(false);
      }
  }

  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number },
    Error
  >(["matter-stages"], () => getStages(userId), {
    keepPreviousData: true,
  });

  return (
    <div className="settings settings-modal">
      <ButtonWrapper className="d-flex justify-content-end">
        <Button icon="plus" size="normal" onClick={handleNewStage}>
          New stage
        </Button>
      </ButtonWrapper>
      <Folder label="Manage Matter Stages" className="jumbo">
        {isLoading ? (
          <FolderItem>
            <RiseLoader className="my-4" />
          </FolderItem>
        ) : isError ? (
          <FolderItem>
            <div className="my-4 text-center text-gray">{error}</div>
          </FolderItem>
        ) : data?.results.length === 0 ? (
          <FolderItem>
            <div className="my-4 text-center text-gray">No stages</div>
          </FolderItem>
        ) : (
          data?.results.map((stage) => (
            <FolderItem key={stage.id} className="matter-stage-item">
              <div className="matter-stage-item__title">{stage.title}</div>
              <div className="matter-stage-item__action">
                <button onClick={() => handleConfirmDeleteModal(stage)}
                        className="matter-stage-item__icon-button ml-auto"
                >
                  <img
                    src={DeleteImg}
                    alt="icon"
                  />
                </button>
                <button onClick={() => handleEditModal(stage)}
                        className="matter-stage-item__icon-button ml-3"
                >
                  <img src={EditImg}
                       alt="icon"
                  />
                </button>
              </div>
            </FolderItem>
          ))
        )}
      </Folder>
      {stageModal?.open &&
        <NewMatterStageModal {...stageModal} onCreate={() => refetch()} />
      }
      {confirmDeleteModal?.open &&
        <ActionConfirm
          {...confirmDeleteModal}
          loading={isDeleting}
          handleConfirm={() => handleDeleteStage()}
          confirmButton="Delete"
          title="Delete Stage"
          message="Are you sure you want to delete this stage permanently?"
        />
      }
      {editModal?.open &&
        <EditMatterStage
          {...editModal}
          stage={activeStage!}
          callback={async () => {
            await refetch();
            await editModal.setOpen(false);
          }}
        />
      }
    </div>
  );
};

const ButtonWrapper = styled.div`
  position: absolute;
  right: 60px;
`;
