import React, { useContext, useEffect, useState } from "react"
import { Flex } from "rebass"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "./components/tile"
import { Row, SHAKE_DURATION_IN_S } from "./components/row"
import { Toast } from "./components/toast"
import { WordContext } from "./context/word-context"
import { BACKSPACE, ENTER_KEY, Keyboard } from "./components/keyboard"

export const App: React.FC = () => {
  const [currentGuess, setCurrentGuess] = useState("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>([])
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)

  const word = useContext(WordContext)

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      const key = e.key
      if (key === ENTER_KEY && currentGuess.length === 5) {
        if (currentGuess === "RRRRR") {
          setIsNotWord(true)
          setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
          return
        }
        if (word === currentGuess) {
          setTimeout(
            () => setWinToastIsVisible(true),
            TOTAL_WORD_FLIP_DURATION_IN_S * 1000
          )
        }
        setCurrentGuess("")
        setPrevGuesses([...prevGuesses, currentGuess])
        return
      }

      if (key === BACKSPACE && currentGuess.length <= 5) {
        setCurrentGuess(currentGuess.slice(0, -1))
        return
      }
      if (
        /^[a-zA-Z]+$/.test(key) &&
        key.length === 1 &&
        currentGuess.length < 5
      ) {
        setCurrentGuess(currentGuess + key.toUpperCase())
      }
    }
    window.addEventListener("keydown", keyPressHandler)
    return () => window.removeEventListener("keydown", keyPressHandler)
  }, [currentGuess, prevGuesses, word])

  return word ? (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: ["-webkit-fill-available", "100vh"],
        maxWidth: 500,
        margin: "auto",
        position: "relative",
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            rowGap: "5px",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Toast isVisible={isNotWord}>Not in word list</Toast>
          <Toast isVisible={winToastIsVisible}>Impressive</Toast>

          {new Array(6).fill(0).map((_, idx) => (
            <Row
              key={idx}
              letters={
                idx === prevGuesses.length ? currentGuess : prevGuesses[idx]
              }
              locked={idx < prevGuesses.length}
              isNotWord={isNotWord && idx === prevGuesses.length}
            />
          ))}
        </Flex>
      </Flex>
      <Keyboard prevGuesses={prevGuesses} />
    </Flex>
  ) : null
}
