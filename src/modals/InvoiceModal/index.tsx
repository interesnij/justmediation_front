/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useMemo} from "react";
import {
  Button,
  FormInput,
  FormSelect,
  FormContactSelect,
  Folder,
  FolderItem,
  FullScreenModal,
  FullScreenModalFooter,
  FormTextarea,
  FormCheckbox,
  FormDayInput,
  RiseLoader, FormTaxRate
} from "components";
import formatDuration from "format-duration";
import {AddBillingItemModal, AddExpenseEntry, AddFlatEntry, AddTimeEntry, DeleteConfirmationModal} from "modals";
import {isEqual} from "lodash";
import {Row, DeleteIcon, BillingHeading, SummaryRow, TotalRow, AddItem, CreditCard} from "./styled";
import {useAuthContext, useCommonUIContext} from "contexts";
import {useQuery} from "react-query";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {useModal} from "hooks";
import numeral from "numeral";
import {
  createInvoice,
  getClientsForInvoice,
  getMatters,
  draftInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  reopenInvoice
} from "api";
import {getUserName} from "helpers";
import CardVisaImg from "assets/images/card_visa.png";
import CardMasterImg from "assets/images/card_master.png";
import CardExpressImg from "assets/images/card_express.png";
import CardDiscoverImg from "assets/images/card_discover.png";
import DeleteImg from "assets/icons/delete.svg";
import "./style.scss";

const validationSchema = Yup.object().shape({
  client: Yup.string().required("Client is required"),
  matter: Yup.string().required("Matter is required"),
  billing_items: Yup.array().min(1).required("Billing is required"),
  due_days: Yup.string().required("Due days is required"),
  email: Yup.string().email().required("Email is required"),
});

interface Props {
  open: boolean;

  setOpen(param: boolean): void;

  matter?: number;
  client?: number;
  defaultBilling?: any[];

  onCreate?(): void;

  invoiceId?: any;
}

