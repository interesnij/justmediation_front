import React from "react";

export const Paralegal = ({ data }) => {
  return (
    <div className="m-2">
      <div className="heading">Biography</div>
      <div className="text mt-2">{data?.biography}</div>
      <div className="divider my-4"></div>
      <div className="heading">Jurisdictions & Registrations</div>
      <div className="row">
        {data?.about?.jurisdictions.map((item, index) => (
          <div className="col-md-4 mt-3" key={`${index}key`}>
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
        {data?.about?.education.map((item, index) => (
          <div className="col-md-4 mt-3" key={`${index}key`}>
            <div className="label">{item?.university}</div>
            <div className="text">Graduated {item?.year}</div>
          </div>
        ))}
      </div>
      <div className="divider my-4"></div>
      <div className="row">
        <div className="col-md-6">
          <div className="heading">Fee Types</div>
        </div>
        <div className="col-md-6">
          <div className="heading">Accepted Payment Methods</div>
        </div>
      </div>
    </div>
  );
};
