import React from "react"
import { Text } from "rebass"
import { theme } from "../theme"

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
