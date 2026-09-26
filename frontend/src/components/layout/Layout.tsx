import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const Layout: React.FC = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{ flex: 1, marginLeft: '240px', padding: '24px', overflowY: 'auto' }}>
      <Outlet />
    </main>
  </div>
);

export default Layout;