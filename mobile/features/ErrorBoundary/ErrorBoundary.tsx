import React, { PropsWithChildren } from "react"
// import { Alert } from "react-native"

export class ErrorBoundary extends React.Component<PropsWithChildren> {
  componentDidCatch(error: any, errorInfo: any) {
    // Alert.alert("error", JSON.stringify(error))
  }

  render() {
    return this.props.children
  }
}
