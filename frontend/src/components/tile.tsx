import React, { useContext, useEffect } from "react"
import { Text } from "rebass"
import { theme } from "../theme"
import { motion, useAnimation } from "framer-motion"
import { WordContext } from "../context/word-context"

interface ITileProps {
  letter: string | null
  locked: boolean
  index: number
  hasWon: boolean
}

interface IGetLockedColorArgs {
  letter: string | null
  word: string
  index: number
}

const getLockedColor = ({ letter, word, index }: IGetLockedColorArgs) => {
  if (word[index] === letter) return theme.colors.green
  if (letter && word.includes(letter)) return theme.colors.yellow
  return theme.colors.grey
}

export const FLIP_DURATION_IN_S = 0.25
export const TOTAL_WORD_FLIP_DURATION_IN_S = FLIP_DURATION_IN_S * 6

export const Tile: React.FC<ITileProps> = ({
  letter,
  locked,
  index,
  hasWon,
}) => {
  const word = useContext(WordContext)
  const lockedColor = getLockedColor({
    word,
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
      }, TOTAL_WORD_FLIP_DURATION_IN_S * 1000 + index * 100)
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
