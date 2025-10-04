import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import styled from "styled-components";
import { Mediator } from "./components";
import { RiseLoader, Button } from "components";
import { MediatorFindLayout } from "apps/client/layouts";
import { useQuery } from "react-query";
import { getFavoriteMediators, createChat, toggleFavoriteMediator } from "api"; 
import { useChatContext, useAuthContext, useBasicDataContext } from "contexts";
import { CompareMediatorsModal, CallStartModal } from "modals";
import { useModal } from "hooks";
import MapComponent from "./components/MapComponent";

export const FavoritesPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { specialties, languages } = useBasicDataContext();
  const [centeredMediator, setCenteredMediator] = useState(null);
  const [compares, setCompares] = useState<number[]>([]);
  const { onStartCall } = useChatContext();
  const { userId, profile } = useAuthContext();
  const compareMediators = useModal();
  const [loading, setLoading] = useState(false);
  const callStartModal = useModal();
  const [currentMediator, setCurrentMediator] = useState<any>(null);
  
  const { isFetching, data, refetch: refetchFavorites } = useQuery(
    ["favorite-mediators"], 
    () => getFavoriteMediators(), 
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!data?.favorite_mediators_data?.length) return;
    setCenteredMediator(data.favorite_mediators_data[0]);
  }, [data?.favorite_mediators_data?.length])

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
    await toggleFavoriteMediator(id, value)
    refetchFavorites()
    setLoading(false)
  }

  return (
    <MediatorFindLayout tab="Favorites" className="no-background">
      {isFetching || loading ? (
        <div className="spinner-wrap">
          <RiseLoader />
        </div>
      ) : data?.favorite_mediators_data?.length ? (
        <div className="find-search-result-page">
          <Heading>
            You have {data?.favorite_mediators?.length} favorited mediator profiles
          </Heading>
          <div className="d-flex" style={{maxHeight: 'calc(100vh - 197px)'}}>
            <div className="mediator-section">
              {data?.favorite_mediators_data.map(a => (
                <Mediator 
                  key={`att-${a.id}`} 
                  data={a}
                  languages={languages}
                  specialties={specialties}
                  onClick={() => setCenteredMediator(a)} 
                  favoriteIds={data?.favorite_mediators || []}
                  toggleFavorite={value => handleToggleFavorite(a.id, value)}
                  toggleCompare={() => handleToggleCompare(a.id)}
                  isComparing={compares.indexOf(a.id) !== -1}
                  onCall={() => {
                    setCurrentMediator(a);
                    callStartModal.setOpen(true)
                  }}
                  onChat={() => handleChat(a.id)}
                />
              ))}
              {compares.length>1 && compares.length<8 && (
                <div className="compare-btn-wrap">
                  <Button onClick={() => compareMediators.setOpen(true)}>
                    Compare ({compares.length}) selected mediators
                  </Button>
                </div>
              )}
            </div>
            <div className="map-section">
              <MapComponent 
                mediator={centeredMediator}
                data={data?.favorite_mediators_data || []} 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="find-search-result-page">
          <Heading>
            You don't have favorited mediator profiles
          </Heading>
        </div>
      )}
      {compareMediators?.open && !!data?.favorite_mediators_data?.length && compares.length > 1 && (
        <CompareMediatorsModal 
          {...compareMediators} 
          removeFromCompare={handleToggleCompare}
          mediators={data?.favorite_mediators_data.filter(item => compares.indexOf(item.id) !== -1)}
          favoriteIds={data?.favorite_mediators || []}
          toggleFavorite={(id, value) => handleToggleFavorite(id, value)}
          onCall={id => {
            setCurrentMediator(data?.favorite_mediators_data.filter(item => item.id === id))
            callStartModal.setOpen(true)
          }}
          onChat={handleChat}
        />
      )}
      <CallStartModal 
        {...callStartModal} 
        onConfirm={() => onStartCall({ participants: [+userId, currentMediator?.id] })} 
        participants={[currentMediator]} 
        userId={profile?.id} 
      />
    </MediatorFindLayout>
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
