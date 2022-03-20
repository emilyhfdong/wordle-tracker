import { Text, View } from "react-native"
import { theme } from "../constants/theme"

interface ITileProps {
  letter: string | null
  locked: boolean
  index: number
  hasWon: boolean
}

export const Tile: React.FC<ITileProps> = ({ letter, index }) => {
  return (
    <View
      style={{
        height: 65,
        width: 65,
        borderWidth: 2,
        borderColor: theme.light.lightGrey,
        marginBottom: 6,
        marginLeft: index === 0 ? 0 : 6,
      }}
    >
      <Text>{letter}</Text>
    </View>
  )
}
