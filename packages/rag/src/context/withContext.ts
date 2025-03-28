import { Context } from "./interface"

export const withContext = <T>(cb: (context: Context) => T) => cb
