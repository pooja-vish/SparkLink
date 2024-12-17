import React, { createContext, useState, useContext } from "react";
import axios from "axios";

// Create the Context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [notifyCount, setNotifyCount] = useState(0);

  // Function to update the notification count
  const updateNotifyCount = async () => {
    const response = await axios.get('/api/notify/count');
      console.log("message ---> ",response.data.message);
      console.log("count ---> ",response.data.notifCount);
      setNotifyCount(response.data.notifCount);
  };

  return (
    <NotificationContext.Provider value={{ notifyCount, updateNotifyCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to access notification count in any component
export const useNotification = () => useContext(NotificationContext);
