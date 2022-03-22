import { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import * as Device from "expo-device"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { userActions } from "../redux/slices/user.slice"
import { todaysWordActions } from "../redux/slices/todays-word"

export const Initializer: React.FC = ({ children }) => {
  const userId = useAppSelector((state) => state.user.id)
  const currentWordNumber = useAppSelector((state) => state.todaysWord.number)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const createAndSetUser = async () => {
      const user = await BackendService.createUser(
        Device.deviceName || "Anonymous"
      )
      dispatch(userActions.setUser({ id: user.id, name: user.name }))
    }
    const getAndSetTodaysWord = async () => {
      const today = await BackendService.getTodaysWord()
      if (today.number !== currentWordNumber) {
        dispatch(
          todaysWordActions.setNewWord({
            word: today.word,
            number: today.number,
            date: today.date,
          })
        )
      }
      setIsLoading(false)
    }
    getAndSetTodaysWord()
    if (!userId) {
      createAndSetUser()
    }
  }, [])
  return isLoading ? null : <>{children}</>
}
