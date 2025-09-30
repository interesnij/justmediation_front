import React from "react";
import { Button, Tab, Card, User } from "components";
import { RouteComponentProps } from "@reach/router";
import { useInput } from "hooks";
import { ClientLayout } from "apps/client/layouts";

const tabData = [
  {
    tab: "About",
  },
  {
    tab: "Pricing",
  },
  {
    tab: "Events",
  },
  {
    tab: "Contact",
  },
];

export const ContactPage: React.FunctionComponent<RouteComponentProps> = () => {
  const currentTab = useInput(tabData[0].tab);
  return (
    <ClientLayout title="Contact">
      <div className="contact-page">
        <div className="contact-page__content">
          <Card>
            <div className="contact-page__content-top">
              <User size="large" className="mb-auto" />
              <div className="contact-page__content-top-main ml-3">
                <div className="d-flex">
                  <span className="name my-auto mr-2">Borrokly Simmons</span>
                  <span className="service ml-4 my-auto">Practice Area 1</span>
                </div>
                <div className="firm mt-1">Simmons Law firm</div>
                <div className="d-flex flex-wrap">
                  <span className="practice-area">Practice Area1</span>
                  <span className="practice-area">Practice Area2</span>
                  <span className="practice-area">Practice Area3</span>
                </div>
                <div className="d-flex flex-wrap">
                  <span className="service">Free consultation</span>
                  <span className="service">Video Calls</span>
                  <span className="service">5+ years</span>
                  <span className="service">Spanish</span>
                  <span className="service">Italian</span>
                  <span className="service">Portuguese</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="mt-4">
            <Tab data={tabData} {...currentTab} />
            <div>
              <div className="heading mt-4">Biography</div>
              <div className="text">
                This is the about section. Paralegal can tell the public an
                overview about themselves here. This is random text to show what
                it may look like. Aliqua id fugiat nostrud irure ex duis ea quis
                id quis ad et. Sunt qui esse pariatur duis deserunt mollit
                dolore cillum minim tempor enim. Elit aute irure tempor
                cupidatat incididunt sint deserunt ut voluptate aute id deserunt
                nisi.
              </div>
              <div className="divider my-4"></div>
              <div className="heading">Jurisdictions & Registrations</div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="label">United States, New York State</div>
                  <div className="text">
                    Registration #: 3042880 <br /> Year Admitted: 2009
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="label">United States, New York State</div>
                  <div className="text">
                    Registration #: 3042880 <br /> Year Admitted: 2009
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="label">United States, New York State</div>
                  <div className="text">
                    Registration #: 3042880 <br /> Year Admitted: 2009
                  </div>
                </div>
              </div>
              <div className="divider my-4"></div>
              <div className="heading">Education</div>
              <div className="label">Syracuse University</div>
              <div className="text">
                BS JD LLM <br /> Graduated 2009
              </div>
            </div>
          </Card>
        </div>
        <Card className="ml-4">
          <div className="contact-page__buttons">
            <Button type="outline" className="mb-2" width={180}>
              View Website
            </Button>
            <Button type="outline" className="mb-2" width={180}>
              Call Now
            </Button>
            <Button width={180}>Start a Chat</Button>
          </div>
        </Card>
      </div>
    </ClientLayout>
  );
};
