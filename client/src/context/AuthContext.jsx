import {createContext, useContext} from "react"

/*
Creates a global auth container
Allows any component to access auth state
Avoids prop drilling 
*/

export const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be inside the AuthProvider")
    }
    return context;
}