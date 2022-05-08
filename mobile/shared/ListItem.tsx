import React, { ReactElement } from "react"
import { View, Text, TouchableOpacity, ViewStyle } from "react-native"
import { theme } from "../constants"

type TListItemProps = {
  onPress?: () => void
  style?: ViewStyle
  title: string
  titleColor?: string
  subtitle: string
  rightComponent?: ReactElement
}

export const ListItem: React.FC<TListItemProps> = ({
  onPress,
  subtitle,
  title,
  style,
  titleColor,
  children,
  rightComponent,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{
        marginVertical: 5,
        borderColor: "#E6E6E6",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: theme.light.background,
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: "bold",
              color: titleColor || theme.light.default,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: theme.light.grey,
              marginTop: 5,
              textAlign: "left",
              fontSize: 10,
              fontStyle: "italic",
            }}
          >
            {subtitle}{" "}
          </Text>
        </View>
        {rightComponent}
      </View>
      {children}
    </TouchableOpacity>
  )
}
