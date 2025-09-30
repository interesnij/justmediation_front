import React from "react";
import {
  Button,
  FormAppTimePicker,
  FormCheckbox,
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextarea,
  Modal
} from "components";
import {Form, Formik} from "formik";
import {createEvent, updateEvent} from "api";
import {useBasicDataContext, useCommonUIContext} from "contexts";
import moment from "moment";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  location: Yup.string().required("Location is required"),
  timezone: Yup.string().required("Timezone is required"),
  startDate: Yup.string().required("Start Date is required"),
  startTime: Yup.string().nullable().required("Start Time is required"),
  endDate: Yup.string().when("is_all_day", {
    is: false,
    then: Yup.string()
      .required("End Date is required")
      .test(
        "is-greater",
        "The end date can't be earlier than the start date",
        function (value): boolean {
          const { startDate } = this.parent;
          const startDateMs: number = new Date(startDate).getTime();
          const endDateMs: number = value
            ? new Date(value).getTime()
            : new Date().getTime();
          return endDateMs > startDateMs;
        }
      ),
  }),
  endTime: Yup.string().nullable().when("is_all_day", {
    is: false,
    then: Yup.string().required("End Time is required"),
  }),
});
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(): void;
  data?: any;
}

interface IFormValues {
  title: string;
  description: string;
  location: string;
  timezone: string;
  startDate: string;
  endDate: string;
  startTime: any;
  endTime: any;
  is_all_day: boolean;
}

export const NewEventModal = ({
  open,
  data,
  setOpen,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};
  const { timezones } = useBasicDataContext();
  const { showErrorModal } = useCommonUIContext();

  const toCloseDayByTime = (date: string, startTime: string): Date => {
    const nextTime = new Date(`${date} ${startTime}`).getTime() + (60 * 60 * 1000) + 1000;
    return new Date(nextTime)
  };

  const initialValues: IFormValues = {
    title: "",
    description: "",
    location: "",
    timezone: "",
    startDate: "",
    endDate: "",
    startTime: moment(),
    endTime: moment(),
    is_all_day: false,
  };

  return (
    <Modal
      title={data ? "Edit Event" : "New Event"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
      disableOutsideClick={true}
    >
      <div className="add-expense-entry-modal">
        <Formik
          enableReinitialize
          initialValues={data || initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const startTime = moment(values.startTime).format("hh:mm:ss A");
            const endTime = moment(values.endTime).format("hh:mm:ss A");

            try {
              const params = {
                title: values.title,
                description: values.description,
                is_all_day: values.is_all_day,
                location: values.location,
                timezone: values.timezone,
                start: new Date(`${values.startDate} ${startTime}`),
                end: values.is_all_day
                  ? toCloseDayByTime(values.startDate, startTime)
                  : new Date(`${values.endDate} ${endTime}`),
              };

              if (data) {
                await updateEvent(data?.id, params);
              } else {
                await createEvent(params);
              }
              await onCreate();
              await setOpen(false);
              await reset();
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, values, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
                <div className="row">
                  <FormInput
                    name="title"
                    label="Event title"
                    className="col-12"
                    placeholder="Input title"
                    isRequired
                  />
                  <div className="text-black col-12 mt-2">Date and time</div>
                  <FormDatePicker
                    name="startDate"
                    className="col-md-3 mt-2"
                    minDate={new Date()}
                    isRequired
                  />
                  {!values.is_all_day &&
                    <FormAppTimePicker
                      name="startTime"
                      isRequired
                      className="col-md-3 mt-2"
                    />
                  }
                  <FormDatePicker
                    name="endDate"
                    isRequired
                    minDate={new Date()}
                    className="col-md-3 mt-2"
                  />
                  {!values.is_all_day &&
                    <FormAppTimePicker
                      name="endTime"
                      className="col-md-3 mt-2"
                      isRequired
                    />
                  }
                  <div className="col-12 mt-2">
                    <FormCheckbox name="is_all_day">All day</FormCheckbox>
                  </div>
                  <FormSelect
                    values={timezones}
                    className="mt-2 col-12"
                    name="timezone"
                    label="Time zone"
                    timezone={true}
                    isRequired
                  />
                  <FormInput
                    name="location"
                    label="Location"
                    placeholder="Input an address or URL link"
                    className="col-12 mt-2"
                    isRequired
                  />
                  <FormTextarea
                    name="description"
                    label="Description"
                    className="col-12 mt-2"
                    placeholder="Input your description"
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
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    buttonType="submit"
                    isLoading={isSubmitting}
                    size="large"
                  >
                    {data ? "Save Event" : "Create Event"}
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
