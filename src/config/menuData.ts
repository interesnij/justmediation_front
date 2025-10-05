import OverviewIco from "assets/icons/nav_dashboard.svg";
import OverviewActiveIco from "assets/icons/nav_dashboard_active.svg";
import MattersIco from "assets/icons/nav_matters.svg";
import MattersActiveIco from "assets/icons/nav_matters_active.svg";
import ClientsIco from "assets/icons/nav_clients.svg";
import ClientsActiveIco from "assets/icons/nav_clients_active.svg";
import BillIco from "assets/icons/nav_bill.svg";
import BillActiveIco from "assets/icons/nav_bill_active.svg";
import ChatIco from "assets/icons/nav_chat.svg";
import ChatActiveIco from "assets/icons/nav_chat_active.svg";
import InvoiceIco from "assets/icons/nav_invoice.svg";
import InvoiceActiveIco from "assets/icons/nav_invoice_active.svg";
import BankIco from "assets/icons/nav_bank.svg";
import BankActiveIco from "assets/icons/nav_bank_active.svg";
import NewsIco from "assets/icons/nav_news.svg";
import NewsActiveIco from "assets/icons/nav_news_active.svg";
import ForumIco from "assets/icons/nav_forum.svg";
import ForumActiveIco from "assets/icons/nav_forum_active.svg";
import IndustryIco from "assets/icons/nav_industry.svg";
import IndustryActiveIco from "assets/icons/nav_industry_active.svg";
import DocumentIco from "assets/icons/nav_document.svg";
import DocumentActiveIco from "assets/icons/nav_document_active.svg";
import SearchIco from "assets/icons/nav_search.svg";
import SearchActiveIco from "assets/icons/nav_search_active.svg";
import BidIco from "assets/icons/nav_bid.svg";
import BidActiveIco from "assets/icons/nav_bid_active.svg";

export const MEDIATOR_MENU = (userType: string, role?: string) =>{
  const dashboardItems = [
    {
      label: "Overview",
      route: `/${userType}/overview`,
      icon: OverviewIco,
      activeIcon: OverviewActiveIco,
    },
    {
      label: "Matters",
      route: `/${userType}/matters`,
      icon: MattersIco,
      activeIcon: MattersActiveIco,
    },
    {
      label: "Leads & Clients",
      route: `/${userType}/leads`,
      icon: ClientsIco,
      activeIcon: ClientsActiveIco,
    },
    {
      label: "Documents",
      route: `/${userType}/documents`,
      icon: DocumentIco,
      activeIcon: DocumentActiveIco,
    },
    {
      label: "Chats",
      route: `/${userType}/chats`,
      icon: ChatIco,
      activeIcon: ChatActiveIco,
    },
    {
      label: "Billing items",
      route: `/${userType}/billing`,
      icon: BillIco,
      activeIcon: BillActiveIco,
    },
    {
      label: "Invoices",
      route: `/${userType}/invoices`,
      icon: InvoiceIco,
      activeIcon: InvoiceActiveIco,
    },
    {
      label: "Bank Accounts",
      route: `/${userType}/bank`,
      icon: BankIco,
      activeIcon: BankActiveIco,
    },
  ]
  if(userType === "mediator" || ( userType === "enterprise" && role === "Mediator")){
    dashboardItems.push( {
      label: "Potential Engagement",
      route: `/${userType}/engagement`,
      icon: BidIco,
      activeIcon: BidActiveIco,
    },)
  }
  return [
  {
    title: "dashboard",
    items: dashboardItems
  },
  {
    title: "Social",
    items: [
      {
        label: "JustMediationHub News",
        route: `/${userType}/news`,
        icon: NewsIco,
        activeIcon: NewsActiveIco,
      },
      {
        label: "Forums",
        route: `/${userType}/forums`,
        icon: ForumIco,
        activeIcon: ForumActiveIco,
      },
      {
        label: "Industry Contacts",
        route: `/${userType}/contacts`,
        icon: IndustryIco,
        activeIcon: IndustryActiveIco,
      },
    ],
  },
];}

