import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from "react-redux"
import { Initializer } from "./components/initializer"

import useCachedResources from "./hooks/useCachedResources"
import Navigation from "./navigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { ErrorBoundary } from "./components/error-boundary"
import React from "react"
import { QueryClientProvider } from "react-query"
import { queryClient } from "./query/client"

export default function App() {
  const isLoadingComplete = useCachedResources()
  persistor.purge()
  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <Initializer>
                <SafeAreaProvider>
                  <Navigation />
                  <StatusBar />
                </SafeAreaProvider>
              </Initializer>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    )
  }
}
