import React from "react"
import { Alert } from "react-native"

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: any, errorInfo: any) {
    // Alert.alert("error", JSON.stringify(error))
  }

  render() {
    return this.props.children
  }
}
