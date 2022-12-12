import { useNavigation } from "@react-navigation/native"
import React, { PropsWithChildren } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import CloseIcon from "../assets/images/close-icon.svg"
import { theme } from "../constants"
import { Keyboard } from "./Keyboard"

type KeyboardModalProps = {
  onKeyPress: (key: string) => void
  note?: string
}

export const KeyboardModal: React.FC<PropsWithChildren<KeyboardModalProps>> = ({
  children,
  onKeyPress,
  note,
}) => {
  const { goBack } = useNavigation()
  return (
    <View
      style={{
        backgroundColor: theme.light.background,
        flex: 1,
        paddingBottom: 40,
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
        onPress={() => goBack()}
      >
        <CloseIcon fill={theme.light.grey} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </View>
      <Keyboard prevGuesses={[]} onKeyPress={onKeyPress} />
      <Text
        style={{
          position: "absolute",
          bottom: 5,
          right: 30,
          fontSize: 10,
          color: theme.light.lightGrey,
        }}
      >
        {note}
      </Text>
    </View>
  )
}
