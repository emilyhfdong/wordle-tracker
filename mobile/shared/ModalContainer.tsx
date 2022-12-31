import { useNavigation } from "@react-navigation/native"
import React, { PropsWithChildren } from "react"
import { TouchableOpacity, View } from "react-native"
import { theme } from "../constants"
import CloseIcon from "../assets/images/close-icon.svg"

type ModalContainerProps = {}

export const ModalContainer: React.FC<
  PropsWithChildren<ModalContainerProps>
> = ({ children }) => {
  const { goBack } = useNavigation()
  return (
    <View
      style={{
        backgroundColor: theme.light.background,
        flex: 1,
        paddingBottom: 40,
        position: "relative",
        paddingTop: 30,
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
        onPress={() => goBack()}
      >
        <CloseIcon fill={theme.light.grey} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  )
}
