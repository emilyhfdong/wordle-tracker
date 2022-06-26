import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { View, Text } from "react-native"
import { useDispatch } from "react-redux"
import { queryClient } from "../../query"
import { todaysWordActions, userActions } from "../../redux"
import { BackendService } from "../../services"
import {
  BACKSPACE,
  ENTER_KEY,
  FullScreenLoading,
  KeyboardModal,
  Tile,
  Title,
} from "../../shared"

export const ResetUser: React.FC = () => {
  const [newId, setNewId] = useState("")
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const handleKeyboardPress = async (key: string) => {
    if (isLoading) {
      return
    }
    if (key === ENTER_KEY) {
      if (newId.length === 5) {
        setIsLoading(true)
        try {
          const response = await BackendService.getUser(newId)
          dispatch(
            userActions.setUser({ id: response.userId, name: response.name })
          )
          dispatch(todaysWordActions.clearGuesses())
          await queryClient.invalidateQueries()
          navigate("Root")
        } catch {
          setNewId("")
          setHasError(true)
        }
        setIsLoading(false)
      }
      return
    }

    if (key === BACKSPACE) {
      if (newId.length) {
        setNewId(newId.slice(0, -1))
      }
      return
    }
    if (newId.length < 5) {
      setNewId(newId + key)
    }
  }
  return (
    <KeyboardModal onKeyPress={handleKeyboardPress}>
      {isLoading ? (
        <FullScreenLoading />
      ) : (
        <>
          <Title text="Enter your old friend code" />
          <View style={{ flexDirection: "row" }}>
            {new Array(5).fill(null).map((_, idx) => (
              <Tile
                key={idx}
                hasWon={false}
                index={idx}
                locked={false}
                letter={newId[idx] || null}
              />
            ))}
          </View>
          {hasError && (
            <Text style={{ marginTop: 30, color: "#e85a5a" }}>
              Something went wrong!
            </Text>
          )}
        </>
      )}
    </KeyboardModal>
  )
}
