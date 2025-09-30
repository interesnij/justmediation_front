import React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { useAuth } from "hooks";
import { 
  BankPage,
  BillingsPage,
  HomePage,
  MattersPage,
  LeadsPage,
  MatterDetailPage,
  ContactPage,
  LeadDetailPage,
  InvoicesPage,
  ContactsDashboardPage,
  InvoiceDetailPage,
  EngagementInquiriesPage,
  EngagementTopicPage,
  EngagementSubmittedPage,
  EngagementInquiryPostPage,
  EngagementSearchResultsPage,
  ChatsPage,
  EngagementSubmittedPostPage,
} from "../attorney/pages";
import { ForumsRouter, NewsRouter, DocumentsRouter } from "apps/attorney/layouts";
import { MatterMessageDetailPage } from "apps/attorney/pages/Matters/MatterDetail/MessageDetail";
import { ChatProvider } from "contexts";
import { VideoChat } from "components";

export const EnterpriseRouter: React.FC<RouteComponentProps> = () => {
  useAuth("enterprise");
  return (
    <div>
      <ChatProvider>
        <VideoChat />
        <Router>
          <HomePage path="/" />
          <HomePage path="overview" />
          <MattersPage path="matters" />
          <MatterDetailPage path="matters/:id" />
          <MatterMessageDetailPage path="matters/:matter/message/:id" />
          <LeadsPage path="leads" />
          <LeadDetailPage path="leads/:id" />
          <ChatsPage path="chats" />
          <ChatsPage path="chats/:tab" />
          <BankPage path="bank" />
          <ContactsDashboardPage path="contacts/" />
          <ContactPage path="contacts/:id" />
          <BillingsPage path="billing" />
          <InvoicesPage path="invoices" />
          <InvoiceDetailPage path="invoices/:id" />
          <EngagementInquiriesPage path="engagement" />
          <EngagementSubmittedPage path="engagement/submitted" />
          <EngagementSubmittedPostPage path="engagement/submitted_post/:id" />
          <EngagementInquiryPostPage path="engagement/post/:id" />
          <EngagementTopicPage path="engagement/topic/:id" />
          <EngagementSearchResultsPage path="engagement/search" />
          <ForumsRouter path="forums/*" />
          <NewsRouter path="news/*" />
          <DocumentsRouter path="documents/*" />
        </Router>
      </ChatProvider>
    </div>
  );
};
