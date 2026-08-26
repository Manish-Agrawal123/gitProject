import React, {
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

const AuthContext = createContext();

export const  useAuth = () =>{
    return useContext(AuthContext);
}

export const AuthProvider = (({children})=>{
    const [User,setUser] = useState(null);
    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        if(userId){
            setUser(userId);
        }
    },[]);

    const value = {User,setUser};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

})