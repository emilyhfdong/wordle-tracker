import React, { useState } from "react"
import { View, Text, TouchableWithoutFeedback } from "react-native"

import { theme } from "../../constants"
import { useAppSelector } from "../../redux"
import { queryClient, QueryKeys, useAddFriend } from "../../query"
import {
  Title,
  ENTER_KEY,
  BACKSPACE,
  FullScreenLoading,
  Tile,
  KeyboardModal,
} from "../../shared"
import { useNavigation } from "@react-navigation/native"

export const AddFriend: React.FC = () => {
  const id = useAppSelector((state) => state.user.id)
  const [friendCode, setFriendCode] = useState("")
  const { goBack, navigate } = useNavigation()

  const { mutate, isLoading, error } = useAddFriend({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.FRIENDS)
      queryClient.invalidateQueries(QueryKeys.FEED)
      goBack()
    },
  })

  const handleKeyboardPress = async (key: string) => {
    if (key === ENTER_KEY) {
      if (friendCode.length === 5) {
        mutate({ userId: id, friendId: friendCode })
      }
      return
    }

    if (key === BACKSPACE) {
      if (friendCode.length) {
        setFriendCode(friendCode.slice(0, -1))
      }
      return
    }
    if (friendCode.length < 5) {
      setFriendCode(friendCode + key)
    }
  }

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <KeyboardModal onKeyPress={handleKeyboardPress} note="06/28/2022">
      <Title text="Share your code with your friends:" />
      <TouchableWithoutFeedback onLongPress={() => navigate("ResetUser")}>
        <View style={{ flexDirection: "row" }}>
          {id.split("").map((letter, idx) => (
            <Tile
              lockedColor={theme.light.green}
              key={idx}
              hasWon={false}
              index={idx}
              locked
              letter={letter}
            />
          ))}
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: "row",
          height: 50,
          width: "70%",
          marginVertical: 40,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 25,
            borderBottomColor: theme.light.lightGrey,
            borderBottomWidth: 1,
          }}
        />
        <View style={{ height: "100%", justifyContent: "center" }}>
          <Text
            style={{
              paddingHorizontal: 20,
              fontWeight: "bold",
              color: theme.light.grey,
            }}
          >
            or
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 25,
            borderBottomColor: theme.light.lightGrey,
            borderBottomWidth: 1,
          }}
        />
      </View>
      <Title text="Enter your friend's code:" />
      <View style={{ flexDirection: "row" }}>
        {new Array(5).fill(null).map((_, idx) => (
          <Tile
            key={idx}
            hasWon={false}
            index={idx}
            locked={false}
            letter={friendCode[idx] || null}
          />
        ))}
      </View>
      {error && (
        <Text style={{ marginTop: 30, color: "#e85a5a" }}>
          Something went wrong!
        </Text>
      )}
    </KeyboardModal>
  )
}
