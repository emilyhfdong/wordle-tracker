import { useNavigation, useNavigationState } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { theme } from "../../constants"

type WrappedHeaderProps = {
  color: string
}

export const WrappedHeader: React.FC<WrappedHeaderProps> = ({ color }) => {
  const {} = useNavigation()
  const totalNumberOfRoutes = useNavigationState(
    (state) => state.routeNames.length
  )
  const currentRouteNumber = useNavigationState((state) => state.routes.length)
  return (
    <View
      style={{
        height: 5,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {new Array(totalNumberOfRoutes).fill(0).map((_, idx) => (
        <View
          style={{
            height: 5,
            width: 5,
            borderRadius: 2.5,
            marginHorizontal: 5,
            backgroundColor:
              idx + 1 === currentRouteNumber ? color : theme.light.lightGrey,
          }}
        />
      ))}
    </View>
  )
}
