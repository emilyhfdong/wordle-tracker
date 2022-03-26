import React, { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import * as Device from "expo-device"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { userActions } from "../redux/slices/user.slice"
import { todaysWordActions } from "../redux/slices/todays-word"
import { feedActions, IFriends } from "../redux/slices/feed.slice"
import { theme } from "../constants/theme"
import { ActivityIndicator, View } from "react-native"
import { useFeedRequest } from "./initializer.hooks"

export const Initializer: React.FC = ({ children }) => {
  const userId = useAppSelector((state) => state.user.id)

  const currentWordNumber = useAppSelector((state) => state.todaysWord.number)
  const dispatch = useAppDispatch()
  const [wordIsSet, setWordIsSet] = useState(false)

  useEffect(() => {
    const getAndSetTodaysWord = async () => {
      const today = await BackendService.getTodaysWord()
      if (today.number !== currentWordNumber) {
        dispatch(
          todaysWordActions.setNewWord({
            word: today.word,
            number: today.number,
            date: today.date,
          })
        )
      }
      setWordIsSet(true)
    }
    getAndSetTodaysWord()
  }, [])

  useEffect(() => {
    const createAndSetUser = async () => {
      const user = await BackendService.createUser(
        Device.deviceName || "Anonymous"
      )
      dispatch(userActions.setUser({ id: user.id, name: user.name }))
    }
    if (!userId) {
      createAndSetUser()
    }
  }, [])
  const { friends, groupedEntries } = useFeedRequest()

  return userId && wordIsSet && friends && groupedEntries ? (
    <>{children}</>
  ) : (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  )
}
