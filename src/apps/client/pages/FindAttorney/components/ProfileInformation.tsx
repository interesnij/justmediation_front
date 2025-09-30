import React from "react";
import { Tab, RiseLoader } from "components";
import { useInput } from "hooks";
import { useQuery } from "react-query";
import { getEvents } from "api";
import { format } from "date-fns";

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
];

export const ProfileInformation = ({ data }) => {
  const currentTab = useInput(tabData[0].tab);
  const param = data?.type === 'attorney' ?
    {
      attorney: data?.id
    }
    :
    {
      paralegal: data?.id
    };
  const {
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
    data: eventsData,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["profile-information-overview", data?.id],
    () => getEvents(param),
    {
      keepPreviousData: true,
      enabled: !!data?.id,
    }
  );

  return (
    <div style={{ minHeight: 400 }}>
      <Tab {...currentTab} data={tabData} />
      <div className="mt-4 px-4">
        {currentTab.value === tabData[0].tab ? (
          <About data={data} />
        ) : currentTab.value === tabData[1].tab ? (
          <Pricing data={data} />
        ) : currentTab.value === tabData[2].tab ? (
          <Events
            isLoading={isEventsLoading}
            error={eventsError}
            isError={isEventsError}
            data={eventsData?.results || []}
          />
        ) : null}
      </div>
    </div>
  );
};

const About = ({ data }) => {
  return (
    <>
      <div className="heading">Biography</div>
      <div className="text mt-2">{data?.biography}</div>
      <div className="divider my-4"></div>
      <div className="heading">Jurisdictions & Registrations</div>
      <div className="row">
        {data?.practice_jurisdictions?.map((item, index) => (
          <div className="col-md-4 mt-3 text-gray" key={`${index}key`}>
            <div className="label">{item?.country}</div>
            <div className="text">
              Registration #: {item?.number} <br /> Year Admitted: {item?.year}
            </div>
          </div>
        ))}
      </div>
      <div className="divider my-4"></div>
      <div className="heading">Education</div>
      <div className="row">
        {data?.education?.map((item, index) => (
          <div className="col-md-4 mt-3" key={`${index}key`}>
            <div className="label">{item?.university}</div>
            <div className="text">Graduated {item?.year}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const Pricing = ({ data }) => {
  return (
    <>
      <div className="heading">Fee Types</div>
      <div className="d-flex flex-wrap mt-2">
        {data?.fee_types_data?.map((method, index) => (
          <div key={`${index}key`} className="service">
            {method?.title}
          </div>
        ))}
      </div>
      <div className="divider my-4"></div>

      <div className="heading">Accepted Payment Methods</div>
      <ul className=" mt-2">
        {data?.payment_type_data?.map((item, index) => (
          <li key={`${index}key`} className="text-dark">
            {item?.title}
          </li>
        ))}
      </ul>
    </>
  );
};

interface EventsProps {
  isLoading: boolean;
  isError: boolean;
  error: any;
  data: any[];
}

const Events = ({ isLoading, error, isError, data = [] }: EventsProps) => {
  return isLoading ? (
    <div className="d-flex">
      <RiseLoader className="my-4" />
    </div>
  ) : isError ? (
    <div className="my-4 text-center text-gray">{error}</div>
  ) : (
    <div>
      {data.map((event, index) => (
        <div key={`${index}key`}>
          <div className="text-black">{event?.title}</div>
          <div className="text-gray mt-1">
            {event?.start
              ? format(new Date(event.start), "MM/dd/yyyy hh:mm:ss")
              : ""}
            {" - "}
            {event?.end
              ? format(new Date(event.end), "MM/dd/yyyy hh:mm:ss")
              : ""}
          </div>
          <div className="text-gray mt-1"> {event?.location}</div>
          <div className="text-gray mt-1"> {event?.description}</div>
          <div className="divider my-3"></div>
        </div>
      ))}
    </div>
  );
};
