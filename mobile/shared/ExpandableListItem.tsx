import React, { PropsWithChildren } from "react"

import { LayoutAnimation } from "react-native"
import { ListItem, TListItemProps } from "./ListItem"

type TExpandableListItemProps = {
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}

const layoutAnimation = LayoutAnimation.create(200, "easeInEaseOut", "opacity")

export const ExpandableListItem: React.FC<
  Omit<TListItemProps, "onPress"> & PropsWithChildren<TExpandableListItemProps>
> = ({ isExpanded, setIsExpanded, children, ...props }) => {
  return (
    <ListItem
      {...props}
      onPress={() => {
        LayoutAnimation.configureNext(layoutAnimation)
        setIsExpanded(!isExpanded)
      }}
    >
      {isExpanded && children}
    </ListItem>
  )
}
