import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {
  Button,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FolderExpandable,
  FormUpload,
  FullScreenModal,
  FullScreenModalFooter,
  FormDatePicker,
  FormContactMultiSelect,
  FormCurrencyInputWrapper,
  FormCurrencyPrice,
  FormCurrencySelect,
  FormClientSelect,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
} from "components";
import { LeavePageModal } from "modals";
import styled from "styled-components";
import { useModal } from "hooks";
import { NewContactModal } from "modals";
import {
  useBasicDataContext,
  useAuthContext,
  useCommonUIContext,
  useMatterContext,
} from "contexts";
import { isEqual, cloneDeep, omit } from "lodash";
import { Formik, Form } from "formik";
import { convert2DBDate, acceptFileTypes } from "helpers";
import {
  getStages,
  createMatter,
  getMediatorsAndParalegals,
  getLeadClients,
  uploadFiles,
  updateMatter,
} from "api";
import { useQuery } from "react-query";
import * as Yup from "yup";
import { ClientInfo } from "./components";
import "./style.scss";

const validationSchema = Yup.object().shape({
  client: Yup.mixed().required("Client is required"),
  title: Yup.string().required("Title is required"),
  start_date: Yup.string().required("Start Date is required"),
  speciality: Yup.string().required("Practice area is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  // attachment: Yup.array().min(1, "Attachments are required"),
  is_billable: Yup.boolean(),
  fee_type: Yup.string().when("is_billable", {
    is: true,
    then: Yup.string().required("Fee type is required"),
  }),
  fee_note: Yup.string().when("fee_type", {
    is: (type) => +type === 4,
    then: Yup.string().required("Note is required"),
  }),
  rate: Yup.string().when("fee_type", {
    is: (type) => +type === 1 || +type === 2,
    then: Yup.string().required("Rate is required"),
  }),
  shared_with: Yup.array(),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  client?: number;
  onCreate?(): void;
  data?: any;
  clientData?: any;
  matterId?: any;
}
export const NewMatterModal = ({
  open,
  data,
  setOpen,
  onCreate = () => {},
  client,
  clientData = {},
  matterId,
}: Props) => {
  let reset = () => {};
  let setFormValue = (field, value) => {};
  const [caseStages, setCaseStages] = useState<{ id: number; title: string }[]>(
    []
  );
  const [selectedCity, setSelectedCity] = useState<any>(undefined);
  const { specialties, feeTypes, currencies } = useBasicDataContext();
  const { userId, userType, profile } = useAuthContext();
  const { setCreatedId } = useMatterContext();
  const [isChanged, setIsChanged] = useState(false);
  const { showErrorModal } = useCommonUIContext();
  const [selectedClient, setSelectedClient] = useState(clientData);
  const contactModal = useModal();
  const leaveModal = useModal();
  const expand = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [folderOpenStates, setFolderOpenStates] = useState([
    true,
    false,
    false,
    false,
  ]);

  const setFolderCollapse = (params) => {
    setFolderOpenStates((state) => {
      let temp = [...state];
      temp[params] = !temp[params];
      return temp;
    });
  };
  const setFolderAllCollapse = (index, params) => {
    setFolderOpenStates((state) => {
      let temp = [...state];
      temp = [params, params, params, params];
      temp[index] = true;
      return temp;
    });
  };
  const setNextFolderExpand = async (params) => {
    await setFolderOpenStates((state) => {
      let temp = [...state];
      temp[+params + 1] = true;
      return temp;
    });
    const nextElement: MutableRefObject<Element | null> = expand[params + 1]
    nextElement.current && nextElement.current.scrollIntoView({behavior: "smooth"});
  };

  const { isLoading: isSharesLoading, data: shareData } = useQuery<
    any[],
    Error
  >(["mediators_paralegals"], () => getMediatorsAndParalegals({}), {
    keepPreviousData: true,
    enabled: open,
  });

  const {
    isFetching: isFetchingClients,
    data: clientsData,
    refetch: refetchClients,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["leads_clients_client"],
    () => getLeadClients(userId, userType, profile.role),
    {
      keepPreviousData: true
    }
  );

  useEffect(() => {
    const init = async () => {
      let res = await getStages(userId);
      setCaseStages(res.results || []);
      setFolderOpenStates([true, false, false, false]);
    };
    if (open) init();
    return () => {};
  }, [open]);

  const handleClose = () => {
    if (isChanged) {
      leaveModal.setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleAddNewContact = async (params) => {
    if (params) {
      await refetchClients();
      let contact = params;
      if (!params?.id && params?.email) {
        const newContact = clientsData?.results.find(
          item => item.email === params.email
        )
        if (!newContact) return;
        contact = newContact;
      }
      setSelectedClient(contact);
      setFormValue("client", contact?.id);
    }
  };

  return (
    <FullScreenModal
      title={data ? "Edit Matter" : "Create Matter"}
      open={open}
      setOpen={(param) => {
        if (!param && isChanged) {
          leaveModal.setOpen(true);
        } else {
          setOpen(param);
          reset();
        }
      }}
    >
      <div className="matter-edit-page">
        <Formik
          initialValues={
            data || {
              client,
              title: "",
              description: "",
              start_date: "",
              stage: "",
              speciality: "",
              country: "",
              state: "",
              city: null,
              currency: 1,
              is_billable: true,
              fee_type: "",
              rate: "",
              shared_with: [],
              attachment: [],
              fee_note: "",
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              let uploadedAttachments: any[] = [];
              if (values.attachment.length > 0) {
                uploadedAttachments = await uploadFiles(
                  values.attachment.filter((file) => file.path) || [],
                  "documents",
                  matterId, // непонятно
                ); // ошибка
              }
              let req = cloneDeep(values);
              req.city = selectedCity;
              req.start_date = convert2DBDate(values.start_date);
              if (!req?.stage) {
                req = omit(req, ["stage"]);
              }
              if (!req?.rate) {
                req = omit(req, ["rate"]);
              }
              if (!req?.fee_note) {
                req = omit(req, ["fee_note"]);
              }
              if (!req?.description) {
                req = omit(req, ["description"]);
              }

              req.attachment = [
                ...uploadedAttachments,
                ...values.attachment.filter((file) => !!!file.path),
              ];
              if (data) {
                setCreatedId(matterId);
                await updateMatter(matterId, req);
              } else {
                const {data} = await createMatter(userId, req);
                setCreatedId(data.id);
              }
              onCreate();
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({
            values,
            setFieldValue,
            initialValues,
            errors,
            isSubmitting,
            resetForm,
          }) => {
            reset = resetForm;
            setFormValue = setFieldValue;
            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0;
            return (
              <Form>
                <FolderExpandable
                  label="Client Info"
                  ref={expand[0]}
                  onCollapse={() => setFolderCollapse(0)}
                  onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                  onNextSection={() => setNextFolderExpand(0)}
                  isExpanded={folderOpenStates[0]}
                  isCollapseAll={isEqual(folderOpenStates, [
                    true,
                    false,
                    false,
                    false,
                  ])}
                >
                  <div className="row mt-2">
                    {!data && (
                      <div className="col-12 row mb-3">
                        <div className="col-md-6">
                          <FormClientSelect
                            name="client"
                            onSelect={setSelectedClient}
                            isRequired
                            isLoading={isFetchingClients}
                            clientsData={clientsData}
                          />
                        </div>
                        <div className="col-md-6 d-flex">
                          <OR className="mt-2 mr-3">OR</OR>
                          <Button
                            size="large"
                            icon="plus"
                            onClick={() => contactModal.setOpen(true)}
                          >
                            New Contact
                          </Button>
                        </div>
                      </div>
                    )}
                    {values.client && (
                      <div className="col-12">
                        <ClientInfo
                          editable={!data}
                          data={selectedClient}
                          onClose={() => setFieldValue("client", "")}
                        />
                      </div>
                    )}
                  </div>
                </FolderExpandable>
                <FolderExpandable
                  label="Matter Details"
                  ref={expand[1]}
                  className="mt-3"
                  onCollapse={() => setFolderCollapse(1)}
                  onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                  onNextSection={() => setNextFolderExpand(1)}
                  isExpanded={folderOpenStates[1]}
                  isCollapseAll={isEqual(folderOpenStates, [
                    false,
                    true,
                    false,
                    false,
                  ])}
                >
                  <div className="row">
                    <FormInput
                      className="col-md-6 mt-2"
                      label="Matter Name"
                      name="title"
                      placeholder="E.g. Kathryn Murphy - Divorce"
                      isRequired
                    />
                    <FormDatePicker
                      className="col-md-6 mt-2"
                      label="Start Date"
                      name="start_date"
                      placeholder="Select Start Date"
                      isRequired
                    />
                    <FormTextarea
                      className="col-md-6 mt-2"
                      label="Description"
                      placeholder=""
                      name="description"
                    />
                    <div className="col-md-6 mt-2">
                      <FormSelect
                        values={specialties}
                        isRequired
                        label="Practice Area"
                        placeholder="Please select Practice Area"
                        help="Manage practice area in Edit profile"
                        name="speciality"
                      />

                      <FormSelect
                        label="Case stage"
                        values={caseStages}
                        className="mt-3"
                        placeholder="Please select Case stages"
                        help="Manage case stages in Settings"
                        name="stage"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-bold">Jurisdiction</div>
                  <div className="row mb-3">
                    <FormCountrySelect
                      isRequired
                      label="Country"
                      className="col-md-4 mt-1"
                      placeholder="Select a Country"
                      name="country"
                    />
                    <FormStateSelect
                      isRequired
                      className="col-md-4 mt-1"
                      label="State"
                      name="state"
                      placeholder="Select a State"
                      country={values.country}
                    />
                    <FormCitySelect
                      state={values.state}
                      isRequired
                      className="col-md-4 mt-1"
                      label="City"
                      name="city"
                      placeholder="Select a City"
                      onSelect={setSelectedCity}
                    />
                    <FormUpload
                      className="col-12 mt-2"
                      label="Attachment"
                      name="attachment"
                      acceptFileTypes={acceptFileTypes}
                    />
                  </div>
                </FolderExpandable>
                <FolderExpandable
                  label="Billing"
                  ref={expand[2]}
                  className="mt-3"
                  onCollapse={() => setFolderCollapse(2)}
                  onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                  onNextSection={() => setNextFolderExpand(2)}
                  isExpanded={folderOpenStates[2]}
                  isCollapseAll={isEqual(folderOpenStates, [
                    false,
                    false,
                    true,
                    false,
                  ])}
                >
                  <div className="mt-3">
                    <FormCheckbox name="is_billable">
                      Matter is billiable
                    </FormCheckbox>
                  </div>
                  {values.is_billable && (
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="row">
                          <FormSelect
                            values={feeTypes}
                            isRequired
                            name="fee_type"
                            className="col-md-6"
                            placeholder="Select fee type"
                          />
                        </div>
                      </div>
                      {values.fee_type === 1 ? (
                        <div className="col-md-6 mt-2">
                          <div className="text-dark"> Rate</div>
                          <FormCurrencyInputWrapper>
                            <FormCurrencyPrice
                              name="rate"
                              placeholder="Enter your rate"
                            />
                            <FormCurrencySelect
                              name="currency"
                              values={currencies}
                            />
                          </FormCurrencyInputWrapper>
                        </div>
                      ) : values.fee_type === 2 ? (
                        <FormInput
                          isRequired
                          className="col-md-6 mt-2"
                          label="Rate"
                          name="rate"
                          type="text"  
                          placeholder="Enter Hourly Rate"
                        />
                      ) : values.fee_type === 4 ? (
                        <FormInput
                          isRequired
                          className="col-md-6 mt-2"
                          label="Description"
                          name="fee_note"
                          placeholder="Input Description"
                        />
                      ) : null}
                    </div>
                  )}
                </FolderExpandable>
                <FolderExpandable
                  label="Share"
                  ref={expand[3]}
                  className="mt-3"
                  isShowNext={false}
                  onCollapse={() => setFolderCollapse(3)}
                  onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                  onNextSection={() => setNextFolderExpand(3)}
                  isExpanded={folderOpenStates[3]}
                  isCollapseAll={isEqual(folderOpenStates, [
                    false,
                    false,
                    false,
                    true,
                  ])}
                >
                  <div className="row">
                    <FormContactMultiSelect
                      values={(shareData || []).filter(
                        (item) => +item?.id !== +userId
                      )}
                      className="col-12 mt-1"
                      placeholder="Add people you want to share this matter with"
                      name="shared_with"
                      showAvatar
                      isLoading={isSharesLoading}
                    />
                  </div>
                </FolderExpandable>
                <FullScreenModalFooter>
                  <Button
                    className="ml-auto"
                    size="large"
                    theme="white"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    buttonType="submit"
                    size="large"
                    className="ml-3"
                    theme="yellow"
                    isLoading={isSubmitting}
                    disabled={hasChanged || hasErrors}
                  >
                    {data ? "Save Matter" : " Create Matter"}
                  </Button>
                </FullScreenModalFooter>
              </Form>
            );
          }}
        </Formik>
      </div>
      {
        contactModal?.open &&
        <NewContactModal
          {...contactModal}
          isForMatter
          onAdd={handleAddNewContact}
        />
      }
      {
        leaveModal?.open &&
        <LeavePageModal
          {...leaveModal}
          onLeave={() => {
            setOpen(false);
            reset();
          }}
        />
      }
    </FullScreenModal>
  );
};

// @ts-ignore
const OR = styled.span`
  color: #98989a;
  font-size: 14px;
  font-weight: bold;
  font-family: "DM Sans";
`;