import { createContext } from "react"

export const WordContext = createContext<string>("")

export const WordContextProvider: React.FC = ({ children }) => {
  // const [word, setWord] = useState("")
  return <WordContext.Provider value={"ALLOW"}>{children}</WordContext.Provider>
}
