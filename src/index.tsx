import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//import * as dotenv from "dotenv";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "./theme/app.scss";

if (process.env.REACT_APP_ENV !== 'local') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN ?? "",
    integrations: [new Integrations.BrowserTracing()],
    release: process.env.REACT_APP_SENTRY_RELEASE ?? "empty",
    environment: process.env.REACT_APP_ENV ?? "empty",
    tracesSampleRate: 1.0,
  });
}


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK ?? "");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Elements>,
  document.getElementById("root")
);

serviceWorker.unregister();
//dotenv.config();