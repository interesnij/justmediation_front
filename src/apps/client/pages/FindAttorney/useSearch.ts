import React, {useEffect, useState} from "react";
import { useInput } from "hooks";
import { findAttorneys } from "api"; 
import { useQuery } from "react-query";
import { parse, stringify } from "query-string";
import { useBasicDataContext } from "contexts";
import {navigate, useLocation} from "@reach/router";

export const useSearch = (
  query: string,
  isResultsPage: boolean = false
) => {
  const location = useLocation();

  const q = useInput(parse(query) || {})
  const { specialties, cities, fetchCities } = useBasicDataContext();

  const areaInput = useInput(null);
  const searchArea = useInput("");
  const isDropdownArea = useInput(false);

  const locationInput = useInput(null);
  const searchLocation = useInput("");
  const isDropdownLocation = useInput(false);

  const addressString = useInput("")

  const [searchQuery, setSearchQuery] = useState<string>(location.search);

  const { isFetching, data, refetch } = useQuery(
    ["search-results"], () => findAttorneys(q.value), {
      keepPreviousData: true,
      enabled: isResultsPage
    }
  );
  
  const queryOnSearch = () => {
    const currentQueryObject = {...q.value};
    const zip = +searchLocation.value > 1 ? searchLocation.value : null;
    if (zip) {
      delete currentQueryObject.firm_locations__city;
      currentQueryObject.firm_locations__zip_code = zip;
    }
    if (!areaInput.value && searchArea.value) {
      delete currentQueryObject.user__specialities;
      currentQueryObject.search = searchArea.value;
    }
    if (isResultsPage) {
      q.onChange(currentQueryObject);
      if (searchLocation.value)
        addressString.onChange(searchLocation.value);
    }
    return stringify(currentQueryObject);
  };
    
  const selectArea = async (item) => {
    isDropdownArea.onChange(false)
    searchArea.onChange(item.title);
    const newQuery = { ...q.value, user__specialities: item.id };
    delete newQuery.search;
    areaInput.onChange(item.id);
    q.onChange(newQuery);

  }
  
  const handleAreaSearch = (value: string) => {
    if (!value?.length){
      handleAreaClear();
      return;
    }
    if (areaInput.value && searchArea.value?.length > value.length) { // erasing
      areaInput.onChange(null);
    }
    searchArea.onChange(value)
  }
  
  const handleAreaClear = () => {
    isDropdownArea.onChange(false)
    areaInput.onChange(null)
    searchArea.onChange("")
    const newQuery = { ...q.value };
    delete newQuery.user__specialities;
    delete newQuery.search;
    q.onChange(newQuery);
  }
    
  const selectLocation = async (item) => {
    isDropdownLocation.onChange(false)
    let textValue = item.name;
    if (item?.state?.name) 
      textValue += ', ' + item.state.name;
    searchLocation.onChange(textValue);
    const newQueryObject = {
      ...q.value,
      firm_locations__city: item.id
    };
    locationInput.onChange(item.id);
    delete newQueryObject.firm_locations__zip_code;
    q.onChange(newQueryObject);
  }
  
  const handleLocationSearch = (value: string) => {
    if (!value?.length) {
      handleLocationClear();
      return;
    }
    searchLocation.onChange(value);
    if (value?.length >= 3) {
      fetchCities({ search: value.trim().split(', ')[0].toLowerCase() })
    }
  }
  
  const handleLocationClear = () => {
    isDropdownLocation.onChange(false)
    locationInput.onChange(null)
    searchLocation.onChange("");
    const newQuery = {...q.value};
    delete newQuery.firm_locations__city;
    delete newQuery.firm_locations__zip_code;
    q.onChange(newQuery);
  }

  const initInput = () => {
    const newQueryObject:any = parse(query);
    // name 
    if (newQueryObject.search) {
      searchArea.onChange(newQueryObject.search)
    }
    // practice area
    if (specialties?.length && newQueryObject.user__specialities){
      areaInput.onChange(newQueryObject.user__specialities);
      searchArea.onChange(specialties.find(item => item.id === +newQueryObject.user__specialities)?.title);
    } 
    // location
    if (newQueryObject.city_name && newQueryObject.firm_locations__city){
      locationInput.onChange(newQueryObject.firm_locations__city);
      searchLocation.onChange(newQueryObject.city_name);
    } else if (newQueryObject.firm_locations__zip_code) {
      // zip 
      searchLocation.onChange(newQueryObject.firm_locations__zip_code);
    } else if (cities?.length && newQueryObject.firm_locations__city) {
      // city
      const city = cities.find(item => 
        item.id === +newQueryObject.firm_locations__city
      );
      const state = city?.state?.name ? `, ${city.state.name}` : '';
      searchLocation.onChange(
        city?.name + state
      );
    }
  }

  const handleSearch = () => {
    const query = queryOnSearch();
    setSearchQuery('?' + query);
    navigate(`/client/find/results?${query}`);
    refetch();
  }

  useEffect(() => {
    initInput() 
  }, [])

  return {
    isDropdownArea,
    handleAreaClear,
    searchArea,
    handleAreaSearch,
    selectArea,
    isDropdownLocation,
    handleLocationClear,
    searchLocation,
    handleLocationSearch,
    selectLocation,
    addressString,
    data,
    refetchData: refetch,
    isFetching,
    queryOnSearch,
    handleSearch,
    searchQuery
  }
}