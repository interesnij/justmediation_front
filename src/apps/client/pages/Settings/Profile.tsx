import React, {useState} from "react";
import {
  Button,
  FormInput,
  Folder,
  FolderItem,
  FormProfilePhoto,
  FormCheckbox,
  FormSelect,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
  FormPhoneInputWithValidation,
} from "components";
import { validatePhone } from "helpers";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {partialUpdateClientProfile, updateClientProfile, uploadFiles} from "api";
import {
  useBasicDataContext,
  useAuthContext,
  useCommonUIContext,
} from "contexts";
import {isEqual} from "lodash";
import {SuccessModal} from "modals";

const validationSchema = Yup.object().shape({
  avatar: Yup.string(),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  middle_name: Yup.string().nullable(),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  zip_code: Yup.string().required("Zip code is required"),
  address1: Yup.string().required(),
  address2: Yup.string(),
  is_represent_company: Yup.boolean(),
  organization_name: Yup.string().when("is_represent_company", {
    is: (value: Boolean): boolean => Boolean(value),
    then: Yup.string().required("Company name is required"),
  }),
  job: Yup.string(),
  timezone: Yup.string(),
});

export const Profile = () => {
  const {timezones} = useBasicDataContext();
  const {profile, setProfileRaw} = useAuthContext();
  const {showErrorModal} = useCommonUIContext();
  const [successModal, setSuccessModal] = useState(false);
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);

  return (
    <div className="settings">
      <Folder label="Profile">
        <Formik
          initialValues={{
            first_name: profile?.first_name || "",
            avatar: profile?.avatar || "",
            last_name: profile?.last_name || "",
            middle_name: profile?.middle_name || "",
            email: profile?.email || "",
            phone: profile?.phone || "",
            state: profile?.state || "",
            country: profile?.country || "",
            city: profile?.city || "",
            zip_code: profile?.zip_code || "",
            address1: profile?.address1 || "",
            address2: profile?.address2 || "",
            is_represent_company: !profile || profile.client_type === "firm",
            organization_name: profile?.organization_name || "",
            job: profile?.job || "",
            timezone: profile?.timezone || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, formikHelpers) => {
            
            let avatarUrl = "";
            if (values.avatar && typeof values.avatar !== "string") {
              const avatars = await uploadFiles(
                [values.avatar],
                "user_avatars",
                0
              );
              avatarUrl = avatars[0];
            } else {
              avatarUrl = values.avatar;
            }
            const params = {
              avatar: avatarUrl || null,
              first_name: values.first_name,
              middle_name: values.middle_name,
              last_name: values.last_name,
              email: values.email,
              phone: values.phone.startsWith("+")
                ? values.phone
                : "+" + values.phone,
              country: values.country,
              state: values.state,
              city: values.city,
              zip_code: values.zip_code,
              address1: values.address1,
              address2: values.address2,
              organization_name: values.organization_name,
              job: values.job,
              client_type: values.is_represent_company ? "firm" : "individual",
              timezone: values.timezone,
            };

            try {
              const {data} = avatarUrl ? await updateClientProfile(params) : await partialUpdateClientProfile(params)
              await setProfileRaw(data);
              setSuccessModal(true);
            } catch (error) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({
              values,
              initialValues,
              isSubmitting,
              errors,
            }) => {
            const hasChanged = isEqual(values, initialValues);
            return (
              <Form method="post">
                <FolderItem withSeparator={false}>
                  <div className="heading">Profile Photo</div>
                  <FormProfilePhoto
                    name="avatar"
                    className="mt-2"
                    //buttonLabel={values.avatar ? "Update Photo" : "Add Photo"}
                    removeButton="Remove"
                    isRequired={false}
                  />
                </FolderItem>
                <FolderItem withSeparator={false}>
                  <div className="row">
                    <div className="heading col-md-12">
                      Personal Information
                    </div>
                    <FormInput
                      label="First Name"
                      className="mt-2 col-md-4"
                      isRequired
                      name="first_name"
                      placeholder="Input first name here"
                    />
                    <FormInput
                      className="mt-2 col-md-4"
                      label="Middle Name"
                      name="middle_name"
                      placeholder="Input middle name here"
                    />
                    <FormInput
                      className="mt-2 col-md-4"
                      label="Last Name"
                      name="last_name"
                      isRequired
                      placeholder="Input last name here"
                    />
                    <FormInput
                      className="mt-2 col-md-6"
                      label="Email"
                      name="email"
                      isRequired
                      placeholder="Input email here"
                    />
                    <FormPhoneInputWithValidation
                      className="mt-2 col-md-6"
                      label="Phone"
                      name="phone"
                      validate={value => validatePhone(value, countryPhoneObject)}
                      getCountryPhoneObject={setCountryPhoneObject}
                      isRequired
                    />
                  </div>
                </FolderItem>
                <FolderItem withSeparator={false}>
                  <div className="row">
                    <FormCheckbox
                      className="col-12"
                      name="is_represent_company"
                    >
                      Represents a company
                    </FormCheckbox>
                  </div>

                  {values.is_represent_company && (
                    <div className="row">
                      <div className="heading col-md-12 mt-2">
                        Company Info
                      </div>
                      <FormInput
                        label="Company Name"
                        className="col-md-6 mt-2"
                        name="organization_name"
                        placeholder="Enter company name"
                        isRequired
                      />
                      <FormInput
                        label="Job Title"
                        className="col-md-6 mt-2"
                        name="job"
                        placeholder="Enter job title"
                      />
                    </div>
                  )}
                </FolderItem>
                <FolderItem>
                  <div className="row">
                    <div className="heading col-md-12">Address</div>
                    <FormCountrySelect
                      label="Country"
                      className="col-md-6 mt-2"
                      name="country"
                      placeholder="Select Country"
                      isRequired={true}
                    />
                    <FormSelect
                      values={timezones}
                      className="col-md-6 mt-2"
                      name="timezone"
                      label="Time zone"
                      placeholder="Select time zone"
                      timezone={true}
                      isRequired={false}
                    />
                    <FormInput
                      label="Address Line 1"
                      className="col-md-6 mt-2"
                      name="address1"
                      placeholder="Enter address line 1"
                      isRequired={true}
                    />
                    <FormInput
                      label="Address Line 2"
                      className="col-md-6 mt-2"
                      name="address2"
                      placeholder="Enter address line 2"
                    />
                    <FormStateSelect
                      label="State"
                      className="col-md-4 mt-2"
                      name="state"
                      placeholder="Select state"
                      isRequired={true}
                      country={values.country}
                      selectedState={values.state}
                    />
                    <FormCitySelect
                      label="City"
                      className="col-md-4 mt-2"
                      name="city"
                      placeholder="Enter city"
                      isRequired={true}
                      state={values.state}
                      selectedCity={values.city}
                    />
                    <FormInput
                      label="Zip"
                      className="col-md-4 mt-2"
                      name="zip_code"
                      placeholder="Enter zip code"
                      isRequired={true}
                    />
                    <div className="col-12 mt-4">
                      <Button
                        buttonType="submit"
                        disabled={hasChanged}
                        isLoading={isSubmitting}
                        className="ml-auto"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                  <div className="py-4"/>
                </FolderItem>
              </Form>
            );
          }}
        </Formik>

        <SuccessModal title="Changes Saved"
                      open={successModal}
                      setOpen={setSuccessModal}
                      callback={() => setSuccessModal(false)}
        />
        <div className="py-4"/>
        <div className="my-2"/>
      </Folder>
    </div>
  );
};
