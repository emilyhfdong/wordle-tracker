import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from "react-redux"

import useCachedResources from "./hooks/useCachedResources"
import Navigation from "./navigation/navigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import React, { useEffect } from "react"
import { QueryClientProvider } from "react-query"
import { queryClient } from "./query/client"
import { ErrorBoundary, Initializer } from "./features"
import { Text } from "react-native"
import { SeasonEndModal } from "./features/SeasonEndModal"

export default function App() {
  const isLoadingComplete = useCachedResources()
  useEffect(() => {
    //@ts-expect-error
    Text.defaultProps = Text.defaultProps || {}
    //@ts-expect-error
    Text.defaultProps.allowFontScaling = false
  }, [])

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
                  <SeasonEndModal />
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
