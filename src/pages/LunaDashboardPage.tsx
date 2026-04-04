import React from 'react';
import { MainLayout } from '../components/luna-obsidian/layout/MainLayout';
import { MainDashboard } from '../components/luna-obsidian/dashboard/MainDashboard';

export default function LunaDashboardPage() {
  return (
    <MainLayout>
      <MainDashboard />
    </MainLayout>
  );
}
