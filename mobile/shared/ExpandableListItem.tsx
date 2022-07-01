import React, { useState } from "react"

import { LayoutAnimation } from "react-native"
import { ListItem, TListItemProps } from "./ListItem"

type TExpandableListItemProps = {
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}

export const ExpandableListItem: React.FC<
  Omit<TListItemProps, "onPress"> & TExpandableListItemProps
> = ({ isExpanded, setIsExpanded, children, ...props }) => {
  return (
    <ListItem
      {...props}
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setIsExpanded(!isExpanded)
      }}
    >
      {isExpanded && children}
    </ListItem>
  )
}
