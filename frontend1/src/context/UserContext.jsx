import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/users/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setUser(data.data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);