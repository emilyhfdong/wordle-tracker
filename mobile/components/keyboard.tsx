import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { theme } from "../constants/theme"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "./tile"
import Backspace from "../assets/images/backspace.svg"
import { useAppSelector } from "../redux/hooks"

interface IKeyboardProps {
  prevGuesses: string[]
  onKeyPress: (key: string) => void
}

type TKeyboardColorMap = { [key: string]: string }

const getColorMapForGuess = (
  guess: string,
  word: string,
  prevMap: TKeyboardColorMap
) => {
  return guess.split("").reduce((acc, letter, idx) => {
    if (word[idx] === letter) {
      acc[letter] = theme.light.green
    } else if (acc[letter] !== theme.light.green && word.includes(letter)) {
      acc[letter] = theme.light.yellow
    } else {
      acc[letter] = acc[letter] || theme.light.grey
    }
    return acc
  }, prevMap)
}

export const ENTER_KEY = "Enter"
export const BACKSPACE = "Backspace"

const KEYBOARD_KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  [ENTER_KEY, "Z", "X", "C", "V", "B", "N", "M", BACKSPACE],
]

export const Keyboard: React.FC<IKeyboardProps> = ({
  prevGuesses,
  onKeyPress,
}) => {
  const [keyboardColorMap, setKeyboardColorMap] = useState<TKeyboardColorMap>(
    {}
  )
  const word = useAppSelector((state) => state.todaysWord.word)

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
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        paddingHorizontal: 8,
      }}
    >
      {KEYBOARD_KEYS.map((row, rowIdx) => (
        <View
          key={rowIdx}
          style={{ width: "100%", marginBottom: 8, flexDirection: "row" }}
        >
          {rowIdx === 1 && <View style={{ height: 58, flex: 0.5 }} />}
          {row.map((key, keyIdx) => (
            <TouchableOpacity
              activeOpacity={0.2}
              key={keyIdx}
              style={{
                height: 58,
                backgroundColor: keyboardColorMap[key] || theme.light.lightGrey,
                flex: key.length === 1 ? 1 : 1.5,
                marginLeft: keyIdx === 0 ? 0 : 6,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
              onPress={() => onKeyPress(key)}
            >
              {key === BACKSPACE ? (
                <Backspace />
              ) : (
                <Text
                  style={{
                    fontWeight: "bold",
                    color: keyboardColorMap[key]
                      ? theme.light.background
                      : theme.light.default,
                    fontSize: 13,
                  }}
                >
                  {key}
                </Text>
              )}
            </TouchableOpacity>
          ))}
          {rowIdx === 1 && <View style={{ height: 58, flex: 0.5 }} />}
        </View>
      ))}
    </View>
  )
}
