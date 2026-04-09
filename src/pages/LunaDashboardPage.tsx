import React from 'react';
import { LunaDashboardLayout } from '../components/luna-obsidian/layout/LunaDashboardLayout';
import { MainDashboard } from '../components/luna-obsidian/dashboard/MainDashboard';

export default function LunaDashboardPage() {
  return (
    <LunaDashboardLayout>
      <MainDashboard />
    </LunaDashboardLayout>
  );
}
