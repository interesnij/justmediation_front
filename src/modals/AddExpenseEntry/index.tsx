import React, {useEffect, useState} from "react";
import {
  Modal,
  Button,
  FormInput,
  FormCheckbox,
  FormTextarea,
  FormSelect,
  FormDatePicker,
  FormUpload,
  FormCurrencyInputWrapper,
  FormCurrencyPrice,
  FormCurrencySelect,
  FormContactSelect,
  FormFloatNumber
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import {
  useBasicDataContext,
  useAuthContext,
  useCommonUIContext,
} from "contexts";
import {
  createTimeBilling,
  updateTimeBilling,
  uploadFiles,
  getClients,
  getMatters, updateTimeBillingPartial
} from "api";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { acceptFileTypes } from "helpers";
import "./style.scss";

const validationSchema = Yup.object().shape({
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
  billed_by: Yup.string().required("Billed by is required"),
  date: Yup.string().required("Date is required"),
  currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Description is required"),
  attachments: Yup.array().min(1).required("Attachment is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params): void;
  onUpdate?(params): void;
  onClose?(): void;
  data?: any;
  ata?: any;
  matter?: number | string;
  client?: number | string;
}

export const AddExpenseEntry = ({
  open,
  setOpen,
  data,
  matter,
  client,
  onCreate = () => {},
  onUpdate = () => {},
  onClose = () => {},
}: Props) => {
  let reset = () => {};
  const { currencies } = useBasicDataContext();
  const { userId, userType } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const [formData, setFormData] = useState<{[key: string]: string}>({ client: "" });
  const [selectedMattersParam, setSelectedMattersParam] = useState<{[key: string]: number | string | undefined}>({ client: client });
  const [billedData, setBilledData] = useState<any>([]);

  const { isFetching: isMattersLoading, data: matterData } = useQuery<
    { results: any[]; count: number },
    Error
  >(["matters-all", selectedMattersParam], () => getMatters(selectedMattersParam), {
    keepPreviousData: false,
    enabled: open,
  });

  const { isLoading: isClientsLoading, data: clientData } = useQuery<
    any[],
    Error
  >(["clients"], () => getClients({ userId, userType }), {
    keepPreviousData: true,
    enabled: open,
  });

  useEffect(() => {
    if(formData.client) {
      setSelectedMattersParam({ client: formData.client })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.client]);

  useEffect(() => {
    if(!formData!.matter || !matterData) return;
    let matter = matterData && matterData.results.find(({id}) => Number(id) === Number(formData!.matter));
    let billed = matter ? [...matter.shared_with_data, matter.mediator_data] : []
    setBilledData(billed);
  }, [formData, matterData]);

  return (
    <Modal
      title={data ? "Edit Expense Entry" : "Add Expense Entry"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="add-expense-entry-modal">
        <Formik
          initialValues={
            data ? {
              ...data,
              attachments: data.attachments_data,
              is_billable: !data.is_billable
            } : {
              matter,
              client,
              is_billable: false,
              billed_by: "",
              description: "",
              date: format(new Date(), "MM/dd/yyyy"),
              rate: 0,
              currency: 1,
              billing_type: "expense",
              total_amount: 0,
              quantity: 0,
              attachments: [],
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            !values.rate && delete values.rate;
            !values.quantity && delete values.quantity;

            try {
              if (!data) {
                const attachments = values.attachments.length > 0 ?
                  await uploadFiles(
                    values.attachments,
                    "documents", 
                    0 // непонятно
                  ) : null;

                const res = await createTimeBilling({
                  ...values,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  attachments,
                  is_billable: !values.is_billable
                });
                await onCreate(res?.data);
                await setOpen(false);
                reset();
              } else {
                let fileExists: string[] = [];
                let newFile: File[] = [];

                values.attachments.forEach(key => {
                  if(key!.file) return fileExists = [...fileExists, key.file];
                  newFile = [...newFile, key];
                })

                const attachments = newFile.length > 0 ? await uploadFiles(
                  newFile,
                  "documents",
                  0  // ошибка
                ) : [];
                await updateTimeBillingPartial({id: data.id, attachments: [...fileExists, ...attachments]});

                delete values.attachments_data;
                delete values.attachments;
                delete values.attachment;

                const res = await updateTimeBilling({
                  ...values,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  attachments: [],
                  //attachments: [...fileExists, ...attachments],
                  is_billable: !values.is_billable
                });
                await onUpdate(res?.data?.id);
                await setOpen(false);
                reset();
              }
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting, errors, initialValues, values }) => {
            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0;
            reset = resetForm;
            const quantity = Number(values?.quantity) || 0;
            const rate = Number(values?.rate) || 0;
            values.total_amount = (quantity * rate).toFixed(2);

            setFormData(values);

            return (
              <Form>
                <div className="row">
                  <div className="col-12">
                    <FormCheckbox name="is_billable">
                      Non-billable entry
                    </FormCheckbox>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="row">
                      <div className="col-8">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-dark">Rate</div>
                          <div className="input-control__required">Optional</div>
                        </div>
                        <FormCurrencyInputWrapper>
                          <FormCurrencyPrice name="rate" placeholder="0.00" />
                          <FormCurrencySelect
                            name="currency"
                            values={currencies}
                          />
                        </FormCurrencyInputWrapper>
                      </div>
                      <FormInput
                        name="quantity"
                        label="Quantity"
                        className="col-md-4"
                        isRequired={false}
                        placeholder="1.00"
                        type="number"
                      />
                      <FormTextarea
                        name="description"
                        label="Description"
                        placeholder="Type your message here"
                        className="col-12 mt-2"
                        isRequired
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="mt-0">
                      <div className="text-dark">Total Amount</div>
                      <FormCurrencyInputWrapper>
                        <FormCurrencyPrice
                          name="total_amount"
                          placeholder="500"
                        />
                        <FormCurrencySelect
                          name="currency"
                          values={currencies}
                        />
                      </FormCurrencyInputWrapper>
                    </div>
                    <FormContactSelect
                      name="client"
                      label="Client"
                      className="mt-2"
                      isRequired
                      values={clientData}
                      isLoading={isClientsLoading}
                      placeholder="Select a Client"
                      disabled={!!client}
                    />
                    <FormSelect
                      name="matter"
                      label="Matter"
                      className="mt-2"
                      isRequired
                      values={matterData?.results || []}
                      isLoading={isMattersLoading}
                      placeholder="Select a Matter"
                      disabled={!!matter || !values.client}
                    />

                    <FormDatePicker
                      label="Date"
                      className="mt-2"
                      name="date"
                      isRequired
                    />
                    <FormContactSelect
                      name="billed_by"
                      label="Billed by"
                      className="mt-2"
                      placeholder="Select a Person"
                      isRequired
                      values={billedData}
                      isLoading={isMattersLoading}
                    />
                  </div>
                  <FormUpload
                    className="col-12 mt-2"
                    label=""
                    name="attachments"
                    buttonLabel="Select from Documents"
                    isRequired
                    acceptFileTypes={acceptFileTypes}
                  />
                </div>
                <div className="d-flex mt-2">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    isLoading={isSubmitting}
                    disabled={hasChanged || hasErrors || isSubmitting}
                    buttonType="submit"
                    size="large"
                  >
                    Save Entry
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
