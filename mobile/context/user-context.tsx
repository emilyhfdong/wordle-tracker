import { v4 as uuid } from "uuid"
import { createContext, useEffect, useState } from "react"
import { AsyncStorage } from "../services/async-storage"

export const UserContext = createContext<string>("")

export const UserContextProvider: React.FC = ({ children }) => {
  const [userId, setUserId] = useState("")
  useEffect(() => {
    const getAndSetUserId = async () => {
      let userId = await AsyncStorage.get("USER_ID")
      if (!userId) {
        userId = uuid()
        await AsyncStorage.set("USER_ID", userId)
      }
      setUserId(userId)
    }
    getAndSetUserId()
  }, [])
  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>
}
