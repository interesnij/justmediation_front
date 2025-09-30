declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production"; // cra internal
    readonly PUBLIC_URL: string;
    readonly REACT_APP_ENV: "local" | "dev" | "staging" | "prod";
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_FILES_URL: string;
    readonly REACT_APP_FIREBASE_API_KEY: string;
    readonly REACT_APP_FIREBASE_AUTH_DOMAIN: string;
    readonly REACT_APP_FIREBASE_DATABASE_URL: string;
    readonly REACT_APP_FIREBASE_PROJECT_ID: string;
    readonly REACT_APP_FIREBASE_STORAGE_BUCKET: string;
    readonly REACT_APP_FIREBASE_MESSAGE_SENDER: string;
    readonly REACT_APP_FIREBASE_APP_ID: string;
    readonly REACT_APP_FIREBASE_MEASUREMENT_ID: string;
    readonly REACT_APP_STRIPE_PK: "pk_live_8kHQq7Esqylmfjj1UqQma3yY";
    readonly REACT_APP_DOLBY_KEY: string;
    readonly REACT_APP_DOLBY_SECRET: string;
    readonly REACT_APP_PDFTRON_LICENSE: string;
    readonly REACT_APP_GOOGLE_MAPS: string;
    readonly REACT_APP_SENTRY_DSN: string;
    readonly SENTRY_AUTH_TOKEN: string;
    readonly REACT_APP_SENTRY_RELEASE: string;
  }
}
