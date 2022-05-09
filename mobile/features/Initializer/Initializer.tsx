import React, { useEffect } from "react"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"

import { BackendService } from "../../services"
import { QueryKeys, useTodaysWord, queryClient } from "../../query"
import {
  userActions,
  todaysWordActions,
  useAppDispatch,
  useAppSelector,
} from "../../redux"
import { FullScreenLoading } from "../../shared"
import { Signup } from "./components"
import { AppState, AppStateStatus } from "react-native"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const Initializer: React.FC = ({ children }) => {
  const userId = useAppSelector((state) => state.user.id)
  const currentWordNumber = useAppSelector((state) => state.todaysWord.number)
  const dispatch = useAppDispatch()

  const { data, isLoading, refetch } = useTodaysWord()

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        refetch()
      }
    }
    AppState.addEventListener("change", onAppStateChange)
    return () => AppState.removeEventListener("change", onAppStateChange)
  }, [])

  useEffect(() => {
    if (data) {
      if (data.number !== currentWordNumber) {
        dispatch(
          todaysWordActions.setNewWord({
            word: data.word,
            number: data.number,
            date: data.date,
          })
        )
      }
    }
  }, [data])

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

  useEffect(() => {
    if (userId) {
      queryClient.prefetchQuery(QueryKeys.FEED, () =>
        BackendService.getFeed(userId)
      )
      queryClient.prefetchQuery(QueryKeys.FRIENDS, () =>
        BackendService.getFriends(userId)
      )
    }
  }, [userId])

  if (!userId) {
    return <Signup />
  }

  return isLoading ? <FullScreenLoading /> : <>{children}</>
}
