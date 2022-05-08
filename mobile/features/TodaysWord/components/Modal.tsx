import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { theme } from "../../../constants"
import { RH } from "../../../utils"

type TModalProps = {
  isOpen: boolean
  closeModal: () => void
}

export const Modal: React.FC<TModalProps> = ({
  isOpen,
  closeModal,
  children,
}) => {
  return isOpen ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        position: "absolute",
        top: 0,
        zIndex: 3,
        height: "100%",
        width: "100%",
      }}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={{ flex: 1, width: "100%" }} />
      </TouchableWithoutFeedback>

      <View
        style={{
          width: "90%",
          backgroundColor: theme.light.background,
          shadowColor: theme.light.default,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 23,
          borderRadius: 8,
          alignItems: "center",
          paddingVertical: 40,
          paddingHorizontal: 30,
          minHeight: RH(55),
        }}
      >
        {children}
      </View>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={{ flex: 1, width: "100%" }} />
      </TouchableWithoutFeedback>
    </View>
  ) : null
}