export const PARALEGAL_MENU = [
  {
    title: "dashboard",
    items: [
      {
        label: "Overview",
        route: "/paralegal/overview",
        icon: OverviewIco,
        activeIcon: OverviewActiveIco,
      },
      {
        label: "Matters",
        route: "/paralegal/matters",
        icon: MattersIco,
        activeIcon: MattersActiveIco,
      },
      {
        label: "Leads & Clients",
        route: "/paralegal/leads",
        icon: ClientsIco,
        activeIcon: ClientsActiveIco,
      },
      {
        label: "Documents",
        route: "/paralegal/documents",
        icon: DocumentIco,
        activeIcon: DocumentActiveIco,
      },
      {
        label: "Chats",
        route: "/paralegal/chats",
        icon: ChatIco,
        activeIcon: ChatActiveIco,
      },
      {
        label: "Billing items",
        route: "/paralegal/billing",
        icon: BillIco,
        activeIcon: BillActiveIco,
      },
      {
        label: "Invoices",
        route: "/paralegal/invoices",
        icon: InvoiceIco,
        activeIcon: InvoiceActiveIco,
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        label: "JustMediationHub News",
        route: "/paralegal/news",
        icon: NewsIco,
        activeIcon: NewsActiveIco,
      },
      {
        label: "Forums",
        route: "/paralegal/forums/all-posts",
        icon: ForumIco,
        activeIcon: ForumActiveIco,
      },
      {
        label: "Industry Contacts",
        route: "/paralegal/contacts",
        icon: IndustryIco,
        activeIcon: IndustryActiveIco,
      },
    ],
  },
];
export const CLIENT_MENU = [
  {
    title: "",
    items: [
      {
        label: "Dashboard",
        route: "/client/overview",
        icon: OverviewIco,
        activeIcon: OverviewActiveIco,
      },
      {
        label: "Chats",
        route: "/client/chats",
        icon: ChatIco,
        activeIcon: ChatActiveIco,
      },
      {
        label: "Find an Mediator",
        route: "/client/find",
        icon: SearchIco,
        activeIcon: SearchActiveIco,
      },
      {
        label: "Forums",
        route: "/client/forums",
        icon: ForumIco,
        activeIcon: ForumActiveIco,
      },
      {
        label: "JustMediationHub News",
        route: "/client/news",
        icon: NewsIco,
        activeIcon: NewsActiveIco,
      },
    ],
  },
];

export const ACCOUNT_MENU = (userType: string) => [
  {
    label: "Edit profile",
    route: `/${userType}/profile`,
  },
  {
    label: "Settings",
    route: `/${userType}/settings`,
  },
  {
    label: "Terms and policies",
    route: `/${userType}/terms`,
  },
  {
    label: "Help and support",
    route: `/${userType}/help`,
  },
  {
    label: "My vault",
    route: `/${userType}/vault`,
  },
];

export const HEADER_CREATE_NEW_MENU = [
  {
    label: "Time entry",
    action: "timeEntry",
  },
  {
    label: "Expense entry",
    action: "expenseEntry",
  },
  {
    label: "Matter",
    action: "matter",
  },
  {
    label: "Contact",
    action: "contact",
  },
  {
    label: "Document",
    action: "document",
  },
  {
    label: "Template",
    action: "template",
  },
  {
    label: "Message",
    action: "message",
  },
  {
    label: "Note",
    action: "note",
  },
];

export const PARALEGAL_HEADER_CREATE_NEW_MENU = [
  {
    label: "Time entry",
    action: "timeEntry",
  },
  {
    label: "Expense entry",
    action: "expenseEntry",
  },
  {
    label: "Document",
    action: "document",
  },
  {
    label: "Template",
    action: "template",
  },
  {
    label: "Message",
    action: "message",
  },
  {
    label: "Note",
    action: "note",
  },
];

export const SIGNUP_ACCOUNT_DATA = [
  {
    label: "I am a",
    name: "Client",
    features: [
      "Ask your legal questions on the JustMediationHub forum",
      "Get connected directly to qualified Mediators that fit your needs",
      "Targeted mediator searching yields precise results",
      "1-on-1 messaging with your mediator",
    ],
    id: "client",
  },
  {
    label: "I am an",
    name: "Mediator",
    features: [
      "Powerful and user-friendly tools for lead generation, lead management and conversion",
      "Open forum where legal professionals answer people’s questions about the law",
      "Constant, secure mediator/client communication on open matters",
    ],
    id: "mediator",
  },
  {
    label: "",
    name: "Law Firm",
    features: [
      "Team collaboration",
      "Selling point placeholder1",
      "Selling point placeholder2",
    ],
    id: "enterprise",
  },
];
