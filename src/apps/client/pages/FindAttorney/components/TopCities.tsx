import React, { useState, useEffect } from "react";
import { RiseLoader, Folder, FolderItem,  } from "components";
import { navigate } from "@reach/router";
import CityImg from "assets/images/find_attorney_city.jpg";
import { useBasicDataContext } from "contexts";

export const TopCities = () => {
  const { topCities, fetchTopCities } = useBasicDataContext();
  const [list, setList] = useState<any[]>([]);
    
  const renderArea = (city, state) => {
    switch (city) {
      case 'Baltimore':     return 'MD, US';
      case 'Hartford':
      case 'New Haven':     return 'CT, US';
      case 'Yonkers':
      case 'New York City': return 'NY, US';
      case 'Newark':
      case 'Jersey City':   return 'NJ, US';
      case 'Washington':    return 'D.C., US';
      case 'Boston':        return 'MA, US';
      case 'Philadelphia':  return 'PA, US';
      default: 
        return state?.name;
    }
  }

  useEffect(() => {
    console.log('here')
    if (!topCities?.length)
      fetchTopCities();
  }, [])

  useEffect(() => {
    console.log('up', topCities)
    if (!topCities?.length) return;
    setList(
      topCities.map(city => {
        return {
          id: city.id,
          name: city.name,
          area: renderArea(city.name, city?.state?.name)
        }
      })
    )
  }, [topCities])

  return !list?.length ? (
    <div className="d-flex mt-4">
      <RiseLoader className="my-4 py-4" />
    </div>
  ) : (
    <div className="d-flex mt-4">
      <Folder label="Browse by Location" className="col-md-6">
        <FolderItem>
        <div className="row">
            {list.map((s,i) => (
              <div 
                key={`area-s-${s.name}-${i}`} 
                className="col-md-6 find-search-page__skill cursor-pointer"
                onClick={() => navigate(`/client/find/results?firm_locations__city=${s.id}&city_name=${s.name}`)}
              >
                {s.name}, {s.area}
              </div>
            ))}
          </div>
        </FolderItem>
      </Folder>
      <img className="col-md-6" src={CityImg} alt="cities" />
    </div>
  )
}
