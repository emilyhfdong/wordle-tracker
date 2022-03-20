declare module "@env" {
  export const API_BASE: string
}
declare module "react-native-dotenv"
declare module "*.svg" {
  import React from "react"
  import { SvgProps } from "react-native-svg"
  const content: React.FC<SvgProps>
  export default content
}
