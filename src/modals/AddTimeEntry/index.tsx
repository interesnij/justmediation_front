/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import {
  Modal,
  Button,
  FormDurationInput,
  FormCheckbox,
  FormTextarea,
  FormSelect,
  FormDatePicker,
  FormCurrencyInputWrapper,
  FormCurrencyPrice,
  FormCurrencySelect,
  FormContactSelect,
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  useBasicDataContext,
  useAuthContext,
  useTimerContext,
  useCommonUIContext,
} from "contexts";
import { isEqual } from "lodash";
import {
  createTimeBilling,
  updateTimeBilling,
  getClients,
  getMatters,
} from "api";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { formatDurationText } from "helpers";
import { Timer } from "./Timer";
import { Alert } from "./Alert";
import { useModal } from "hooks";
import "./style.scss";

const validationSchema = Yup.object().shape({
  matter: Yup.string().required("Matter is required"),
  client: Yup.string().required("Client is required"),
  time_spent: Yup.string().test(
    "duration",
    "Duration should be greater than 15 min and less than 24 hours.",
    (value = "") => {
      let duration = formatDurationText(value).split(":")
      let hours = Number(duration?.[0]) || 0;
      let minutes = Number(duration?.[1]) || 0;
      return !((hours === 0 && minutes < 15) || hours > 24);
    }
  ),
  billed_by: Yup.string().required("Billed by is required"),
  date: Yup.string().required("Date is required"),
  hourly_rate: Yup.string().required("Hourly rate is required"),
  currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Description is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params): void;
  onUpdate?(params): void;
  onClose?(): void;
  data?: any;
  matter?: string | number;
  client?: string | number;
}

export const AddTimeEntry = ({
  open,
  setOpen,
  data,
  matter = "",
  client,
  onCreate = () => { },
  onUpdate = () => { },
  onClose = () => { },
}: Props) => {
  const { currencies } = useBasicDataContext();
  const { userId, userType } = useAuthContext();
  const { time, cancelTimer } = useTimerContext();
  const { showErrorModal } = useCommonUIContext();
  const [formData, setFormData] = useState<{[key: string]: string}>({ client: "" });
  const [billedData, setBilledData] = useState<any>([]);
  const [selectedMattersParam, setSelectedMattersParam] = useState<{[key: string]: number | string | undefined}>({ client: client });
  const alertModal = useModal();

  let reset = () => { };
  let setFormValue = (field, value) => { };

  const { isLoading: isMattersLoading, data: matterData } = useQuery<
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

  const closeModal = () => {
    reset();
    setOpen(false);
    onClose();
  }

  useEffect(() => {
    if(formData.client) {
      setSelectedMattersParam({ client: formData.client })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.client]);

  useEffect(() => {
    if(!formData!.matter || !matterData) return;
    let matter = matterData && matterData.results.find(({id}) => Number(id) === Number(formData!.matter));
    let billed = matter ? [...matter.shared_with_data, matter.attorney_data] : []
    setBilledData(billed);
  }, [formData, matterData]);
  
  useEffect(() => {
    setFormValue("time_spent", time);
  }, [time]);

  useEffect(() => {
    if (open) {
      setFormValue("time_spent", data?.time_spent || time);
    }
    return () => { };
  }, [open]);

  return (
    <Modal
      title={data ? "Edit Time Entry" : "Add Time Entry"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="add-time-entry-modal">
        <Formik
          enableReinitialize={true}
          initialValues={
            data ? {
              ...data,
                is_billable: !data.is_billable
            } : {
              matter,
              client,
              is_billable: false,
              billed_by: "",
              description: "",
              time_spent: "",
              date: format(new Date(), "MM/dd/yyyy"),
              hourly_rate: "",
              currency: 1,
              billing_type: "time",
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              if (!data) {
                const res = await createTimeBilling({
                  ...values,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  time_spent: formatDurationText(values.time_spent),
                  is_billable: !values.is_billable
                });
                await onCreate(res?.data);
                await setOpen(false);
                reset();
              } else {
                const res = await updateTimeBilling({
                  ...values,
                  date: format(new Date(values.date), "yyyy-MM-dd"),
                  time_spent: formatDurationText(values.time_spent),
                  attachment: undefined,
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
          {({
            resetForm,
            isSubmitting,
            values,
            setFieldValue,
            initialValues,
            errors
          }) => {
            reset = resetForm;
            setFormValue = setFieldValue;
            setFormData(values);

            const hasChanged = isEqual(values, initialValues);
            const hasErrors = Object.keys(errors).length > 0;

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
                      <div className="col-12 d-flex">
                        <FormDurationInput
                          name="time_spent"
                          label="Duration"
                          className="flex-1"
                          isRequired
                        />
                        <Timer className="ml-2" />
                      </div>
                      <FormTextarea
                        name="description"
                        label="Description"
                        placeholder="Type your message here"
                        className="col-12 mt-2"
                        fluidHeight
                        isRequired
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <FormContactSelect
                      name="client"
                      label="Client"
                      placeholder="Select a Client"
                      isRequired
                      values={clientData}
                      isLoading={isClientsLoading}
                      disabled={!!client}
                    />
                    <FormSelect
                      name="matter"
                      label="Matter"
                      placeholder="Select a Matter"
                      className="mt-2"
                      isRequired
                      values={matterData?.results}
                      isLoading={isMattersLoading}
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

                    <div className="mt-2">
                      <div className="text-dark">Hourly Rate</div>
                      <FormCurrencyInputWrapper>
                        <FormCurrencyPrice
                          name="hourly_rate"
                          placeholder="Enter your hourly rate"
                        />
                        <FormCurrencySelect
                          name="currency"
                          values={currencies}
                        />
                      </FormCurrencyInputWrapper>
                    </div>
                  </div>
                </div>

                <div className="d-flex mt-3">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      alertModal.setOpen(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    buttonType="submit"
                    isLoading={isSubmitting}
                    disabled={hasChanged || hasErrors || isSubmitting}
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
      {
        alertModal.open &&
        <Alert
          {...alertModal}
          onLeave={closeModal}
          onStopLeave={() => {
            cancelTimer();
            closeModal();
          }}
        />
      }
    </Modal>
  );
};
