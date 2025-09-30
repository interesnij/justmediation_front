import React, { useState } from "react";
import {Button, Folder, FolderItem, Modal, RiseLoader} from "components";
import {getPaymentMethod} from "api";
import {Card} from "./Card";
import {useModal} from "hooks";
import {useQuery} from "react-query";
import {AddCardModal, DeletePaymentMethod, UpdatePaymentCard} from "modals";
import {removePaymentMethod} from "api";

export const PaymentMethods: React.FC = () => {
  const resultModal = useModal();
  const addModal = useModal();
  const updateModal = useModal();
  const confirmDeleteModal = useModal();
  const [activeCard, setActiveCard] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const {isLoading, isError, error, data, refetch} = useQuery<any, Error>(
    ["client-payment"],
    () => getPaymentMethod(),
    {
      keepPreviousData: true,
    }
  );

  const handleAddCard = () => {
    addModal.setOpen(true);
  };

  const handleUpdateCard = (data) => {
    setActiveCard(data)
    updateModal.setOpen(true);
  };

  const showConfirmDeleteModal = card => {
    confirmDeleteModal.setOpen(true);
    setActiveCard(card);
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    await removePaymentMethod(activeCard?.id);
    await refetch();
    setDeleteLoading(false);
    await confirmDeleteModal.setOpen(false)
    setActiveCard(null);
  }

  return (
    <div className="settings">
      <Folder
        label="Cards"
        className="mb-4"
        headerComponent={<Button onClick={handleAddCard}>Add Card</Button>}
      >
        {isLoading ? (
          <FolderItem>
            <RiseLoader className="my-4"/>
          </FolderItem>
        ) : isError ? (
          <div className="my-4">{error}</div>
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <FolderItem key={`${index}key`}>
              <Card
                isCard
                isConfirmedAccount={true}
                isDefaultPaymentMethod={true}
                data={item}
                onRemove={showConfirmDeleteModal}
                handleUpdateCard={handleUpdateCard}
              />
            </FolderItem>
          ))
        ) : (
          <FolderItem>
            <div className="my-4 text-center">No Cards</div>
          </FolderItem>
        )}
      </Folder>
      {resultModal?.open && <Modal {...resultModal} title="Submitted Successfully">
        <div className="pb-4" style={{width: 600}}>
          <div className="text-black" style={{fontSize: 18}}>
              Submitted Successfully!
          </div>
        </div>
        <div className="d-flex mt-4">
          <Button
            className="ml-auto"
            onClick={() => {
              resultModal.setOpen(false);
            }}
          >
            Ok
          </Button>
        </div>
        </Modal>
      }
      {confirmDeleteModal?.open &&
        <DeletePaymentMethod
          modalProps= {confirmDeleteModal}
          handleDelete={handleDelete}
          activeCard={activeCard}
        />
      }
      {addModal?.open && <AddCardModal {...addModal} onCreate={() => refetch()} />}
      {updateModal?.open &&
        <UpdatePaymentCard
          {...updateModal}
          onCreate={() => refetch()}
          data={activeCard}
        />
      }
    </div>
  );
};
