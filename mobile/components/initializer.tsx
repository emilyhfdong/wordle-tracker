import React, { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { todaysWordActions } from "../redux/slices/todays-word"
import { useFeedRequest } from "./initializer.hooks"
import { Signup } from "../screens/signup"
import { FullScreenLoading } from "./full-screen-loading"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"

export const Initializer: React.FC = ({ children }) => {
  const userId = useAppSelector((state) => state.user.id)

  const currentWordNumber = useAppSelector((state) => state.todaysWord.number)
  const dispatch = useAppDispatch()
  const [wordIsSet, setWordIsSet] = useState(false)
  const { friends, groupedEntries } = useFeedRequest()

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
    const registerForNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync()
        if (existingStatus !== "granted") {
          await Notifications.requestPermissionsAsync()
        }
        const { data } = await Notifications.getExpoPushTokenAsync()
        if (data) {
          await BackendService.updateUserWithPushToken(userId, data)
        }
      } else {
        console.log("Must use physical device for Push Notifications")
      }
    }
    if (userId) {
      registerForNotifications()
    }
  }, [userId])

  if (!userId) {
    return <Signup />
  }

  return wordIsSet && friends && groupedEntries ? (
    <>{children}</>
  ) : (
    <FullScreenLoading />
  )
}
