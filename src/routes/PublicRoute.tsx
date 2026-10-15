import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicRoute: React.FC = () => {
  return <Outlet />;
};
