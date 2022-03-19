import React, { useEffect, useState } from "react"
import { Flex, Text } from "rebass"
import { theme } from "./theme"
import { motion, useAnimation } from "framer-motion"
const answer = "ALLOW"

export const App: React.FC = () => {
  const [currentGuess, setCurrentGuess] = useState("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>([])
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      const key = e.key
      if (key === "Enter" && currentGuess.length === 5) {
        if (currentGuess === "RRRRR") {
          setIsNotWord(true)
          setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
          return
        }
        if (answer === currentGuess) {
          setTimeout(
            () => setWinToastIsVisible(true),
            FLIP_DURATION_IN_S * 6 * 1000
          )
        }
        setCurrentGuess("")
        setPrevGuesses([...prevGuesses, currentGuess])

        return
      }

      if (key === "Backspace" && currentGuess.length <= 5) {
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
  }, [currentGuess, prevGuesses])

  return (
    <Flex
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
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
      <Flex sx={{ height: 200 }}>keyboard</Flex>
    </Flex>
  )
}

interface IToastProps {
  isVisible: boolean
}

export const Toast: React.FC<IToastProps> = ({ children, isVisible }) => {
  return (
    <Text
      sx={{
        position: "absolute",
        backgroundColor: theme.colors.black,
        color: theme.colors.white,
        zIndex: 1,
        top: -10,
        padding: 15,
        borderRadius: "5px",
        fontWeight: "bold",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s",
      }}
    >
      {children}
    </Text>
  )
}

const SHAKE_DURATION_IN_S = 0.6

interface IRowProps {
  letters?: string
  locked: boolean
  isNotWord: boolean
}

export const Row: React.FC<IRowProps> = ({
  letters = "",
  locked,
  isNotWord,
}) => {
  const tileLetters = new Array(5)
    .fill(null)
    .map((_, idx) => letters[idx] || null)
  const controls = useAnimation()

  useEffect(() => {
    if (isNotWord) {
      controls.start({
        transform: [
          "translateX(-1px)",
          "translateX(2px)",
          "translateX(-4px)",
          "translateX(4px)",
          "translateX(-4px)",
          "translateX(4px)",
          "translateX(-4px)",
          "translateX(2px)",
          "translateX(-1px)",
          "translateX(0px)",
        ],
        transition: {
          times: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          duration: SHAKE_DURATION_IN_S,
        },
      })
    }
  }, [isNotWord, controls])

  return (
    <motion.div animate={controls}>
      <Flex sx={{ columnGap: "5px" }}>
        {tileLetters.map((letter, idx) => (
          <Tile
            locked={locked}
            letter={letter}
            key={idx}
            index={idx}
            hasWon={letters === answer}
          />
        ))}
      </Flex>
    </motion.div>
  )
}

interface ITileProps {
  letter: string | null
  locked: boolean
  index: number
  hasWon: boolean
}

interface IGetLockedColorArgs {
  letter: string | null
  answer: string
  index: number
}

const getLockedColor = ({ letter, answer, index }: IGetLockedColorArgs) => {
  if (answer[index] === letter) return theme.colors.green
  if (letter && answer.includes(letter)) return theme.colors.yellow
  return theme.colors.grey
}

const FLIP_DURATION_IN_S = 0.25

export const Tile: React.FC<ITileProps> = ({
  letter,
  locked,
  index,
  hasWon,
}) => {
  const lockedColor = getLockedColor({
    answer,
    index,
    letter,
  })
  const controls = useAnimation()

  useEffect(() => {
    const animateFlip = async () => {
      controls.set({ transform: "rotateX(0deg)" })
      await controls.start({
        transform: "rotateX(-90deg)",
        transition: {
          duration: FLIP_DURATION_IN_S,
          easings: ["easeIn"],
        },
      })
      controls.set({
        transform: "rotateX(-90deg)",
        backgroundColor: lockedColor,
        color: theme.colors.white,
        borderColor: lockedColor,
      })
      await controls.start({
        transform: "rotateX(0deg)",
        transition: {
          duration: FLIP_DURATION_IN_S,
          easings: ["easeIn"],
        },
      })
    }
    const animateWin = async () => {
      controls.start({
        transform: [
          "translateY(0)",
          "translateY(-30px)",
          "translateY(5px)",
          "translateY(-15px)",
          "translateY(2px)",
          "translateY(0)",
        ],
        transition: { times: [0.2, 0.4, 0.5, 0.6, 0.8, 1], duration: 1 },
      })
    }
    if (locked) {
      setTimeout(animateFlip, FLIP_DURATION_IN_S * index * 1000)
      setTimeout(() => {
        if (hasWon) {
          animateWin()
        }
      }, FLIP_DURATION_IN_S * 6 * 1000 + index * 100)
    }
  }, [locked, controls, lockedColor, index, hasWon])

  useEffect(() => {
    if (letter && !locked) {
      controls.set({ transform: "scale(0.8)", opacity: 0 })
      controls.start({
        transform: ["scale(1.1)", "scale(1)"],
        opacity: [1, 1],
        transition: { duration: 0.1, times: [0.4, 1] },
      })
    }
  }, [letter, controls, locked])
  return (
    <motion.div
      animate={controls}
      style={{
        display: "flex",
        border: `2px solid ${theme.colors[letter ? "grey" : "lightGrey"]}`,
        height: 62,
        width: 62,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.white,
        color: theme.colors.black,
        transform: "scale(1)",
      }}
    >
      <Text
        sx={{
          // is this even the right font?
          // fontFamily: theme.fonts.clearSans,
          fontWeight: 700,
          fontSize: "32px",
        }}
      >
        {letter}
      </Text>
    </motion.div>
  )
}
