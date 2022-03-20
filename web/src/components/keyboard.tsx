import React, { useContext, useEffect, useState } from "react"
import { Flex, Text, Image } from "rebass"
import { WordContext } from "../context/word-context"
import { theme } from "../theme"
import backspaceImg from "../images/backspace.svg"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "./tile"

interface IKeyboardProps {
  prevGuesses: string[]
}

type TKeyboardColorMap = { [key: string]: string }

const getColorMapForGuess = (
  guess: string,
  word: string,
  prevMap: TKeyboardColorMap
) => {
  return guess.split("").reduce((acc, letter, idx) => {
    if (word[idx] === letter) {
      acc[letter] = theme.colors.green
    } else if (acc[letter] !== theme.colors.green && word.includes(letter)) {
      acc[letter] = theme.colors.yellow
    } else {
      acc[letter] = acc[letter] || theme.colors.grey
    }
    return acc
  }, prevMap)
}

export const ENTER_KEY = "Enter"
export const BACKSPACE = "Backspace"

const KEYBOARD_KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER_KEY, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
]

export const Keyboard: React.FC<IKeyboardProps> = ({ prevGuesses }) => {
  const [keyboardColorMap, setKeyboardColorMap] = useState<TKeyboardColorMap>(
    {}
  )
  const word = useContext(WordContext)

  useEffect(() => {
    setTimeout(() => {
      const newMap = prevGuesses.reduce(
        (acc, guess) => getColorMapForGuess(guess, word, acc),
        {} as TKeyboardColorMap
      )
      setKeyboardColorMap(newMap)
    }, TOTAL_WORD_FLIP_DURATION_IN_S * 1000)
  }, [prevGuesses, word])

  return (
    <Flex sx={{ flexDirection: "column", width: "100%", paddingX: "8px" }}>
      {KEYBOARD_KEYS.map((row, rowIdx) => (
        <Flex key={rowIdx} sx={{ width: "100%", marginBottom: "8px" }}>
          {rowIdx === 1 && <Flex sx={{ height: 58, flex: 0.5 }} />}
          {row.map((key, keyIdx) => (
            <Flex
              key={keyIdx}
              sx={{
                height: 58,
                backgroundColor:
                  keyboardColorMap[key] || theme.colors.lightGrey,
                color: keyboardColorMap[key]
                  ? theme.colors.white
                  : theme.colors.black,
                flex: key.length === 1 ? 1 : 1.5,
                marginLeft: keyIdx === 0 ? 0 : "6px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: ["12px", "14px"],
              }}
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent("keydown", { key }))
              }
            >
              {key === BACKSPACE ? (
                <Image src={backspaceImg} />
              ) : (
                <Text sx={{ fontWeight: "bold" }}>{key.toUpperCase()}</Text>
              )}
            </Flex>
          ))}
          {rowIdx === 1 && <Flex sx={{ height: 58, flex: 0.5 }} />}
        </Flex>
      ))}
    </Flex>
  )
}
