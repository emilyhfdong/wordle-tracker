import React, { useEffect, useRef, useState } from "react"
import { Animated, View, TextInput } from "react-native"
import { Tile, TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { Title } from "../components/title"
import { theme } from "../constants/theme"
import { BackendService } from "../services/backend"
import { useDispatch } from "react-redux"
import { userActions } from "../redux/slices/user.slice"
import { FullScreenLoading } from "../components/full-screen-loading"

export const Signup: React.FC = ({ children }) => {
  const [name, setName] = useState("")
  const [currentView, setCurrentView] = useState<"HELLO" | "INPUT">("HELLO")
  const [isLoading, setIsLoading] = useState(false)
  const opacityAnim = useRef(new Animated.Value(1)).current
  const dispatch = useDispatch()
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500,
      delay: TOTAL_WORD_FLIP_DURATION_IN_S * 1000 + 500,
    }).start(() => {
      setCurrentView("INPUT")
      Animated.timing(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
      }).start(() => {
        inputRef.current?.focus()
      })
    })
  }, [])

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 40,
      }}
    >
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          opacity: opacityAnim,
          width: "100%",
        }}
      >
        {currentView === "HELLO" ? (
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {"HELLO".split("").map((letter, index) => (
              <Tile
                key={index}
                word="HELLO"
                locked
                letter={letter}
                index={index}
              />
            ))}
          </View>
        ) : (
          <View style={{ width: "100%", padding: 30 }}>
            <Title text="Whats your name?" />
            <View
              style={{
                borderColor: "#E6E6E6",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: theme.light.background,
                height: 60,
                width: "100%",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                ref={inputRef}
                style={{ fontSize: 18, width: "100%" }}
                value={name}
                onChangeText={setName}
                returnKeyType="go"
                onSubmitEditing={async () => {
                  if (name) {
                    setIsLoading(true)
                    const user = await BackendService.createUser(name)
                    dispatch(userActions.setUser(user))
                    setIsLoading(false)
                  }
                }}
              />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  )
}
