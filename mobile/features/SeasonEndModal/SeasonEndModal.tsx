import React from "react"
import { Text, View } from "react-native"
import { theme } from "../../constants"
import { useSeasons } from "../../query"
import { useAppSelector } from "../../redux"
import { RH, RW } from "../../utils"
import { Modal } from "../TodaysWord/components/Modal"
import { DateTime } from "luxon"
import { SeasonLeaderBoard } from "./components/SeasonLeaderBoard"
import { useDispatch } from "react-redux"
import { seasonsActions } from "../../redux/slices/seasons"

type SeasonEndModalProps = {}

export const SeasonEndModal: React.FC<SeasonEndModalProps> = () => {
  const { data } = useSeasons()
  const dispatch = useDispatch()
  const seenSeasonNames = useAppSelector(
    (state) => state.seasons.seenSeasonNames
  )
  const lastSeason = data?.[0]

  if (!lastSeason) {
    return null
  }
  const isAfterEndOfSeason =
    DateTime.fromISO(lastSeason.endDate)
      .endOf("day")
      .diff(DateTime.now())
      .as("days") < 0

  return isAfterEndOfSeason && !seenSeasonNames.includes(lastSeason.name) ? (
    <Modal
      isOpen
      closeModal={() => dispatch(seasonsActions.addSeasonName(lastSeason.name))}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: RH(2) }}>
        🎉 {lastSeason.name} has ended!! 🎉
      </Text>
      <View style={{ width: "90%" }}>
        <SeasonLeaderBoard season={lastSeason} />
      </View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 12,
          marginTop: RH(2),
          color: theme.light.grey,
        }}
      >
        Next season ends{" "}
        {DateTime.now().plus({ day: 2 }).endOf("quarter").toFormat("MMM dd")}...
      </Text>
    </Modal>
  ) : null
}
