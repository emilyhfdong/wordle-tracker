import { FontAwesome } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as React from "react"
import { ColorSchemeName, View } from "react-native"
import { SummaryModal } from "../components/summary-modal"
import { theme } from "../constants/theme"

import useColorScheme from "../hooks/useColorScheme"
import { CalendarScreen } from "../screens/calendar"
import { TodaysWordScreen } from "../screens/todays-word"
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types"
import LinkingConfiguration from "./LinkingConfiguration"

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={SummaryModal} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        tabBarActiveTintColor: theme.light.green,
      }}
    >
      <BottomTab.Screen
        name="Today"
        component={TodaysWordScreen}
        options={({ navigation }: RootTabScreenProps<"Today">) => ({
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  )
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"]
  color: string
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />
}
