import { Ionicons } from "@expo/vector-icons"
import { DateTime } from "luxon"
import React from "react"
import { Alert, AlertButton, TouchableOpacity, View } from "react-native"
import { theme } from "../../../constants"
import { QueryKeys, usePingFriend, queryClient } from "../../../query"
import { useAppSelector } from "../../../redux"
import { TGetFriendsResponse, TPingStatus } from "../../../services"
import { ListItem, Scores } from "../../../shared"

interface IFriendListItemProps {
  name: string
  color: string
  lastPlayed: string
  currentStreak: number
  averageAttemptsCount: number
  pingStatus: TPingStatus
  userId: string
  isSelected: boolean
  onCheckboxPress: () => void
}

export const FriendListItem: React.FC<IFriendListItemProps> = ({
  averageAttemptsCount,
  color,
  currentStreak,
  lastPlayed,
  name,
  pingStatus,
  userId,
  isSelected,
  onCheckboxPress,
}) => {
  const selfUserId = useAppSelector((state) => state.user.id)
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const hasPlayedToday =
    DateTime.fromISO(lastPlayed, {
      zone: "America/Toronto",
    }).toISODate() === todaysDate

  const { mutate } = usePingFriend({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.FRIENDS)
    },
    onMutate: () => {
      queryClient.setQueryData(
        QueryKeys.FRIENDS,
        (prev: TGetFriendsResponse | undefined) =>
          prev
            ? {
                ...prev,
                [userId]: {
                  ...prev[userId],
                  pingStatus: "already_pinged" as const,
                },
              }
            : {}
      )
    },
  })

  const alertArgs = getAlertArgs({
    hasPlayedToday,
    name,
    pingStatus,
    updateFriend: () => {
      mutate({ userId: selfUserId, friendId: userId })
    },
  })

  const onPress = () => {
    Alert.alert(alertArgs.title, alertArgs.message, alertArgs.buttons)
  }
  return (
    <ListItem
      onPress={onPress}
      titleColor={color}
      title={name}
      subtitle={`Last played: ${getLastPlayedText(lastPlayed)}`}
      rightComponent={
        <View style={{ flexDirection: "row" }}>
          <Scores
            currentStreak={currentStreak}
            lastPlayedDate={DateTime.fromISO(lastPlayed).toISODate()}
            averageAttemptsCount={averageAttemptsCount}
          />
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: "center",
            }}
            onPress={onCheckboxPress}
          >
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={20}
              color={theme.light.grey}
            />
          </TouchableOpacity>
        </View>
      }
    ></ListItem>
  )
}

const getLastPlayedText = (lastPlayedDate: string) => {
  if (!lastPlayedDate) {
    return "Never"
  }
  const lastPlayed = DateTime.fromISO(lastPlayedDate)
  if (Math.abs(lastPlayed.diffNow("hour").hours) > 24) {
    return lastPlayed.toFormat("EEE, MMM d t")
  }
  return lastPlayed.toRelative()
}

const getAlertArgs = ({
  name,
  pingStatus,
  updateFriend,
  hasPlayedToday,
}: {
  name: string
  pingStatus: TPingStatus
  updateFriend: () => void
  hasPlayedToday: boolean
}) => {
  if (hasPlayedToday) {
    return {
      title: `${name} has already played today!`,
      message: "You can only ping them to play if they have not already",
      buttons: [{ text: "OK", onPress: () => null }],
    }
  }
  const pingStatusToAlertArgs: {
    [key in TPingStatus]: {
      title: string
      message: string
      buttons: AlertButton[]
    }
  } = {
    already_pinged: {
      title: `You've already pinged ${name} today!`,
      message: "You can only ping once a day",
      buttons: [{ text: "OK", onPress: () => null }],
    },
    notifications_disabled: {
      title: `${name} does not have notifications enabled :(`,
      message: "Tell them to enable notifications to ping them to play",
      buttons: [{ text: "OK", onPress: () => null }],
    },
    ready: {
      title: `Ping ${name} to play?`,
      message: "",
      buttons: [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            updateFriend()
          },
        },
      ],
    },
  }
  return pingStatusToAlertArgs[pingStatus]
}
