import React from "react"
import { View, Text } from "react-native"
import { FullScreenLoading } from "../../../shared"
import { useAppSelector } from "../../../redux"
import { QueryKeys, useUser } from "../../../query"
import { Modal } from "./Modal"
import { Statistic } from "./Statistic"
import { GuessDistribution } from "./GuessDistribution"
import { ShareButton } from "./ShareButton"
import { NextWordzle } from "./NextWordzle"
import { getShareMessage } from "../utils"
import { useQuery } from "react-query"
import { BackendService } from "../../../services"

interface ISummaryModalProps {
  isOpen: boolean
  closeModal: () => void
}

export const SummaryModal: React.FC<ISummaryModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useQuery(
    QueryKeys.USER,
    () => BackendService.getUser(userId),
    {
      refetchInterval: (newData) =>
        newData?.lastEntry && newData.lastEntry.word.date !== todaysDate
          ? 500
          : false,
    }
  )
  const lastEntry = data?.lastEntry
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const isLoading = !lastEntry || lastEntry?.word.date !== todaysDate

  const shareMessage = getShareMessage(lastEntry)

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {isLoading ? (
        <FullScreenLoading />
      ) : (
        <>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>STATISTICS</Text>
          <View
            style={{ flexDirection: "row", marginBottom: 25, marginTop: 10 }}
          >
            <Statistic label="Played" value={data?.numberOfDaysPlayed || 0} />
            <Statistic label="Win %" value={data?.winPercent || 0} />
            <Statistic
              label={"Current\nStreak"}
              value={data?.currentStreak || 0}
            />
            <Statistic label={"Max\nStreak"} value={data?.maxStreak || 0} />
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            GUESS DISTRIBUTION
          </Text>
          <GuessDistribution />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: 20,
            }}
          >
            <NextWordzle />
            <ShareButton message={shareMessage} />
          </View>
        </>
      )}
    </Modal>
  )
}
