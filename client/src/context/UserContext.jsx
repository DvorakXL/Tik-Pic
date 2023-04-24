import { createContext, useState, useEffect } from 'react'
import { setAxiosHeaders } from '../axiosConfig'
import { parseJwt } from '../utils/jwt'

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('tokens'))
    setAxiosHeaders(session?.accessToken)

    const user = parseJwt(session?.accessToken)
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}