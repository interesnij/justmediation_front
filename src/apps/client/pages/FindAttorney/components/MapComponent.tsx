import React, { useEffect, useState } from "react";
import {Map, GoogleApiWrapper, GoogleAPI } from 'google-maps-react';

interface Attorney {
  first_name: string;
  last_name: string;
  specialities: number[];
  firm_locations: {
    id: number;
    city: number;
    latitude: string;
    longitude: string;
    address: string;
    zip_code: number;
    city_data: {
      name: string;
    }
    state_data: {
      name: string;
    }
  }[]
}

interface iMapComponent {
  data: Attorney[]
  attorney: Attorney|null
  google: GoogleAPI
  address?: string
  query?: string
}
// Connecticut 2
// Arkansas 2

const MapComponent = ({data, attorney, google, address, query }: iMapComponent) => {

  const searchLocationCity: string | null = query ? new URLSearchParams(query).get("firm_locations__city") : "";
  const specialtyUser: string | null = query ? new URLSearchParams(query).get("user__specialities") : "";
  const [mapObject, setMapObject] = useState<any>(null);
  const [geoCoder, setGeoCoder] = useState<any>(null);

  // console.log(data);
  // console.log(data?.find(item => item.firm_locations.length > 1))

  const mapLoaded = (mapProps, map) => {
    setMapObject(map);
    const geo = new google.maps.Geocoder();
    setGeoCoder(geo);
    let isFirstMarker: boolean = false;
    const list: any[] = [];
    let index = 0;
    // iterate attorneys
    for(const attorney of data) {
      if (!attorney?.firm_locations?.length) {
        continue;
      } 
      // iterate firms
      for(const firm of attorney.firm_locations) {
        if (!firm.latitude || !firm.longitude){
          continue;
        } 
        const addressString = getAddressString(firm);
        const position = {
          lat: +firm.latitude,
          lng: +firm.longitude
        }
       // console.log(attorney?.specialities.find(item => item === Number(specialtyUser)) )
        if((specialtyUser && attorney?.specialities?.find(item => item === Number(specialtyUser))) || (searchLocationCity && firm?.city === Number(searchLocationCity) && !list.find(item => item.id === firm.id))) {
          list.push(createMarker(
            map,
            position,
            `${attorney?.first_name} ${attorney?.last_name} | ${addressString}`,
            ++index,
            firm.id
          ));
        }

        if (!isFirstMarker && !address) {
          isFirstMarker = true;
          map.setCenter(position);
        }
      }
    };
    if (address) {
      map.setOptions({ zoom: 11 })
      geo.geocode({'address': address}, (results, status) => {
        if (status !== 'OK') return; 
        map.setCenter(results[0].geometry.location);
      });
    }
    loopWithDelay(list); // make sure we don't hit limitations
  }

  useEffect(() => {
    if (!geoCoder || !address) return;
    geoCoder.geocode({'address': address}, (results, status) => {
      if (status !== 'OK') return; 
      mapObject.setCenter(results[0].geometry.location);
    });
  }, [address])

  const loopWithDelay = (markers, i = 0, delay = 150) => {
    setTimeout(() => {
      new google.maps.Marker(markers[i]);
      if (i < markers.length) {
        loopWithDelay(markers, ++i);
      } 
    }, delay)
  }

  const getAddressString = (firm) => [
    firm.address || '',
    firm.city_data?.name || '',
    firm.state_data?.name || '',
    firm.zip_code || ''
  ].join(' ');

  const createMarker = (map, position, title, label, id) => {
    return {
      map,
      position,
      title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1,
        fillColor: '#f23d40',
        strokeOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#fff',
        scale: 13
      },
      label: {
        color: '#fff', 
        fontSize: '11px', 
        fontWeight: '600',
        text: ''+label // label number one per attorney
      },
      id
    }
  }

  useEffect(() => {
    if (!mapObject || !attorney?.firm_locations?.length) {
      return;
    }
    updateCenter(attorney)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attorney])

  const updateCenter = (attorney) => {

    if (!attorney?.firm_locations?.length) return;
    const firm = findMatchingFirm(attorney.firm_locations);
    if (!firm) return;
    mapObject.setOptions({ zoom: 17 })
    mapObject.setCenter({
      lat: +firm.latitude,
      lng: +firm.longitude
    })
  }

  const findMatchingFirm = (firms: any[]) => {
    const zip = address && +address > 1 ? address : null;
    const city = address && !zip ? address.split(', ')[0] : null;
    let match: any = null;
    for(const firm of firms){
      if (!firm || !firm.latitude || !firm.longitude) continue;
      if (!match && (searchLocationCity && (firm?.city === Number(searchLocationCity)))) {
        match = firm;
      }
      //if (zip && zip !== f?.zip_code) 
      //  return f;
      if (city && city !== firm?.city_data?.name && (searchLocationCity && firm?.city === Number(searchLocationCity))) return firm;
    }
    return match;
  }

  return (
    <Map 
      google={google} 
      onReady={mapLoaded}
      zoom={11}
    />
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS || ''
})(MapComponent)