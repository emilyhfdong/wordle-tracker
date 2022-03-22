import { useEffect } from "react"
import { BackendService } from "../services/backend"
import * as Device from "expo-device"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { userActions } from "../redux/slices/user.slice"

export const Initializer: React.FC = ({ children }) => {
  const userId = useAppSelector((state) => state.user.id)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const createAndSetUser = async () => {
      const user = await BackendService.createUser(
        Device.deviceName || "Anonymous"
      )
      dispatch(userActions.setUser({ id: user.id, name: user.name }))
    }
    if (!userId) {
      createAndSetUser()
    }
  }, [])
  return <>{children}</>
}
