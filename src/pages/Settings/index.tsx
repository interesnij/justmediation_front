import React from "react";
import {
  Button,
  FormInput,
  Folder,
  FolderItem,
  Tab,
  FormSwitch,
} from "components";
import { Formik, Form } from "formik";
import { useInput } from "hooks";
import { FullScreen } from "layouts";
import { RouteComponentProps, navigate } from "@reach/router";

const tabData = [
  {
    tab: "My Account",
  },
  {
    tab: "Subscription",
  },
  {
    tab: "Notification",
  },
  {
    tab: "Integrations",
  },
  {
    tab: "Matter stages",
  },
];

export const SettingsPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const tfa = useInput(true);
    const currentTab = useInput(tabData[0].tab);

    const handleClose = () => {
      navigate(-1);
    };

    return (
      <FullScreen title="Settings" onClose={handleClose}>
        <Tab data={tabData} {...currentTab} />
        {currentTab.value === tabData[0].tab ? (
          <div className="settings-page">
            <Formik initialValues={{}} onSubmit={async () => {}}>
              {() => {
                // bindSubmitForm(submitForm);
                return (
                  <Form>
                    <Folder label="Account Information">
                      <FolderItem>
                        <div className="row">
                          <FormInput
                            label="First Name"
                            className="mt-2 col-md-4"
                            isRequired
                            name="firstName"
                            placeholder="Input first name here"
                          />
                          <FormInput
                            className="mt-2 col-md-4"
                            label="Middle Name"
                            name="middleName"
                            placeholder="Input middle name here"
                          />
                          <FormInput
                            className="mt-2 col-md-4"
                            label="Last Name"
                            name="lastName"
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
                          <FormInput
                            className="mt-2 col-md-6"
                            label="Phone"
                            name="phone"
                            isRequired
                            placeholder="Input phone here"
                          />
                          <div className="col-12 mt-3">
                            <Button className="ml-auto">Save</Button>
                          </div>
                        </div>
                      </FolderItem>
                    </Folder>
                    <Folder label="Password & Security" className="mt-3">
                      <FolderItem>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="heading">Password</div>
                            <div className="desc">
                              Update your password here
                            </div>
                          </div>
                          <div className="my-auto label">Update</div>
                        </div>
                      </FolderItem>
                      <FolderItem>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="heading">
                              2-Factor Authentication
                            </div>
                            <div className="desc">
                              Add an extra layer of security to your account by
                              enabling this 2-step authentication. We'll send
                              you a test message (SMS) of a one-time security
                              code to use along with your password.
                            </div>
                          </div>
                          <div className="col-md-6 d-flex">
                            <FormSwitch className="my-auto ml-auto" {...tfa} />
                          </div>
                        </div>
                      </FolderItem>
                    </Folder>
                  </Form>
                );
              }}
            </Formik>
          </div>
        ) : currentTab.value === tabData[1].tab ? (
          <div className="settings-page">
            <Folder label="Current Subscription">
              <FolderItem>
                <div className="d-flex justify-content-between">
                  <div className="heading my-auto">Premium Subscription</div>
                  <Button type="outline">Change subscription</Button>
                </div>
                <div className="row mt-1">
                  <div className="col-md-4">
                    <div className="label">LAST PAYMENT</div>
                    <div className="desc">March 12, 2021</div>
                  </div>
                  <div className="col-md-4">
                    <div className="label">NEXT BILLING DATE</div>
                    <div className="desc">March 13, 2021</div>
                  </div>
                  <div className="col-md-4">
                    <div className="label">PRICE</div>
                    <div className="desc">$ 780.55 /Annual</div>
                  </div>
                </div>
              </FolderItem>
            </Folder>
            <Folder label="Payment Method" className="mt-3">
              <FolderItem>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <div>Card Name Goes Here</div>
                  </div>
                  <div className="my-auto">Debit ***1234</div>
                </div>
              </FolderItem>
            </Folder>
            <Folder label="Billing History" className="mt-3">
              <FolderItem>
                <div className="row">
                  <div className="col md-4">
                    <span className="desc">March 12, 2021</span>
                  </div>
                  <div className="col md-8 d-flex justify-content-between">
                    <span className="label">$780.55</span>
                    <span className="desc">Invoice</span>
                  </div>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="row">
                  <div className="col md-4">
                    <span className="desc">March 12, 2021</span>
                  </div>
                  <div className="col md-8 d-flex justify-content-between">
                    <span className="label">$780.55</span>
                    <span className="desc">Invoice</span>
                  </div>
                </div>
              </FolderItem>
            </Folder>
          </div>
        ) : currentTab.value === tabData[2].tab ? (
          <div className="settings-page">
            <Folder label="JustLaw Dashboard">
              <FolderItem>
                <div className="row">
                  <div className="col-md-6">
                    <div className="heading">Chats</div>
                    <div className="desc">
                      This includes all chat, messages, and video calls.
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <FormSwitch className="my-auto ml-auto" />
                  </div>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="row">
                  <div className="col-md-6">
                    <div className="heading">Chats</div>
                    <div className="desc">
                      This includes all chat, messages, and video calls.
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <FormSwitch className="my-auto ml-auto" />
                  </div>
                </div>
              </FolderItem>
            </Folder>
            <Folder label="Delivery Options" className="mt-3">
              <FolderItem>
                <div className="row">
                  <div className="col-md-6">
                    <div className="heading">Chats</div>
                    <div className="desc">
                      This includes all chat, messages, and video calls.
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <FormSwitch className="my-auto ml-auto" />
                  </div>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="row">
                  <div className="col-md-6">
                    <div className="heading">Chats</div>
                    <div className="desc">
                      This includes all chat, messages, and video calls.
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <FormSwitch className="my-auto ml-auto" />
                  </div>
                </div>
              </FolderItem>
            </Folder>
          </div>
        ) : currentTab.value === tabData[3].tab ? (
          <div className="settings-page">
            <Folder label="Manage Integrations">
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading">Stripe</div>
                  <span>Connected</span>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading my-auto">Quickbooks</div>
                  <Button type="outline">Log In</Button>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading my-auto">Docusign</div>
                  <Button type="outline">Log In</Button>
                </div>
              </FolderItem>
            </Folder>
          </div>
        ) : currentTab.value === tabData[4].tab ? (
          <div className="settings-page">
            <Folder label="Manage Matter Stages">
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading">Stripe</div>
                  <span>Connected</span>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading my-auto">Quickbooks</div>
                  <Button type="outline">Log In</Button>
                </div>
              </FolderItem>
              <FolderItem>
                <div className="d-flex justify-content-between my-1">
                  <div className="heading my-auto">Docusign</div>
                  <Button type="outline">Log In</Button>
                </div>
              </FolderItem>
            </Folder>
          </div>
        ) : null}
      </FullScreen>
    );
  };
