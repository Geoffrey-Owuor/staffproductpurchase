import { createContext, useContext } from "react";

//Create the context
const UserContext = createContext(null);

//Custom hook to use the context
export const useUser = () => useContext(UserContext);

export default UserContext;
