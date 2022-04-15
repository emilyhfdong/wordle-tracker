import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Tile } from "../components/tile"
import { Keyboard, ENTER_KEY, BACKSPACE } from "../components/keyboard"

import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { Title } from "../components/title"
import CloseIcon from "../assets/images/close-icon.svg"
import { RootStackScreenProps } from "../types"
import { FullScreenLoading } from "../components/full-screen-loading"
import { QueryKeys, useAddFriend } from "../query/hooks"
import { queryClient } from "../query/client"
interface IAddFriendProps {}

export const AddFriend: React.FC<
  IAddFriendProps & RootStackScreenProps<"AddFriend">
> = ({ navigation }) => {
  const id = useAppSelector((state) => state.user.id)
  const [friendCode, setFriendCode] = useState("")

  const { mutate, isLoading, error } = useAddFriend({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.FRIENDS)
      queryClient.invalidateQueries(QueryKeys.FEED)
      navigation.pop()
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
        onPress={() => navigation.pop()}
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
        <Title text="Share your code with your friends:" />
        <View style={{ flexDirection: "row" }}>
          {id.split("").map((letter, idx) => (
            <Tile
              word={id}
              key={idx}
              hasWon={false}
              index={idx}
              locked
              letter={letter}
            />
          ))}
        </View>
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
              word={id}
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
      </View>
      <Keyboard prevGuesses={[]} onKeyPress={handleKeyboardPress} />
      <Text
        style={{
          position: "absolute",
          bottom: 5,
          right: 30,
          fontSize: 10,
          color: theme.light.lightGrey,
        }}
      >
        04/15/2022
      </Text>
    </View>
  )
}
