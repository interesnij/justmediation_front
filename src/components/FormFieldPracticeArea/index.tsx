import React, {useState} from "react";
import {useField, FieldHookConfig} from "formik";
import styled from "styled-components";
import {Checkbox} from "components";
import DeleteImg from "../../assets/icons/delete_green.svg";
import EditImg from "../../assets/icons/edit.svg";
import {ActionConfirm, EditPracticeArea, SuccessModal} from "modals";
import {useModal} from "hooks";
import {useAuthContext, useCommonUIContext} from "contexts";
import {deleteSpecialty} from "api";
import "./style.scss";

type tSpecialty = { id: number; title: string, created_by: number | null };

type Props = FieldHookConfig<number[]> & {
  values: tSpecialty[];
  deletePracticeField: (event) => void;
  editPracticeField: (event) => void;
  refetchSpecialties?: (id?: number | string) => void;
};

export const FormFieldPracticeArea: React.FC<Props> =
  ({
     values,
     deletePracticeField,
     editPracticeField,
     refetchSpecialties = () => {
     },
     ...props
   }) => {
    const {userId} = useAuthContext();
    const {showErrorModal} = useCommonUIContext();
    const editModal = useModal();
    const confirmDeleteModal = useModal();
    const [activeItem, setActiveItem] = useState<tSpecialty | null>(null);
    const [field, meta, helpers] = useField(props);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeleteResult, setShowDeleteResult] = useState<boolean>(false);
    const [showEditResult, setShowEditResult] = useState<boolean>(false);

    const handleChange = (id: number) => {
      if (field.value.includes(id)) {
        helpers.setValue(field.value.filter((d) => d !== id));
      } else {
        helpers.setValue([...field.value, id]);
      }
    };

    const handleDeleteArea = (item) => {
      confirmDeleteModal.setOpen(true);
      setActiveItem(item);
    }

    const onDelete = async () => {
      if (!activeItem) return;
      setIsDeleting(true);
      try {
        await deleteSpecialty(activeItem.id);
        await refetchSpecialties();
        setShowDeleteResult(true);
      } catch (error) {
        showErrorModal("Error", error);
      } finally {
        setIsDeleting(false);
        confirmDeleteModal.setOpen(false);
      }
    }

    const showEditModal = (item) => {
      setActiveItem(item)
      editModal.setOpen(true)
    }

    return (
      <>  
        <div className="text-dark">Select practice areas you want to follow:</div>
        <div className="row">
          {values.map((item) => ( 
            <> 
            {(() => {
              if (item.id != 46) {
                return (
                  <div className="col-md-6 test my-1 d-flex justify-content-between practice-area-item">
              <Checkbox
                key={item.id}
                value={field.value?.includes(item.id)}
                onChange={() => handleChange(item.id)}
              >
                {item.title}
              </Checkbox>

              {Number(userId) === item.created_by &&
                <div className="practice-area-item__action">
                  <button type="button" onClick={() => handleDeleteArea(item)}>
                    <img src={DeleteImg} alt="icon"/>
                  </button>
                  <button type="button" onClick={() => showEditModal(item)}>
                    <img src={EditImg} alt="icon"/>
                  </button>
                </div>
              }
            </div>
              )
              }
            })()}
            
            </>
          ))}
        </div>
        <div className="row">
          <div className="col-md-6 my-1 d-flex justify-content-between practice-area-item">
              <Checkbox
                key={46}
                value={field.value?.includes(46)}
                onChange={() => handleChange(46)}
              >
                Other
              </Checkbox>
            </div>
        </div>

        {meta.touched && meta.error && <Error>{meta.error}</Error>}

        {confirmDeleteModal?.open &&
            <ActionConfirm
              {...confirmDeleteModal}
              loading={isDeleting}
              handleConfirm={onDelete}
              confirmButton="Delete"
              title="Delete the Practice Area"
              message="Are you sure you want to delete this practice area permanently?"
            />
        }
        {editModal?.open && activeItem &&
            <EditPracticeArea
              {...editModal}
              specialty={activeItem}
              callback={async () => {
                setShowEditResult(true);
                await refetchSpecialties();
              }}
            />
        }

        <SuccessModal
          title="Changes Saved"
          open={showEditResult}
          setOpen={() => {
          }}
          callback={() => setShowEditResult(false)}
        />

        <SuccessModal
          title="The practice area was deleted successfully."
          open={showDeleteResult}
          setOpen={() => {
          }}
          callback={() => setShowDeleteResult(false)}
        />
      </>
    );
  };

const Error = styled.div`
  color: #cc4b39;
  font-size: 14px;
`;
