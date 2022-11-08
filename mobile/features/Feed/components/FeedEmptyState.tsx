import React from "react"
import { FullScreenMessage } from "../../../shared"

export const FeedEmptyState: React.FC = () => {
  return (
    <FullScreenMessage
      title=" Your results and your friend's results will show up here!"
      emoji="✨"
    />
  )
}
