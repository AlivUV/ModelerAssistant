import React, { useState } from 'react'

const UserContext = React.createContext()
export function UserContextProvider ({children}){
    const [stateUser, setStateUser] = useState()

    return <UserContext.Provider value={{stateUser, setStateUser}}>
        {children}
    </UserContext.Provider>
}
export default UserContext