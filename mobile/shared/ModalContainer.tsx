import { useNavigation } from "@react-navigation/native"
import React, { PropsWithChildren, ReactNode } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { theme } from "../constants"
import CloseIcon from "../assets/images/close-icon.svg"
import { Ionicons } from "@expo/vector-icons"

type ModalContainerProps = {
  onClose?: () => void
  noBack?: boolean
  header?: ReactNode
}

export const ModalContainer: React.FC<
  PropsWithChildren<ModalContainerProps>
> = ({ children, onClose, noBack, header }) => {
  const { goBack } = useNavigation()
  return (
    <View
      style={{
        backgroundColor: theme.light.background,
        flex: 1,
        paddingBottom: 40,
        position: "relative",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
          alignItems: "center",
        }}
      >
        {noBack ? (
          <View />
        ) : (
          <TouchableOpacity onPress={() => goBack()}>
            <Ionicons
              name={"chevron-back"}
              size={25}
              color={theme.light.grey}
            />
          </TouchableOpacity>
        )}
        {header && header}
        <TouchableOpacity onPress={() => (onClose ? onClose() : goBack())}>
          <CloseIcon fill={theme.light.grey} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  )
}
