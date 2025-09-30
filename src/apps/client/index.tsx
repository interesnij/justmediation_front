import React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { useAuth } from "hooks";
import {
  OverviewPage,
  MattersPage,
  InvoicesPage,
  RepresentationPage,
  FavoritesPage,
  SearchResultsPage,
  SearchOverviewPage,
  ProfilePage,
  ChatsPage,
  ContactPage,
  ClientMatterPage,
  ClientSettingsPage,
  InvoiceDetailPage,
} from "./pages";
import { MatterMessageDetailPage } from "./pages/Matter/MessageDetail";
import { ForumsRouter, NewsRouter } from "apps/client/layouts";
import { ChatProvider } from "contexts";
import { VideoChat } from "components";

export const ClientRouter: React.FC<RouteComponentProps> = () => {
  useAuth("client");
  return (
    <div>
      <ChatProvider>
        <VideoChat />
        <Router>
          <OverviewPage path="/" />
          <OverviewPage path="/overview" />
          <MattersPage path="/overview/matters" />
          <InvoicesPage path="/overview/invoices" />
          <InvoiceDetailPage path="/overview/invoice/:id" />
          <ClientMatterPage path="/overview/matter/:id" />
          <ClientMatterPage path="/overview/matter/:id/messages" />
          <ClientMatterPage path="/overview/matter/:id/documents" />
          <ClientMatterPage path="/overview/matter/:id/invoices" />
          <MatterMessageDetailPage path="/overview/matter/:matter/message/:id" />
          <RepresentationPage path="/find" />
          <RepresentationPage path="/find/posts/:id" />
          <ProfilePage path="/find/posts/:post/attorneys/:id" />
          <FavoritesPage path="/find/favorites" />
          <SearchOverviewPage path="/find/search" />
          <SearchResultsPage path="/find/results" />
          <ProfilePage path="/find/attorneys/:id" />
	        <ProfilePage path="/find/paralegals/:id" />
          <SearchResultsPage path="/find/results/:type" />
          <ChatsPage path="/chats" />
          <ChatsPage path="/chats/:id" />
          <ClientSettingsPage path="/settings" />
          <ContactPage path="find/contact/:id" />
          <ForumsRouter path="forums/*" />
          <NewsRouter path="news/*" />
        </Router>
      </ChatProvider>
    </div>
  );
};
