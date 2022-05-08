import React from "react"
import { View, Text } from "react-native"
import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useUser } from "../../../query"

export const GuessDistribution: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const countOccurances = data?.guessDistribution
  const maxOccurance = countOccurances?.reduce(
    (acc, curr) => Math.max(acc, curr.occurance),
    0
  )
  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      {countOccurances?.map(({ count, occurance }) => (
        <OccuranceBar
          key={count}
          occurance={occurance}
          count={count}
          maxOccurance={maxOccurance || 1}
        />
      ))}
    </View>
  )
}

type TOccuranceBarProps = {
  count: number
  occurance: number
  maxOccurance: number
}

export const OccuranceBar: React.FC<TOccuranceBarProps> = ({
  count,
  occurance,
  maxOccurance,
}) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 4 }}>
      <Text style={{ width: 12 }}>{count}</Text>
      <View
        style={{
          backgroundColor: occurance ? theme.light.green : theme.light.grey,
          height: "100%",
          flex: occurance / maxOccurance,
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            color: theme.light.background,
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          {occurance}
        </Text>
      </View>
    </View>
  )
}
