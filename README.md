## justmediationhub Frontend

App build on [React](https://github.com/facebook/react) library with [CRA](https://github.com/facebook/create-react-app).

### Local setup

- Requires installed [Node js](https://nodejs.org/en/). Used version `14.20.0`
- Copy `.env` file with all necessary secrets to the root of the project (not stored within the repository)
- Install app dependencies:

```
npm install
npm uninstall node-sass
npm install sass
npm install buffer
npm install @babel/plugin-proposal-private-property-in-object
export NODE_OPTIONS=--openssl-legacy-provider
```

- Start application:

```

вносим изменения:
npm start
```

если изменения не видны то:
npm cache clean --force
npm cache verify
killall -9 node
npm start

- App will be available at `http://localhost:3000/`

> Note: local app uses live backend dev server

### Deployment

- Currently app has 3 live environments: `dev`, `staging`, `production`.
- Deployment is done by GitHub Actions and ran automatically by commiting updates to associated branches (`dev`, `staging`, `master`).
- All secrets for deployment located on repository secrets section (Settings > Secrets > Actions).
