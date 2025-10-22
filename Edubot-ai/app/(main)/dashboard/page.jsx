"use client"
import React from 'react';
import FeatureAssistant  from './_components/FeatureAssistant';
import History from './_components/History';
import Feedback from './_components/Feedback';


const DashboardClient = () => {
  return (
      <div>
        <FeatureAssistant/>
        <History/>
        <Feedback/>
    </div>
  );
};

export default DashboardClient;
