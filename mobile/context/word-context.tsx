import { createContext, useEffect, useState } from "react"
import { BackendService } from "../services/backend"

export const WordContext = createContext<string>("")

export const WordContextProvider: React.FC = ({ children }) => {
  const [word, setWord] = useState("")
  useEffect(() => {
    const setAndSetWord = async () => {
      const response = await BackendService.getTodaysWord()
      setWord(response.data.word)
    }
    setAndSetWord()
  }, [])
  return <WordContext.Provider value={word}>{children}</WordContext.Provider>
}
