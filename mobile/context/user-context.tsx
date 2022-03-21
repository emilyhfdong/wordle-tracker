import { createContext, useEffect, useState } from "react"
import { AsyncStorage } from "../services/async-storage"
import { BackendService } from "../services/backend"
import * as Device from "expo-device"

export const UserContext = createContext<string>("")

export const UserContextProvider: React.FC = ({ children }) => {
  const [userId, setUserId] = useState("")
  useEffect(() => {
    const getAndSetUserId = async () => {
      let userId = await AsyncStorage.get("USER_ID")
      if (!userId) {
        const user = await BackendService.createUser(
          Device.deviceName || "Anonymous"
        )
        userId = user.id
        await AsyncStorage.set("USER_ID", userId)
      }
      setUserId(userId)
    }
    getAndSetUserId()
  }, [])
  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>
}
