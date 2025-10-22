import React from "react";
import AppHeader from "./_components/Header";
import Provider from "../provider";  // Wrap only dashboard

const DashboardLayout = ({ children }) => {
  return (
    <Provider>
      <AppHeader />
      {children}
    </Provider>
  );
};

export default DashboardLayout;
