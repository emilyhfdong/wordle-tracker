import React from "react"
import { Flex } from "rebass"
import { theme } from "../theme"

interface IModalProps {
  isOpen: boolean
}

export const Modal: React.FC<IModalProps> = ({ isOpen }) => {
  return isOpen ? (
    <Flex
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10,
        bg: `${theme.colors.white}50`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex
        sx={{
          width: "90%",
          backgroundColor: theme.colors.white,
          boxShadow: "0 4px 23px 0 rgb(0 0 0 / 20%)",
          padding: 16,
          borderRadius: "8px",
        }}
      >
        BLAHBLAH
      </Flex>
    </Flex>
  ) : null
}
