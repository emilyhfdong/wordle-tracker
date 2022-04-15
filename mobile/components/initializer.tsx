import React, { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { todaysWordActions } from "../redux/slices/todays-word"
import { Signup } from "../screens/signup"
import { FullScreenLoading } from "./full-screen-loading"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { QueryKeys, useTodaysWord } from "../query/hooks"
import { queryClient } from "../query/client"

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

  const { data, isLoading } = useTodaysWord()

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
