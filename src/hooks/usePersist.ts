import React, { useEffect } from "react";

export function usePersistedContext(context: object, key = "state") {
  const persistedContext = localStorage.getItem(key);
  return persistedContext ? JSON.parse(persistedContext) : context;
}

export function usePersistedReducer(
  [state, dispatch]: [object, React.DispatchWithoutAction],
  key = "state"
) {
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [
    state,
    key,
  ]);
  return [state, dispatch];
}
