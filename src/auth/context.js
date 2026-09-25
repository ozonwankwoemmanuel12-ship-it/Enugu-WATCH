import { createContext } from 'react'

export const AuthContext = createContext(null)

export const UNAUTHORIZED = Symbol('unauthorized')
export const VERIFY_ERROR = Symbol('verify-error')