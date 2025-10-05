/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { SideModal, InputEdit, User } from "components";
import { useInput, useDebounce, useOnClickOutside, useModal } from "hooks";
import { format } from "date-fns";
import styled from "styled-components";
import EditImg from "assets/icons/edit.svg";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";
import classNames from "classnames";
import { TagEditModal } from "./TagEdit";
import {
  updateDocument,
  updateFolder,
  removeShareWithFolder,
  removeShareWithDocument,
  addShareWithFolder,
  addShareWithDocument,
  getMediatorsAndParalegals,
} from "api";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import { getUserName } from "helpers";
import RecordingIcon from "assets/icons/recording.svg";
import FolderIcon from "assets/icons/folder.svg";
import DocumentIcon from "assets/icons/document.svg";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  data: any;
  rename?: boolean;
  type?: string;
  onUpdate?(): void;
  isVault?: boolean;
  renamable?: boolean;
}
export const DocumentDetailModal = ({
  open,
  setOpen,
  data,
  rename = false,
  isVault = false,
  type = "document",
  renamable = false,
  onUpdate = () => {},
}: Props) => {
  const { userType } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess()
  const tagedEditModal = useModal();
  const name = useInput(data?.title ?? "");
  const [value, setValue] = useState("");
  const debouncedSearchTerm = useDebounce(value, 500);
  const actionRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(actionRef, () => setShowMenu(false));

  useEffect(() => {
    if (open) {
      setValue("");
    }
    return () => {};
  }, [open]);

  const {
    isLoading,
    isFetching,
    data: mediatorsData,
    refetch: fetchMediator,
  } = useQuery<any[], Error>(
    ["mediators_paralegals", debouncedSearchTerm],
    () =>
      getMediatorsAndParalegals({
        search: debouncedSearchTerm,
        sharable: true,
      }),
    {
      keepPreviousData: true,
      enabled: open && !!debouncedSearchTerm,
    }
  );
  const handleChange = (param) => {
    setValue(param);
  };

  const handleSelect = async (params) => {
    setShowMenu(false);
    setValue("");
    if (data?.type === "Folder") {
      await addShareWithFolder(data.id, {
        shared_with: [params?.id],
      });
    } else {
      await addShareWithDocument(data.id, {
        shared_with: [params?.id],
      });
    }
    onUpdate();
  };
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setShowMenu(true);
        fetchMediator();
      } else {
        setShowMenu(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );
  const updateData = async (_title: string) => {
    if (data?.type === "Folder") {
      await updateFolder({
        id: data.id,
        data: {
          title: _title,
          parent: data.parent,
          matter: data.matter,
          shared_with: data.shared_with,
        },
      });
    } else {
      await updateDocument({
        id: data.id,
        data: {
          file: data.file,
          parent: data.parent,
          matter: data.matter,
          title: _title,
        },
      });
    }
    onUpdate();
  };

  const handleShareDelete = async (params) => {
    if (data?.type === "Folder") {
      await removeShareWithFolder(data.id, {
        shared_with: [params],
      });
    } else {
      await removeShareWithDocument(data.id, {
        shared_with: [params],
      });
    }
    onUpdate();
  };

  const updateTag = async (client, matter) =>{
    if (data?.type === "Folder") {
      const matterData = matter?.toString();
      await updateFolder({
        id: data.id,
        data: {
          title: name.value,
          matter: matterData,
          client
        },
      });
    } else {
      await updateDocument({
        id: data.id,
        data: {
          title: name.value,
          matter,
          client
        },
      });
    }
    onUpdate();
  }

  const setDocumentIcon = (data: any) => {
    if(data?.mime_type?.includes("audio")) {
      return RecordingIcon
    }
    return data?.type === "Folder" ? FolderIcon : DocumentIcon
  }

  return (
    <>
      <SideModal size="small" title="Detail" open={open} setOpen={setOpen} disableOutsideClick={tagedEditModal?.open}>
        <div className="d-flex">
          <img
            src={setDocumentIcon(data)}
            alt="folder"
            className="mr-1"
          />
          {hasSubscription &&
            <div className="flex-1">
              <InputEdit
                {...name}
                renamable={renamable}
                edit={rename}
                onChangeName={(name) => updateData(name)}
              />
            </div>
          }
        </div>
        <div className="mt-4">
          <div className="d-flex">
            <Name>OWNER</Name>
            <Value>{`${data?.owner_data?.first_name} ${
              data?.owner_data?.middle_name ?? ""
            } ${data?.owner_data?.last_name}`}</Value>
          </div>
        </div>
        <div className="mt-2">
          <div className="d-flex">
            <Name>LAST MODIFIED</Name>
            <Value>
              {format(new Date(data?.modified), "MM/dd/yyyy hh:mm:ss a")}
              <br/>
              {`${data?.owner_data?.first_name} ${
                data?.owner_data?.middle_name ?? ""
              } ${data?.owner_data?.last_name}`}
            </Value>
          </div>
        </div>
        {!isVault && (
          <>
            {type === "document" && (
              <>
                <div className="divider my-2"></div>
                <div className="d-flex">
                  <Heading>Tagged to</Heading>
                  {
                    userType !== 'client' && hasSubscription &&
                    <IconButton className="ml-auto my-auto" onClick={() => {tagedEditModal.setOpen(true);}}>
                      <img src={EditImg} alt="edit" />
                    </IconButton>
                  }
                </div>
                <div className="mt-2">
                  <div className="d-flex">
                    <Name>Client</Name>
                    <Value className="text-ellipsis text-left">
                      {getUserName(data?.client_data)}
                    </Value>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="d-flex">
                    <Name>Matter</Name>
                    <Value className="text-ellipsis">
                      {data?.matter_data?.title}
                    </Value>
                  </div>
                </div>
              </>
            )}
            <div className="divider my-2"></div>
            <div className="d-flex mb-2">
              <Heading>Shared with</Heading>
              <span className="ml-1 my-auto text-gray">
                {(data?.shared_with_data || []).length}
              </span>
            </div>

            <div className="contact-search-control__container" ref={actionRef}>
              {hasSubscription &&
                  <div
                      className={classNames("contact-search-control__main", {
                        active: showMenu,
                      })}
                  >
                      <input
                          type="text"
                          placeholder={"Add people"}
                          value={value}
                          onFocus={() => setShowMenu(!!value && true)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e.target.value)
                          }
                      />
                  </div>
              }

              <div
                className={classNames("contact-search-control__menu", {
                  active: showMenu,
                })}
              >
                {isLoading || isFetching ? (
                  <div className="d-flex w-100 my-1">
                    <ClipLoader
                      css={`
                        margin: auto;
                      `}
                      size={32}
                      color={"rgba(0, 0, 0, 0.8)"}
                    />
                  </div>
                ) : mediatorsData &&
                  mediatorsData.filter((a) => !data?.shared_with.includes(a.id))
                    .length > 0 ? (
                  mediatorsData
                    .filter((a) => !data?.shared_with.includes(a.id))
                    .map((item, index: number) => {
                      return (
                        <div
                          className={classNames(
                            "contact-search-control__menu-item"
                          )}
                          key={item?.user_id}
                          onClick={() => handleSelect(item)}
                        >
                          <User
                            size="small"
                            avatar={item.avatar}
                            className="mr-1"
                          />
                          <span className="my-auto">{getUserName(item)}</span>
                          <span className="ml-auto my-auto">{item.email}</span>
                        </div>
                      );
                    })
                ) : (
                  <div className="mx-auto my-2 text-center">Empty</div>
                )}
              </div>
            </div>
            {data?.shared_with_data &&
              data?.shared_with_data.map((item, index) => (
                <div key={`${index}key`} className="d-flex mt-2">
                  <User userName={getUserName(item)} avatar={item?.avatar} />
                  <span className="text-dark ml-auto my-auto text-bold">
                    {item?.user_type ? item?.user_type?.toUpperCase() : ""}
                  </span>

                  {hasSubscription &&
                      <span
                          className="text-gray ml-4 my-auto cursor-pointer text-bold"
                          onClick={() => handleShareDelete(item?.id)}
                      >
                    Delete
                  </span>
                  }
                </div>
              ))}
          </>
        )}
      </SideModal>
      {
        tagedEditModal?.open &&
        <TagEditModal
          {...tagedEditModal}
          matter={data?.matter_data?.id}
          client={data?.client_data?.id}
          updateTag={updateTag}
        />
      }
    </>
  );
};

const Name = styled.div`
  min-width: 120px;
  color: #616161;
  font-size: 12px;
  line-height: 26px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;
const Value = styled.div`
  color: #000;
  font-size: 14px;
  line-height: 26px;
  text-align: left;
`;
const Heading = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #2e2e2e;
`;
const IconButton = styled.div`
  img{
    width: 20px;
    height: 20px;
  }
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;
