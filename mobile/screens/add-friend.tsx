import React, { useState } from "react"
import { View, Text } from "react-native"
import { Tile } from "../components/tile"
import { Keyboard, ENTER_KEY, BACKSPACE } from "../components/keyboard"

import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { Title } from "../components/title"

interface IAddFriendProps {}

export const AddFriend: React.FC<IAddFriendProps> = () => {
  const id = useAppSelector((state) => state.user.id)
  const [friendCode, setFriendCode] = useState("")

  const handleKeyboardPress = (key: string) => {
    if (key === ENTER_KEY && friendCode.length === 5) {
      // DO the thing
      return
    }

    if (key === BACKSPACE && friendCode.length <= 5) {
      setFriendCode(friendCode.slice(0, -1))
      return
    }
    if (friendCode.length < 5) {
      setFriendCode(friendCode + key)
    }
  }
  return (
    <View
      style={{
        backgroundColor: theme.light.background,
        flex: 1,
        paddingBottom: 40,
      }}
    >
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
      </View>
      <Keyboard prevGuesses={[]} onKeyPress={handleKeyboardPress} />
    </View>
  )
}
