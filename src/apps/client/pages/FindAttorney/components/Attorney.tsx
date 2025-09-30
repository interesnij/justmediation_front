import React, { useState } from "react";
import { User, Button, Checkbox } from "components";
import { Link, navigate } from "@reach/router";
import FavoriteIcon from "assets/icons/favorite_fill.svg";
import UnfavoriteIcon from "assets/icons/favorite_empty.svg";

export const Attorney = ({
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
  const attorney = props.data || {};
  const i_link = props.query ? attorney?.id + props.query : attorney?.id;
  const isFavorite = props.favoriteIds && props.favoriteIds.indexOf(attorney?.id) !== -1
    ? true 
    : false;
  const isVideo = attorney?.appointment_type_data?.length && attorney?.appointment_type_data.find(i => i.id === 2) 
    ? true 
    : false;
  const isFreeConsultation = attorney?.fee_types_data?.length && attorney?.fee_types_data.find(i => i.id === 5) 
    ? true 
    : false;
  const isLongBio = attorney?.biography?.length > 200 ? true : false;
  const [isShowFullBio, showFullBio] = useState(false);

  return (
    <div className="find-attorney-search" onClick={props?.onClick}>
      <div>
        <Link to={`/client/find/attorneys/${i_link}`}>
          <User 
            size="large" 
            avatar={attorney?.avatar} 
          />
        </Link>
        <div className="mt-1 d-flex justify-content-center">
          <Checkbox 
            value={props?.isComparing || false}
            onChange={value => toggleCompare(attorney?.id, value)}
          >
            Compare
          </Checkbox>
        </div>
      </div>
      <div className="ml-3 flex-1">
        <div className="d-flex"> 
          <Link to={`/client/find/attorneys/${i_link}`}>
            <div className="find-attorney-search__name">{attorney?.first_name} {attorney?.last_name}</div>
          </Link>
          {!!attorney?.featured && (
            <div className="find-attorney-search__featured ml-4">
              FEATURED
            </div>
          )}
          {!!props.favoriteIds && (
            <img
              onClick={() => toggleFavorite(!isFavorite)}
              className="find-attorney-search__favorite"
              src={isFavorite ? FavoriteIcon : UnfavoriteIcon}
              alt="favorite"
            />
          )}
        </div>
        <div className="text-dark">{attorney?.firm_name}</div>
        <div className="d-flex mt-2">
          {props?.specialties?.length && !!attorney?.specialities?.length && attorney.specialities.slice(0,3).map(item => (
            <div
              key={`att-${attorney?.id}-spec-${item}`} 
              className="find-attorney-search__practice"
            >
              {props.specialties?.find((s: any) => s.id === +item)?.title}
            </div>
          ))}
        </div>
        <div className="d-flex flex-wrap mt-2">
          {isFreeConsultation && (
            <div className="find-attorney-search__skill">
              Free Consultation
            </div>
          )}
          {isVideo && (
            <div className="find-attorney-search__skill">
              Video Calls
            </div>
          )}
          {!!attorney?.years_of_experience && (
            <div className="find-attorney-search__skill">{attorney.years_of_experience} Years</div>
          )}
          {!!attorney?.spoken_language_data?.length && attorney?.spoken_language_data.map(lan => (
            <div 
              key={`att-${attorney?.id}-lang-${lan.id}`} 
              className="find-attorney-search__skill"
            >
              {lan.title}
            </div>
          ))}
        </div>
        {attorney?.biography && (
          <>
            <div className={`find-attorney-search__desc mt-1${!isShowFullBio && isLongBio ? " faded-text" : ""}`}>
              {attorney?.biography}
            </div>
            {isLongBio && !isShowFullBio && (
              <div className="view-more mt-1" onClick={e=>showFullBio(true)}>
                View More
              </div>
            )}
          </>
        )}
        <div className="mt-1 d-flex flex-wrap">
          {!!attorney?.website && (
            <a target="_blank" href={attorney.website} style={{ textDecoration: 'none' }}>
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
