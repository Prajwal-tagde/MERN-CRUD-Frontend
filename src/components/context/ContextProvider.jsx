import React, { createContext, useState } from 'react'

export const addData = createContext();
export const updateData = createContext();
export const delData = createContext();

const ContextProvider = ({ children }) => {

    const [userAdd, setUserAdd] = useState("");
    const [update, setUpdate] = useState("");
    const [deleteData, setDeleteData] = useState("");

  return (
    <>
        <addData.Provider value={{userAdd, setUserAdd}}>
          <updateData.Provider value={{update, setUpdate}}>
            <delData.Provider value={{deleteData, setDeleteData}}>
              {children}
            </delData.Provider>
          </updateData.Provider>
        </addData.Provider> 
    </>
  )
}

export default ContextProvider
