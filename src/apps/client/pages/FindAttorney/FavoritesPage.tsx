import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import styled from "styled-components";
import { Attorney } from "./components";
import { RiseLoader, Button } from "components";
import { AttorneyFindLayout } from "apps/client/layouts";
import { useQuery } from "react-query";
import { getFavoriteAttorneys, createChat, toggleFavoriteAttorney } from "api"; 
import { useChatContext, useAuthContext, useBasicDataContext } from "contexts";
import { CompareAttorneysModal, CallStartModal } from "modals";
import { useModal } from "hooks";
import MapComponent from "./components/MapComponent";

export const FavoritesPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { specialties, languages } = useBasicDataContext();
  const [centeredAttorney, setCenteredAttorney] = useState(null);
  const [compares, setCompares] = useState<number[]>([]);
  const { onStartCall } = useChatContext();
  const { userId, profile } = useAuthContext();
  const compareAttorneys = useModal();
  const [loading, setLoading] = useState(false);
  const callStartModal = useModal();
  const [currentAttorney, setCurrentAttorney] = useState<any>(null);
  
  const { isFetching, data, refetch: refetchFavorites } = useQuery(
    ["favorite-attorneys"], 
    () => getFavoriteAttorneys(), 
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!data?.favorite_attorneys_data?.length) return;
    setCenteredAttorney(data.favorite_attorneys_data[0]);
  }, [data?.favorite_attorneys_data?.length])

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
    refetchFavorites()
    setLoading(false)
  }

  return (
    <AttorneyFindLayout tab="Favorites" className="no-background">
      {isFetching || loading ? (
        <div className="spinner-wrap">
          <RiseLoader />
        </div>
      ) : data?.favorite_attorneys_data?.length ? (
        <div className="find-search-result-page">
          <Heading>
            You have {data?.favorite_attorneys?.length} favorited attorney profiles
          </Heading>
          <div className="d-flex" style={{maxHeight: 'calc(100vh - 197px)'}}>
            <div className="attorney-section">
              {data?.favorite_attorneys_data.map(a => (
                <Attorney 
                  key={`att-${a.id}`} 
                  data={a}
                  languages={languages}
                  specialties={specialties}
                  onClick={() => setCenteredAttorney(a)} 
                  favoriteIds={data?.favorite_attorneys || []}
                  toggleFavorite={value => handleToggleFavorite(a.id, value)}
                  toggleCompare={() => handleToggleCompare(a.id)}
                  isComparing={compares.indexOf(a.id) !== -1}
                  onCall={() => {
                    setCurrentAttorney(a);
                    callStartModal.setOpen(true)
                  }}
                  onChat={() => handleChat(a.id)}
                />
              ))}
              {compares.length>1 && compares.length<8 && (
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
                data={data?.favorite_attorneys_data || []} 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="find-search-result-page">
          <Heading>
            You don't have favorited attorney profiles
          </Heading>
        </div>
      )}
      {compareAttorneys?.open && !!data?.favorite_attorneys_data?.length && compares.length > 1 && (
        <CompareAttorneysModal 
          {...compareAttorneys} 
          removeFromCompare={handleToggleCompare}
          attorneys={data?.favorite_attorneys_data.filter(item => compares.indexOf(item.id) !== -1)}
          favoriteIds={data?.favorite_attorneys || []}
          toggleFavorite={(id, value) => handleToggleFavorite(id, value)}
          onCall={id => {
            setCurrentAttorney(data?.favorite_attorneys_data.filter(item => item.id === id))
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
  );
};

const Heading = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: -0.01em;
  box-shadow: inset 0px -1px 0px #e7e7ed;
  padding-bottom: 20px;
  padding-left: 40px;
`;
