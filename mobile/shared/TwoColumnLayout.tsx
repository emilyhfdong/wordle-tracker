import React, { useMemo } from "react"
import { View } from "react-native"

type TwoColumnLayoutProps<T> = {
  renderItem: (item: T) => React.ReactNode
  data: T[]
}

export const TwoColumnLayout = <T extends object>({
  data,
  renderItem,
}: TwoColumnLayoutProps<T>) => {
  const evenEntries = useMemo(
    () => data.filter((_, idx) => idx % 2 === 0),
    [data]
  )
  const oddEntries = useMemo(
    () => data.filter((_, idx) => idx % 2 === 1),
    [data]
  )

  return (
    <View
      style={{
        paddingTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        width: "100%",
      }}
    >
      <View style={{ maxWidth: "50%" }}>
        {evenEntries.map((dayEntry) => renderItem(dayEntry))}
      </View>
      <View style={{ maxWidth: "50%" }}>
        {oddEntries.map((dayEntry) => renderItem(dayEntry))}
      </View>
    </View>
  )
}
