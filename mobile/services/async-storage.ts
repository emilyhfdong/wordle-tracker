import RNAsyncStorage from "@react-native-async-storage/async-storage"

export type TAsyncStorageKey = "USER_ID"

export const AsyncStorage = {
  get: async (key: TAsyncStorageKey) => {
    try {
      const value = await RNAsyncStorage.getItem(key)
      return value
    } catch (e) {
      console.log("ERROR - getting value in AsyncStorage", e)
    }
  },
  set: async (key: TAsyncStorageKey, value: string) => {
    try {
      await RNAsyncStorage.setItem(key, value)
    } catch (e) {
      console.log("ERROR - setting value in AsyncStorage", e)
    }
  },
}
