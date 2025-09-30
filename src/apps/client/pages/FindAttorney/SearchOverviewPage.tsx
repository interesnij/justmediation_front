import React, { useEffect, useState } from "react";
import { RouteComponentProps, useLocation, navigate } from "@reach/router";
import { useQuery } from "react-query";
import { Card, SearchBar, Button, Folder, FolderItem, Breadcrumb } from "components";
import BooksImg from "assets/images/find_attorney_books.jpg";
import { AttorneyFindLayout } from "apps/client/layouts";
import { useBasicDataContext } from "contexts";
import { AllAreas, TopCities } from "./components";
import { practiceAreasList } from "./helpers";
import { useSearch } from "./useSearch";
import { useModal } from "hooks";
import {NewAttorneyContactModal} from "modals";

/**
 * Find Attorney | Search Overview
 * 
 */
export const SearchOverviewPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { specialties, cities } = useBasicDataContext();
  const location = useLocation();
  const [isAllAreas, setAllAreas] = useState(false);
  const [popularPracticeAreas, setPopularPracticeAreas] = useState<any>([]);
  const [defaultPracticeAreas, setDefaultPracticeArea] = useState<any>([]);
  
  const {
    queryOnSearch,
    searchArea,
    selectArea,
    isDropdownArea,
    handleAreaClear,
    handleAreaSearch,
    searchLocation,
    selectLocation,
    isDropdownLocation,
    handleLocationClear,
    handleLocationSearch
  } = useSearch(location.search)

  useEffect(() => {
    setPopularPracticeAreas(specialties.filter((i) => practiceAreasList.indexOf(i.title)!==-1));
    setDefaultPracticeArea(specialties.filter((i) => i.created_by === null))
  }, [specialties])

  useEffect(() => {
    setAllAreas(location.search.indexOf('all') !== -1);
  }, [location.search])
  
  const isBaseView = !isAllAreas;
  const newAttorneyContactModal = useModal();

  const handleSearch = () => {
    const q = queryOnSearch();
    if (q) {
      navigate(`/client/find/results?${q}`)
    }
  }

  return (
    <AttorneyFindLayout tab="Search" className={isBaseView ? '' : 'no-background'}>
      <div className="find-search-page">
        {isAllAreas ? (
          <Breadcrumb
            previous={[
              { label: "Search", url: "/client/find/search" },
            ]}
            current="Browse by practice area"
          />
        ) : (
          <h2>Legal help when and where you need it</h2>
        )}
        <Card className={isBaseView ? 'mt-4' : 'plain-card with-bottom-border'}>
          {!isAllAreas && (
            <div className="text-dark">
              Search for pre-vetted lawyers across the world that fits your unique
              needs.
            </div>
          )}
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
                  {cities.map(c => (
                    <div
                      key={`city-${c.id}`}
                      className="contact-search-control__menu-item"
                      onClick={() => selectLocation(c)}
                    >
                      <span className="my-auto">
                        {c.name}{c?.state ? `, ${c?.state.name}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button className="ml-3" onClick={handleSearch}>
              {isBaseView ? "Search for an Attorney" : "Search"}
            </Button>
          </div>
        </Card>
        {isAllAreas ? (
          <AllAreas specialties={defaultPracticeAreas} />
        ) : (
          <>
            <div className="d-flex mt-4">
              <img className="find-search-page__img" src={BooksImg} alt="books" />
              <Folder label="Browse by Practice Area" className="ml-4" viewAll="/client/find/search?all">
                <FolderItem>
                  <div className="row">
                    {popularPracticeAreas.map(s => (
                      <div 
                        key={`area-s-${s.id}`} 
                        className="col-md-4 find-search-page__skill cursor-pointer"
                        onClick={() => navigate(`/client/find/results?user__specialities=${s.id}`)}
                      >
                        {s.title}
                      </div>
                    ))}
                  </div>
                </FolderItem>
              </Folder>
            </div>
            <TopCities />
          </>
        )}

        <div className="py-4 find-search-page-bottom">
          <h2>Can't find a lawyer?</h2>
          <FolderItem className="mt-4">
            Find topics, answers, or even ask your own question in our Forums section.
            <Button className="mt-2 green" theme="white" onClick={() => navigate(`/client/forums`)}>
              Go to Forums
            </Button>
          </FolderItem>
        </div> 

        <div className="py-4 find-search-page-bottom">
          <h2>Invite Your Attorney</h2>
          <FolderItem className="mt-4">
            Add lawyers to your contacts. If the Lawyer is not registered in Justlaw, send him an invitation.
            <Button className="mt-2 green" theme="white" onClick={() => newAttorneyContactModal.setOpen(true)}>
              Get started
            </Button> 
          </FolderItem>
        </div>
        {
          newAttorneyContactModal?.open &&
          <NewAttorneyContactModal {...newAttorneyContactModal} />
        }
      </div>
    </AttorneyFindLayout>
  );
};
