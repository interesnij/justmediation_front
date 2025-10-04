import React, { useState } from "react";
import { User, Button, Checkbox } from "components";
import { Link, navigate } from "@reach/router";
import FavoriteIcon from "assets/icons/favorite_fill.svg";
import UnfavoriteIcon from "assets/icons/favorite_empty.svg";

export const Mediator = ({
  toggleCompare = () => {},
  toggleFavorite = () => {},
  ...props
}: { 
  data?: any,
  languages?: object[],
  specialties?: any[],
  onClick?(): void;
  onChat?(): void; 
  onCall?(): void;
  favoriteIds?: number[];
  toggleFavorite?(value: boolean): void;
  isComparing?: boolean;
  toggleCompare?(id:number, value:boolean): void;
  query?: string,
}) => {
  const mediator = props.data || {};
  const i_link = props.query ? mediator?.id + props.query : mediator?.id;
  const isFavorite = props.favoriteIds && props.favoriteIds.indexOf(mediator?.id) !== -1
    ? true 
    : false;
  const isVideo = mediator?.appointment_type_data?.length && mediator?.appointment_type_data.find(i => i.id === 2) 
    ? true 
    : false;
  const isFreeConsultation = mediator?.fee_types_data?.length && mediator?.fee_types_data.find(i => i.id === 5) 
    ? true 
    : false;
  const isLongBio = mediator?.biography?.length > 200 ? true : false;
  const [isShowFullBio, showFullBio] = useState(false);

  return (
    <div className="find-mediator-search" onClick={props?.onClick}>
      <div>
        <Link to={`/client/find/mediators/${i_link}`}>
          <User 
            size="large" 
            avatar={mediator?.avatar} 
          />
        </Link>
        <div className="mt-1 d-flex justify-content-center">
          <Checkbox 
            value={props?.isComparing || false}
            onChange={value => toggleCompare(mediator?.id, value)}
          >
            Compare
          </Checkbox>
        </div>
      </div>
      <div className="ml-3 flex-1">
        <div className="d-flex"> 
          <Link to={`/client/find/mediators/${i_link}`}>
            <div className="find-mediator-search__name">{mediator?.first_name} {mediator?.last_name}</div>
          </Link>
          {!!mediator?.featured && (
            <div className="find-mediator-search__featured ml-4">
              FEATURED
            </div>
          )}
          {!!props.favoriteIds && (
            <img
              onClick={() => toggleFavorite(!isFavorite)}
              className="find-mediator-search__favorite"
              src={isFavorite ? FavoriteIcon : UnfavoriteIcon}
              alt="favorite"
            />
          )}
        </div>
        <div className="text-dark">{mediator?.firm_name}</div>
        <div className="d-flex mt-2">
          {props?.specialties?.length && !!mediator?.specialities?.length && mediator.specialities.slice(0,3).map(item => (
            <div
              key={`att-${mediator?.id}-spec-${item}`} 
              className="find-mediator-search__practice"
            >
              {props.specialties?.find((s: any) => s.id === +item)?.title}
            </div>
          ))}
        </div>
        <div className="d-flex flex-wrap mt-2">
          {isFreeConsultation && (
            <div className="find-mediator-search__skill">
              Free Consultation
            </div>
          )}
          {isVideo && (
            <div className="find-mediator-search__skill">
              Video Calls
            </div>
          )}
          {!!mediator?.years_of_experience && (
            <div className="find-mediator-search__skill">{mediator.years_of_experience} Years</div>
          )}
          {!!mediator?.spoken_language_data?.length && mediator?.spoken_language_data.map(lan => (
            <div 
              key={`att-${mediator?.id}-lang-${lan.id}`} 
              className="find-mediator-search__skill"
            >
              {lan.title}
            </div>
          ))}
        </div>
        {mediator?.biography && (
          <>
            <div className={`find-mediator-search__desc mt-1${!isShowFullBio && isLongBio ? " faded-text" : ""}`}>
              {mediator?.biography}
            </div>
            {isLongBio && !isShowFullBio && (
              <div className="view-more mt-1" onClick={e=>showFullBio(true)}>
                View More
              </div>
            )}
          </>
        )}
        <div className="mt-1 d-flex flex-wrap">
          {!!mediator?.website && (
            <a target="_blank" href={mediator.website} style={{ textDecoration: 'none' }}>
              <Button className="mr-2 mt-2" type="outline">
                View Website
              </Button>
            </a>
          )}
          <Button 
            onClick={props?.onCall}
            type="outline" 
            className="mr-2 mt-2"
          >
            Start a Call
          </Button>
          <Button 
            onClick={props?.onChat}
            className="mt-2"
          >
            Chat Now
          </Button>
        </div>
      </div>
    </div>
  );
};
