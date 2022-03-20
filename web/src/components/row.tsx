import React, { useContext, useEffect } from "react"
import { Flex } from "rebass"
import { motion, useAnimation } from "framer-motion"
import { WordContext } from "../context/word-context"
import { Tile } from "./tile"

export const SHAKE_DURATION_IN_S = 0.6

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
  const word = useContext(WordContext)

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
            hasWon={letters === word}
          />
        ))}
      </Flex>
    </motion.div>
  )
}
