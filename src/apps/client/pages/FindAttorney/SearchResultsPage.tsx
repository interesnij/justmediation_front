import React, { useEffect, useState } from "react";
import { RouteComponentProps, useLocation, navigate } from "@reach/router";
import { Breadcrumb, SearchBar, Button, Select, RiseLoader } from "components";
import { Attorney, SearchCheckbox } from "./components";
import { AttorneyFindLayout } from "apps/client/layouts";
import { createChat, getFavoriteAttorneys, toggleFavoriteAttorney } from "api"; 
import { useQuery } from "react-query";
import { useBasicDataContext, useChatContext, useAuthContext } from "contexts";
import { CompareAttorneysModal, CallStartModal } from "modals";
import { useModal } from "hooks";
import { experienceData } from "./helpers";
import MapComponent from "./components/MapComponent";
import { useFilters } from "./useFilters";
import { useSearch } from "./useSearch";


export const SearchResultsPage: React.FunctionComponent<RouteComponentProps> =
() => {
  const location = useLocation();
  const { specialties, cities, languages } = useBasicDataContext();

  const { onStartCall } = useChatContext();
  const { userId, profile } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const [compares, setCompares] = useState<number[]>([]);
  const compareAttorneys = useModal();
  const [centeredAttorney, setCenteredAttorney] = useState(null);
  const callStartModal = useModal();
  const [currentAttorney, setCurrentAttorney] = useState<any>(null);
  const [defaultPracticeAreas, setDefaultPracticeArea] = useState<any>([]);

  const { 
    data: favorites, 
    refetch: refetchFavorites,
    isLoading: isLoadingFavorites,
  } = useQuery(
    ["favorite-attorneys"], () => getFavoriteAttorneys(), { keepPreviousData: true }
  );

  const {
    data,
    isFetching,
    searchArea,
    selectArea,
    isDropdownArea,
    handleAreaClear,
    handleAreaSearch,
    searchLocation,
    selectLocation,
    isDropdownLocation,
    handleLocationClear,
    handleLocationSearch,
    addressString,
    handleSearch,
    searchQuery
  } = useSearch(location.search, true)

  const {
    filteredData,
    experienceFilter,
    freeConsultationFilter,
    languageFilter,
    videoCallFilter
  } = useFilters(data?.results || []);

  const searchLocationCity: string | null = searchQuery ? new URLSearchParams(searchQuery).get("firm_locations__city") : "";

  useEffect(() => {
    setDefaultPracticeArea(specialties.filter((i) => i.created_by === null))
  }, [specialties])

  useEffect(() => {
    if (filteredData.length && !addressString.value) {
      setCenteredAttorney(filteredData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData?.length])

  const handleChat = async (id: number) => {
    const chatObject = await createChat({ participants: [id], is_group: 0 });
    navigate(`/client/chats/${chatObject.id}`);
  };

  const handleToggleCompare = (id: number) => {
    const newCompares = compares.indexOf(id) === -1
      ? compares.concat(id)
      : compares.filter(v => v !== id);
    setCompares(newCompares);
  }

  const handleToggleFavorite = async (id: number, value: boolean) => {
    setLoading(true)
    await toggleFavoriteAttorney(id, value)
    await refetchFavorites()
    setLoading(false)
  }

  return (
    <AttorneyFindLayout tab="Search" className="no-background">
      <div className="find-search-result-page">
        <div className="search-section">
          <Breadcrumb
            previous={[
              { label: "Find an attorney home", url: "/client/find/search" },
            ]}
            current="Search results"
          />
          <div className="d-flex mt-2" style={{maxWidth: "1200px"}}>
            <div className="search-field-wrap flex-1">
              <SearchBar
                icon="search"
                placeholder="Search by name or practice area"
                className="flex-1"
                onClick={() => isDropdownArea.onChange(!isDropdownArea.value)}
                onClear={handleAreaClear}
                value={searchArea.value}
                onChange={handleAreaSearch}
              />
              {isDropdownArea.value && (
                <div className="search-field-results-wrap">
                  {defaultPracticeAreas?.filter(s => s.title.toLowerCase().indexOf(searchArea.value.toLowerCase()) !== -1).map(s => (
                    <div
                      key={`area-${s.id}`}
                      className="contact-search-control__menu-item"
                      onClick={() => selectArea(s)}
                    >
                      <span className="my-auto">{s.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="search-field-wrap ml-3 flex-1">
              <SearchBar
                icon="marker"
                placeholder="Enter a location"
                onClick={() => isDropdownLocation.onChange(!isDropdownLocation.value)}
                onKeyDown={() => isDropdownLocation.onChange(true)}
                onClear={handleLocationClear}
                value={searchLocation.value}
                onChange={handleLocationSearch}
              />
              {isDropdownLocation.value && !!cities?.length && (
                <div className="search-field-results-wrap">
                  {cities.map(city => (
                    <div
                      key={`city-${city.id}`}
                      className="contact-search-control__menu-item"
                      onClick={() => selectLocation(city)}
                    >
                      <span className="my-auto">
                        {city.name}{city?.state ? `, ${city?.state.name}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button className="ml-3" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <div className="d-flex mt-2">
            <SearchCheckbox className="mr-3" {...freeConsultationFilter}>
              Free Consultation
            </SearchCheckbox>
            <SearchCheckbox className="mr-3" {...videoCallFilter}>
              Video Calls
            </SearchCheckbox>
            <Select
              className="mr-3"
              data={experienceData}
              {...experienceFilter}
            />
            <Select 
              data={[{id:0, title: "Any Language"}].concat(languages)} 
              {...languageFilter}
            />
          </div>
        </div>
        <div className="search-results-sections">
          {isFetching || isLoadingFavorites || loading ? (
            <div className="spinner-wrap">
              <RiseLoader />
            </div>
          ) : !!filteredData?.length ? (
            <>
              <div className="attorney-section">
                {filteredData.filter(item => !!item.firm_locations.length).map((a => (
                  <Attorney 
                    key={`att-${a.id}`} 
                    data={a}
                    languages={languages}
                    specialties={specialties}
                    onClick={() => setCenteredAttorney(a)}
                    favoriteIds={favorites?.favorite_attorneys || []}
                    toggleFavorite={value => handleToggleFavorite(a.id, value)}
                    toggleCompare={() => handleToggleCompare(a.id)}
                    isComparing={compares.indexOf(a.id) !== -1}
                    onCall={() => {
                      setCurrentAttorney(a);
                      callStartModal.setOpen(true)
                    }}
                    onChat={() => handleChat(a.id)}
                    query={searchQuery}
                  />
                )))}
                {compares.length > 1 && compares.length < 8 && (
                  <div className="compare-btn-wrap">
                    <Button onClick={() => compareAttorneys.setOpen(true)}>
                      Compare ({compares.length}) selected attorneys
                    </Button>
                  </div>
                )}
              </div>
              <div className="map-section">
                <MapComponent 
                  attorney={centeredAttorney}
                  data={filteredData || []} 
                  address={addressString.value}
                  query={searchQuery}
                />
              </div>
            </>
          ) : (
            <div className="no-results">
              No results found
            </div>
          )}
        </div>
      </div>
      {compareAttorneys?.open && !!filteredData?.length && compares.length > 1 && (
        <CompareAttorneysModal 
          {...compareAttorneys} 
          removeFromCompare={handleToggleCompare}
          attorneys={filteredData.filter(item => compares.indexOf(item.id) !== -1)}
          favoriteIds={favorites?.favorite_attorneys || []}
          toggleFavorite={(id, value) => handleToggleFavorite(id, value)}
          onCall={id => {
            setCurrentAttorney(filteredData.filter(item => item.id === id))
            callStartModal.setOpen(true)
          }}
          onChat={handleChat}
        />
      )}
      <CallStartModal 
        {...callStartModal} 
        onConfirm={() => onStartCall({ participants: [+userId, currentAttorney?.id] })} 
        participants={[currentAttorney]} 
        userId={profile?.id} 
      />
    </AttorneyFindLayout>
  )
}