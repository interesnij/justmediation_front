import React from "react";
import { RouteComponentProps } from "@reach/router";
import { SearchBar, Select, Button, Pagination, RiseLoader } from "components";
import { useInput, useModal } from "hooks";
import { AttorneyLayout } from "apps/attorney/layouts";
import { NewIndustryContactModal } from "modals";
import { useAuthContext } from "contexts";
import { ContactsTable } from "./components/ContactsTable";
import { getIndustryContactsForAttorney } from "api";
import { useQuery } from "react-query";
import "./style.scss";
const filterData = [
  {
    title: "All",
    id: "",
  },
  {
    title: "Attorneys",
    id: "attorney",
  },
  {
    title: "Paralegals",
    id: "paralegal",
  },
  {
    title: "Pending",
    id: "pending",
  },
];

export const ContactsDashboardPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const type = useInput(filterData[0].id);
    const contactModal = useModal();
    const page = useInput(0);
    const search = useInput("");
    const { userId, userType } = useAuthContext();

    const handleNewContact = () => {
      contactModal.setOpen(true);
    };

    const { isLoading, isError, error, data, refetch } = useQuery<
      { results: any[]; count: number },
      Error
    >(
      ["industry-contacts", page, search.value, type.value],
      () =>
        getIndustryContactsForAttorney({
          id: userId,
          page: page.value,
          search: search.value,
          filter: type.value
        }),
      {
        keepPreviousData: true,
      }
    );

    return (
      <AttorneyLayout title="Industry Contacts" userType={userType}>
        <div className="contacts-page">
          <div className="contacts-page__bar">
            <SearchBar
              icon="search"
              className="contacts-page__bar-input"
              {...search}
              placeholder="Search in Industry Contacts"
            />

            <Select
              data={filterData}
              className="my-auto ml-3"
              label="Type"
              width={120}
              {...type}
            />
            <Button
              icon="plus"
              className="ml-auto my-auto"
              onClick={handleNewContact}
            >
              New Contact
            </Button>
          </div>
          <div className="contacts-page__content">
            {isLoading ? (
              <div className="my-auto d-flex">
                <RiseLoader />
              </div>
            ) : isError ? (
              <div>Error: {error?.message}</div>
            ) : data?.results && data?.results?.length > 0 ? (
              <>
                <ContactsTable data={data.results} onDelete={() => refetch()} />
                <Pagination
                  className="mt-auto"
                  tatalCount={data?.count}
                  {...page}
                />
              </>
            ) : (
              <div className="mx-auto my-auto">
                <p className=" text-center text-gray">
                  You currently have no contact.
                </p>
                <Button
                  icon="plus"
                  onClick={() => {
                    contactModal.setOpen(true);
                  }}
                  className="mx-auto mt-1"
                >
                  New contact
                </Button>
              </div>
            )}
          </div>
        </div>
        {
          contactModal?.open &&
          <NewIndustryContactModal {...contactModal} onAdd={() => refetch()} />
        }
      </AttorneyLayout>
    );
  };
