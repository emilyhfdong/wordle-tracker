import { DateTime } from "luxon"
import React from "react"
import { View, Text, TouchableOpacity, Alert, AlertButton } from "react-native"
import { theme } from "../constants/theme"
import { queryClient } from "../query/client"
import { QueryKeys, usePingFriend } from "../query/hooks"
import { useAppSelector } from "../redux/hooks"
import { TGetFriendsResponse, TPingStatus } from "../services/types"
import { Scores } from "./scores"

interface IFriendListItemProps {
  name: string
  color: string
  lastPlayed: string
  currentStreak: number
  averageAttemptsCount: number
  pingStatus: TPingStatus
  userId: string
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
  userId,
  friendId,
  pingStatus,
  updateFriend,
  hasPlayedToday,
}: {
  name: string
  userId: string
  friendId: string
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

export const FriendListItem: React.FC<IFriendListItemProps> = ({
  averageAttemptsCount,
  color,
  currentStreak,
  lastPlayed,
  name,
  pingStatus,
  userId,
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
    friendId: userId,
    userId: selfUserId,
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
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginVertical: 5,
        borderColor: "#E6E6E6",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: theme.light.background,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold", color }}>{name}</Text>
        <Text
          style={{
            color: theme.light.grey,
            marginTop: 5,
            textAlign: "right",
            fontSize: 10,
            fontStyle: "italic",
          }}
        >
          Last played: {getLastPlayedText(lastPlayed)}
        </Text>
      </View>
      <Scores
        currentStreak={currentStreak}
        lastPlayedDate={DateTime.fromISO(lastPlayed).toISODate()}
        averageAttemptsCount={averageAttemptsCount}
      />
    </TouchableOpacity>
  )
}
