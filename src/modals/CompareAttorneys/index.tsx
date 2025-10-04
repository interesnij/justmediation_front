import React, { useEffect } from "react";
import { Modal, User2, FavoriteButton, Button } from "components";
import { useBasicDataContext } from "contexts";
import CloseIcon from "assets/icons/close.svg";
import { v4 as uuid } from 'uuid';
import { navigate } from "@reach/router";
import "./index.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  removeFromCompare(id:number): void;
  toggleFavorite(id:number, value:boolean): void;
  mediators: any[];
  favoriteIds: number[];
  onChat(id:number): void;
  onCall(id:number): void;
}

export const CompareMediatorsModal = ({
  open,
  setOpen,
  removeFromCompare,
  mediators,
  favoriteIds,
  toggleFavorite = () => {},
  onChat = () => {},
  onCall = () => {}
}: Props) => {
  const { currencies, specialties, cities, languages } = useBasicDataContext();

  useEffect(() => {
    return () => {
      setOpen(false);
    }
  }, [])

  return (
    <Modal
      title="Compare Up to 7 Selected Mediators"
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="find-compare-page">
        <div className="compare-table">
            <div className="compare-table__head">
            <div></div>
            {mediators.map(a => (
              <div key={`row1-a-${a.id}`}>
                <div className="d-flex">
                  <User2
                      className="cursor-pointer"
                      size="normal"
                      userName={`${a?.first_name} ${a?.last_name}`}
                      desc={a?.firm_name}
                      avatar={a?.avatar}
                      onClick={() => navigate(`/client/find/mediators/${a.id}`)}
                  />
                  <img
                      className="find-compare-page__mediator-close"
                      src={CloseIcon}
                      alt="close"
                      onClick={() => removeFromCompare(a.id)}
                  />
                  </div>
                  <div className="ml-4 mt-3">
                  <div className="d-flex">
                      {a?.featured && (
                        <div className="feature ml-3">FEATURED</div>
                      )}
                      <FavoriteButton
                        value={favoriteIds.indexOf(a.id) !== -1}
                        onChange={value => toggleFavorite(a.id, value)} 
                        className="ml-auto" 
                      />
                  </div>
                  </div>
              </div>
            ))}
            </div>
            <div className="compare-table__body">
            <div className="d-flex">
                <div>Pratice Areas</div>
                {specialties?.length && mediators.map(a => (
                  <div key={`row2-a-${a.id}`}>
                    <div className="d-flex flex-wrap">
                      {a?.specialities?.length && a.specialities.map(item => (
                        <span key={uuid()} className="practice">
                          {specialties?.find((s: any) => s.id === +item)?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="d-flex">
                <div>Pricing / Payment</div>
                {mediators.map(a => (
                  <div key={`row3-a-${a.id}`}>
                    <div className="d-flex flex-wrap">
                      {a?.fee_types_data.map(item => (
                        <span key={uuid()} className="skill">
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="d-flex">
              <div>Experience</div>
              {mediators.map(a => (
                <div key={`row4-a-${a.id}`}>
                  {a?.years_of_experience ? `${a.years_of_experience} Years` : 'N/A'}
                </div>
              ))}
            </div>
            <div className="d-flex">
                <div>Languages</div>
                {mediators.map(a => (
                  <div key={`row5-a-${a.id}`}>
                    <div className="d-flex flex-wrap">
                      {a?.spoken_language_data.map(item => (
                        <span key={uuid()} className="skill">
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="d-flex">
              <div>Website</div>
              {mediators.map(a => (
                <div key={`row6-a-${a.id}`}>
                  {a?.website ? (
                    <a className="with-link-icon" target="_blank" href={a.website}>
                      {a.website}
                    </a>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            <div className="d-flex">
                <div>Location(s)</div>
                {mediators.map(a => (
                  <div key={`row7-a-${a.id}`}>
                    <div className="d-flex flex-wrap">
                      {a?.firm_locations.slice(0,5).map(item => (
                        <div key={uuid()} className="address-column">
                          <p>{item.address} {item.city}</p>
                          <p>{item.state_data?.name}, {item.zip_code}</p>
                        </div>
                      ))}
                      {a?.firm_locations.length > 5 && (
                        <div>+ {a.firm_locations.length - 5} more locations</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="d-flex">
              <div></div>
              {mediators.map(a => (
                <div className="flex-column" key={`row7-a-${a.id}`}>
                  <Button 
                    onClick={() => onCall(a.id)}
                    type="outline" 
                    className="mr-1 mt-2"
                  >
                    Start a Call
                  </Button>
                  <Button 
                    onClick={() => onChat(a.id)}
                    className="mt-2"
                  >
                    Chat Now
                  </Button>
                </div>
              ))}
            </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};