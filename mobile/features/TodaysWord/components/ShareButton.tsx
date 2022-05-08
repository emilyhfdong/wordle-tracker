import React from "react"
import { Text, TouchableOpacity, Share, View } from "react-native"
import ShareIcon from "../../../assets/images/share.svg"
import { theme } from "../../../constants"

type TShareButtonProps = {
  message: string
}

export const ShareButton: React.FC<TShareButtonProps> = ({ message }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme.light.green,
          flexDirection: "row",
          padding: 14,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
        }}
        onPress={() => Share.share({ message })}
      >
        <Text
          style={{
            color: theme.light.background,
            fontWeight: "bold",
            fontSize: 20,
            paddingRight: 5,
          }}
        >
          SHARE
        </Text>
        <ShareIcon />
      </TouchableOpacity>
    </View>
  )
}
