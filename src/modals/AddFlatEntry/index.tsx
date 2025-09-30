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
  getAttorneysAndParalegals,
  getClients,
  getMatters,
} from "api";
import { format } from "date-fns";
import { useQuery } from "react-query";
import "./style.scss";

const validationSchema = Yup.object().shape({
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
  billed_by: Yup.string().required("Billed by is required"),
  date: Yup.string().required("Date is required"),
  rate: Yup.string(),
  quantity: Yup.string(),
  currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Description is required"),
  total_amount: Yup.string().required("Total amount is required")
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

export const AddFlatEntry = ({
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
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [billedData, setBilledData] = useState<any>([]);
  const [formData, setFormData] = useState<{[key: string]: string}>({ client: "" });

  const { isLoading: isMattersLoading, data: matterData } = useQuery<
    { results: any[]; count: number },
    Error
  >(["matters-all", formData], () =>  getMatters({
    client: formData.client,
  }), {
    keepPreviousData: true,
    enabled: open,
  });

  const { isLoading: isClientsLoading, data: clientData } = useQuery<
    any[],
    Error
  >(["clients"], () => getClients({ userId, userType }), {
    keepPreviousData: true,
    enabled: open,
  });

  const handlePrice = (value) => {
    const totalPrice = getTotalAmount(quantity, value);
    setPrice(value);
    value && setTotalAmount(totalPrice);
  }

  const handleQuantity = (value) => {
    const totalPrice = getTotalAmount(price, value);
    setQuantity(value);
    value && setTotalAmount(totalPrice);
  }

  const handleTotalAmount = (value) => {
    setPrice("");
    setQuantity("");
    setTotalAmount(value);
  }

  const getTotalAmount = (quantity, rate) => {
    const quantityValue = Number(quantity) || 0;
    const rateValue = Number(rate) || 0;
    return (quantityValue * rateValue).toFixed(2);
  }

  useEffect(() => {
    if(data) {
      setTotalAmount(data?.total_amount?.toFixed(2) || data?.fees?.toFixed(2));
      setPrice(data?.rate);
      setQuantity(data?.quantity);
    }
  }, [data])

  useEffect(() => {
    if(!formData!.matter || !matterData) return;
    let matter = matterData && matterData.results.find(({id}) => Number(id) === Number(formData!.matter));
    let billed = matter ? [...matter.shared_with_data, matter.attorney_data] : []
    setBilledData(billed);
  }, [formData, matterData]);

  return (
    <Modal
      title={data ? "Edit Flat Fee" : "Add Flat Fee"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="add-expense-entry-modal">
        <Formik
          initialValues={
            data ? {...data, total_amount: data?.fees} : {
              matter,
              client,
              is_billable: false,
              billed_by: "",
              description: "",
              date: "",
              rate: 0,
              currency: 1,
              billing_type: "flat_fee",
              total_amount: 0,
              quantity: "",
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {

            if(!values.total_amount || values.total_amount === "0.00") {
              return actions.setFieldError("total_amount", "Total amount is required.")
            }
            try {
              if (!data) {
                const attachment = await uploadFiles(
                  values.attachment || [],
                  "documents",
                  0 // непонятно,
                );
                const res = await createTimeBilling({
                  ...values,
                  is_billable: !values.is_billable,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  attachment: attachment[0],
                  quantity: values.quantity || 0,
                  rate: values.rate || 0,
                });
                onCreate(res?.data);
                setOpen(false);
                reset();
              } else {
                const res = await updateTimeBilling({
                  ...values,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  quantity: values.quantity || 0,
                  rate: values.rate || 0,
                });
                onUpdate(res?.data?.id);
                setOpen(false);
                reset();
              }
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting, errors, initialValues, values, setFieldValue }) => {
            const totalValue = values.total_amount;
            const isErrorTotalValue = !totalValue || totalValue === "0.00" || totalValue === "0";
            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0 || isErrorTotalValue;
            reset = resetForm;
            values.rate = price;
            values.total_amount = totalAmount;
            values.quantity = quantity;
            setFormData(values);

            return (
              <Form>
                <div className="row">
                  <div className="col-md-6 mt-2">
                    <div className="row">
                      <div className="col-8">
                        <div className="d-flex align-items-center justify-space-between justify-content-between">
                          <div className="text-dark">Rate</div>
                          <div className="textarea-form-control__required">Optional</div>
                        </div>
                        <FormCurrencyInputWrapper>
                          <FormCurrencyPrice name="rate" placeholder="0.00" isRequired={false} onChange={handlePrice} />
                          <FormCurrencySelect
                            name="currency"
                            values={currencies}
                            isRequired={false}
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
                        onChange={handleQuantity}
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
                          onChange={handleTotalAmount}
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
                    disabled={hasChanged || hasErrors}
                    buttonType="submit"
                    size="large"
                  >
                    Add Entry
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