export const InvoiceModal = ({
                               open,
                               setOpen,
                               matter,
                               client,
                               defaultBilling = [],
                               onCreate = () => {},
                               invoiceId
                             }: Props) => {
  let reset = () => {
  };
  let setFormValue = (field, value) => {
  };
  const {userId, profile} = useAuthContext();
  const [billingData, setBillingData] = useState<any[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [total, setTotal] = useState("0");
  const [subtotal, setSubtotal] = useState("0");
  const [activeBilling, setActiveBilling] = useState();
  const [innerClient, setInnerClient] = useState(client);

  const expenseModal = useModal();
  const timeModal = useModal();
  const flatModal = useModal();
  const billingModal = useModal();
  const deleteConfirmation = useModal();
  const {showErrorModal} = useCommonUIContext();

  const {isLoading: isClientsLoading, data: clientsData} = useQuery<{ results: any[]; count: number },
    Error>(["leads_clients_invoice"], () => getClientsForInvoice(userId), {
    keepPreviousData: true,
    enabled: open,
  });

  const {data: invoiceData, isFetching: isFetchingInvoice} = useQuery<any, Error>(
    ["invoice-detail"],
    () => getInvoiceById(invoiceId),
    {
      keepPreviousData: true,
      enabled: !!invoiceId
    }
  );


  const {isLoading: isMattersLoading, data: matterData} = useQuery<{ results: any[]; count: number },
    Error>(["matters-all", innerClient], () =>   getMatters({
      client: innerClient,
    }), {
    keepPreviousData: true,
    enabled: open,
  });

  const handleAddBilling = () => {
    billingModal.setOpen(true);
  };

  const handleCreateBilling = (params) => {
    setFormValue("billing_items", [
      ...billingData.map((item) => item?.id),
      params?.id,
    ]);
    setBillingData([...billingData, params]);
  };


  const handleSaveDraft = async (values) => {
    let payment_method: number[] = [];
    if (values["payment-debit"]) {
      payment_method.push(1);
    }
    if (values["payment-credit"]) {
      payment_method.push(2);
    }
    try {
      setIsSavingDraft(true);
      const payload = {
        matter: values.matter,
        client: values.client,
        billing_items: values.billing_items,
        email: values.email,
        note: values.note,
        due_days: values.due_days,
        tax_rate: values.tax_rate || 0,
        payment_method
      };
      let response = invoiceId
        ? await updateInvoice(invoiceId, payload)
        : await draftInvoice(payload);

      // @ts-ignore
      if (response?.response?.status === 400) {
        showErrorModal("Error", response);
      }
      onCreate();
      setOpen(false);
    } catch (error: any) {
      showErrorModal("Error", error);
    } finally {
      setIsSavingDraft(false)
    }
  };

  const handleDelete = async () => {
    if (!invoiceId) return;
    await deleteInvoice(invoiceId);
    setOpen(false);
    onCreate();
  }

  useEffect(() => {
    if (open && !invoiceId && defaultBilling && defaultBilling?.length) {
      const billingItems = defaultBilling;
      setBillingData(billingItems);
      setFormValue(
        "billing_items",
        billingItems.map((item) => item?.id)
      );
    }
  }, [open, defaultBilling, invoiceId])

  useEffect(() => {
    if (open && invoiceId) {
      const billingItems = invoiceData?.billing_items_data || defaultBilling || [];
      setBillingData(billingItems);
      setFormValue(
        "billing_items",
        billingItems.map((item) => item?.id)
      );
    }
    return () => {
    };
  }, [open, invoiceData]);


  const totalBillableHours = useMemo(() => {
    if (!billingData) return '00:00:00'
    let total = formatDuration(
      billingData
        .map((item) => {
          if (item.time_spent && item.is_billable) {
            return (
              +item.time_spent.split(":")[0] * 3600 +
              +item.time_spent.split(":")[1] * 60 +
              +item.time_spent.split(":")[2]
            );
          }
          return 0;
        })
        .reduce((a, b) => a + b, 0) * 1000,
      {leading: true}
    ) || '00:00:00';
    if (total.length < 6) {
      total = '00:' + total;
    }
    return total;
  }, [billingData]);

  const totalNonBillableHours = useMemo(() => {
    if (!billingData) return '00:00:00'

    let total = formatDuration(
      billingData
        .filter((item) => item.is_billable === false)
        .map((item) => {
          if (item.time_spent) {
            return (
              +item.time_spent.split(":")[0] * 3600 +
              +item.time_spent.split(":")[1] * 60 +
              +item.time_spent.split(":")[2]
            );
          }
          return 0;
        })
        .reduce((a, b) => a + b, 0) * 1000,
      {leading: true}
    ) || '00:00:00';
    if (total.length < 6) {
      total = '00:' + total;
    }
    return total;
  }, [billingData]);

  useEffect(() => {
    if (!billingData) {
      setTotal("0.00");
      setSubtotal("0.00");
      return;
    }

    const totalPrice = billingData.reduce(
      (a, b) => ({
        fees: +a.fees + (b.is_billable ? +b.fees : 0),
      }),
      {fees: 0}
    ).fees

    let subtotalPrice = billingData.reduce(
      (a, b) => ({
        fees: +a.fees + (b.is_billable ? +b.fees : 0),
      }),
      {fees: 0}
    ).fees

    setTotal(totalPrice);
    setSubtotal(subtotalPrice);

  }, [billingData]);

  const removeBilling = (event, id) => {
    event.stopPropagation();
    setFormValue(
      "billing_items",
      billingData.filter((item) => +item?.id !== +id).map((item) => item?.id)
    );
    setBillingData(billingData.filter((item) => +item?.id !== +id));
  };

  const showExpenseEntriesModal = data => {
    setActiveBilling(data);
    expenseModal.setOpen(true);
  }

  const showTimeEntriesModal = (event, data) => {
    setActiveBilling(data);
    timeModal.setOpen(true);
  }

  const showFlatFeeModal = data => {
    setActiveBilling(data);
    flatModal.setOpen(true);
  }

  return (
    <FullScreenModal
      title={invoiceId ? "Edit Invoice" : "Create Invoice"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="create-invoice-modal">
        {invoiceId && isFetchingInvoice ? (
          <RiseLoader className="my-auto"/>
        ) : (
          <Formik
            enableReinitialize
            // check edit or create window
            initialValues={invoiceId ? {
              matter: invoiceData?.matter || matter,
              client: invoiceData?.client || client,
              billing_items: invoiceData?.billing_items || defaultBilling,
              due_days: invoiceData?.due_days || "",
              email: invoiceData?.email || defaultBilling[0]?.client_data?.email || "",
              note: invoiceData?.note || "",
              tax_rate: (Number(invoiceData?.tax_rate) === 0 || !invoiceData?.tax_rate) ? profile?.tax_rate : invoiceData?.tax_rate,
              "payment-debit": true,
              "payment-credit": true
            } : {
              matter: invoiceData?.matter || matter,
              client: invoiceData?.client || client,
              billing_items: [],
              due_days: "",
              email: defaultBilling[0]?.client_data?.email || "",
              note: "",
              tax_rate: (Number(invoiceData?.tax_rate) === 0 || !invoiceData?.tax_rate) ? profile?.tax_rate : invoiceData?.tax_rate,
              "payment-debit": true,
              "payment-credit": true
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {

              let payment_method: number[] = [];
              if (values["payment-debit"]) {
                payment_method.push(1);
              }
              if (values["payment-credit"]) {
                payment_method.push(2);
              }

              try {
                const payload = {
                  matter: values.matter,
                  client: values.client,
                  billing_items: values.billing_items,
                  email: values.email,
                  note: values.note,
                  due_days: values.due_days,
                  tax_rate: values?.tax_rate,
                  payment_method
                };
                if (invoiceId) {
                  const response = await updateInvoice(invoiceId, payload);
                  const responseInvoice = await reopenInvoice(invoiceId);
                  // @ts-ignore
                  if (responseInvoice?.response?.status === 400) {
                    showErrorModal("Error", responseInvoice);
                  }
                  // @ts-ignore
                  if (response?.response?.status === 400) {
                    showErrorModal("Error", response);
                  }

                } else {
                  const response = await createInvoice(payload);
                  // @ts-ignore
                  if (response?.response?.status === 400) {
                    showErrorModal("Error", response);
                  }
                }
                onCreate();
                setOpen(false);

              } catch (error: any) {
                showErrorModal("Error", error);
              }
            }}
          >
            {({
                resetForm,
                isSubmitting,
                setFieldValue,
                values,
                initialValues,
                errors
              }) => {
              reset = resetForm;
              setFormValue = setFieldValue;
              const hasChanged = isEqual(values, initialValues);
              const hasErrors = Object.keys(errors).length > 0;
              const taxRatePrice = Number(values?.tax_rate) / 100 * Number(total);
              setInnerClient(values.client);
              return (
                <Form>
                  <Folder label="Client & Matter">
                    <FolderItem>
                      <div className="row">
                        <div className="col-md-6">
                          <FormContactSelect
                            name="client"
                            values={clientsData?.results || []}
                            isLoading={isClientsLoading}
                            label="Client"
                            isRequired
                            placeholder="Select Client"
                            disabled={!!client}
                          />
                        </div>
                        <div className="col-md-6">
                          <FormSelect
                            values={matterData?.results || []}
                            isLoading={isMattersLoading}
                            name="matter"
                            label="Matter"
                            placeholder="Select Matter"
                            isRequired
                            disabled={!!matter}
                          />
                        </div>
                      </div>
                    </FolderItem>
                  </Folder>
                  <AddItem>
                    <Button
                      className="ml-auto"
                      icon="plus"
                      onClick={handleAddBilling}
                    >
                      Add Item
                    </Button>
                  </AddItem>
                  <Folder label="Billing Items" className="mt-3">
                    <FolderItem>
                      <div className="d-flex flex-column">
                        <BillingHeading>Time Entries</BillingHeading>
                        <Row unclickable>
                          <div>#</div>
                          <div>Date</div>
                          <div>Description</div>
                          <div>Hourly Rate</div>
                          <div>Duration</div>
                          <div>Billed By</div>
                          <div>Total Amount</div>
                          <div/>
                        </Row>
                        {billingData
                          .filter((item) => item.billing_type === "time")
                          .map((row, index) => (
                            <Row key={`${index}key`} onClick={(event) => showTimeEntriesModal(event, row)}>
                              <div>{index + 1}</div>
                              <div>{row?.date}</div>
                              <div className="text-ellipsis">
                                {row?.description}
                              </div>
                              <div>
                                {row.is_billable ? numeral(row?.hourly_rate || 0).format("$0,0.00") : "Non-Billable"}
                              </div>
                              <div>{row?.time_spent}</div>
                              <div>{getUserName(row?.billed_by_data)}</div>
                              <div>
                                {numeral(row?.fees || 0).format("$0,0.00")}
                              </div>
                              <div>
                                <DeleteIcon
                                  src={DeleteImg}
                                  onClick={(event) => removeBilling(event, row?.id)}
                                  alt="delete"
                                />
                              </div>
                            </Row>
                          ))}
                        <SummaryRow className="d-flex mt-3">
                          <div>Total Billable Hours</div>
                          <div>
                            {totalBillableHours}
                          </div>
                        </SummaryRow>
                        <SummaryRow className="d-flex mt-2">
                          <div>Total Non-Billable Hours</div>
                          <div>
                            {totalNonBillableHours}
                          </div>
                        </SummaryRow>
                        <BillingHeading className="mt-3">
                          Expense Entries
                        </BillingHeading>
                        <Row unclickable>
                          <div>#</div>
                          <div>Date</div>
                          <div>Description</div>
                          <div>Rate</div>
                          <div>Quantity</div>
                          <div>Billed By</div>
                          <div>Total Amount</div>
                          <div/>
                        </Row>
                        {billingData
                          .filter((item) => item.billing_type === "expense")
                          .map((row, index) => (
                            <Row key={`${index}key`} onClick={() => showExpenseEntriesModal(row)}>
                              <div>{index + 1}</div>
                              <div>{row?.date}</div>
                              <div className="text-ellipsis">
                                {row?.description}
                              </div>
                              <div>
                                {row.is_billable ? numeral(row?.rate || 0).format("$0,0.00") : "Non-Billable"}
                              </div>
                              <div>{row?.quantity}</div>
                              <div>{getUserName(row?.billed_by_data)}</div>
                              <div>
                                {numeral(row?.fees || 0).format("$0,0.00")}
                              </div>
                              <div>
                                <DeleteIcon
                                  src={DeleteImg}
                                  onClick={(event) => removeBilling(event, row?.id)}
                                  alt="delete"
                                />
                              </div>
                            </Row>
                          ))}
                        <BillingHeading className="mt-4">Flat Fee</BillingHeading>
                        <Row unclickable>
                          <div>#</div>
                          <div>Date</div>
                          <div>Description</div>
                          <div>Rate</div>
                          <div>Quantity</div>
                          <div>Billed By</div>
                          <div>Total Amount</div>
                          <div/>
                        </Row>
                        {billingData
                          .filter((item) => item.billing_type === "flat_fee")
                          .map((row, index) => (
                            <Row key={`${index}key`} onClick={() => showFlatFeeModal(row)}>
                              <div>{index + 1}</div>
                              <div>{row?.date}</div>
                              <div className="text-ellipsis">
                                {row?.description}
                              </div>
                              <div>
                                {numeral(row?.rate || 0).format("$0,0.00")}
                              </div>
                              <div>{row?.quantity}</div>
                              <div>{getUserName(row?.billed_by_data)}</div>
                              <div>
                                {numeral(row?.fees || 0).format("$0,0.00")}
                              </div>
                              <div>
                                <DeleteIcon
                                  src={DeleteImg}
                                  onClick={(event) => removeBilling(event, row?.id)}
                                  alt="delete"
                                />
                              </div>
                            </Row>
                          ))}
                        <SummaryRow className="d-flex mt-4">
                          <div>Subtotal</div>
                          <div>
                            {numeral(subtotal).format("$0,0.00")}
                          </div>
                        </SummaryRow>
                        <SummaryRow className="d-flex mt-2 align-items-center">
                          <div className="align-items-center summary-group-tax-label">
                            <span className="mr-3">Tax</span>
                            <FormTaxRate
                              {...{helper: {value: profile.tax_rate || "0.00"}}}
                              size="sm"
                              name="tax_rate"
                            />
                          </div>
                          <div className="summary-group-tax-value">
                            {numeral(taxRatePrice).format("$0,0.00")}
                          </div>
                        </SummaryRow>
                        <TotalRow className="d-flex mt-3">
                          <div>Total</div>
                          <div>
                            {numeral(Number(taxRatePrice) + Number(total)).format("$0,0.00")}
                          </div>
                        </TotalRow>
                      </div>
                    </FolderItem>
                  </Folder>
                  <Folder label="Payment" className="mt-3">
                    <FolderItem>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="text-label">Payment Due</div>
                          <div className="d-flex">
                            <FormDayInput name="due_days"/>
                            <div className="ml-3 my-auto">
                              after invoice is sent
                            </div>
                          </div>
                          <div className="text-label mt-3">Online Payments</div>
                          <FormCheckbox name="payment-debit">
                            Direct Debit (ACH/eCheck)
                          </FormCheckbox>
                          <div className="d-flex mt-2">
                            <FormCheckbox name="payment-credit">
                              Credit Cards
                            </FormCheckbox>
                            <CreditCard
                              className="ml-4 my-auto"
                              src={CardVisaImg}
                            />
                            <CreditCard className="ml-2" src={CardMasterImg}/>
                            <CreditCard className="ml-2" src={CardExpressImg}/>
                            <CreditCard className="ml-2" src={CardDiscoverImg}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <FormInput
                            name="email"
                            label="Email Address"
                            isRequired
                          />
                          <FormTextarea
                            name="note"
                            label="Note on Invoice"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </FolderItem>
                  </Folder>
                  <FullScreenModalFooter>
                    {Boolean(invoiceId) && (
                      <div
                        className="empty-button"
                        onClick={() => deleteConfirmation.setOpen(true)}
                      >
                        Delete Draft
                      </div>
                    )}
                    <Button
                      className="ml-auto"
                      size="large"
                      theme="white"
                      disabled={!invoiceId && (hasChanged || hasErrors)}
                      onClick={() => handleSaveDraft(values)}
                      isLoading={isSavingDraft}
                    >
                      Save Draft
                    </Button>
                    <Button
                      buttonType="submit"
                      size="large"
                      className="ml-3"
                      theme="yellow"
                      isLoading={isSubmitting}
                      disabled={!invoiceId && (hasChanged || hasErrors)}
                    >
                      Send Invoice
                    </Button>
                  </FullScreenModalFooter>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
      {
        billingModal?.open &&
          <AddBillingItemModal
            {...billingModal}
            onCreate={(params) => handleCreateBilling(params)}
            matter={matter}
            client={client}
            showFlat
          />
      }
      {
        expenseModal?.open &&
          <AddExpenseEntry
            {...expenseModal}
            onCreate={handleCreateBilling}
            matter={matter}
            client={client}
            data={activeBilling}
            onClose={() => setOpen(false)}
          />
      }
      {
        timeModal?.open &&
          <AddTimeEntry
            {...timeModal}
            onCreate={handleCreateBilling}
            matter={matter}
            client={client}
            data={activeBilling}
            onClose={() => setOpen(false)}
          />
      }
      {
        flatModal?.open &&
          <AddFlatEntry
            {...flatModal}
            onCreate={handleCreateBilling}
            matter={matter}
            client={client}
            data={activeBilling}
            onClose={() => setOpen(false)}
          />
      }
      {deleteConfirmation?.open && (
        <DeleteConfirmationModal
          title="Delete Draft"
          message="Are you sure you want to remove this draft permanently?"
          onDelete={handleDelete}
          {...deleteConfirmation}
        />
      )}
    </FullScreenModal>
  );
};
