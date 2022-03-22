import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from "react-redux"
import { Initializer } from "./components/initializer"
import { WordContextProvider } from "./context/word-context"

import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Initializer>
            <WordContextProvider>
              <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </SafeAreaProvider>
            </WordContextProvider>
          </Initializer>
        </PersistGate>
      </Provider>
    )
  }
}
