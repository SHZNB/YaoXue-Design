import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './layouts/MainLayout';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { SubjectLab } from './pages/SubjectLab';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EnvGuard } from './components/EnvGuard';
import { ExperimentPresets } from './pages/teacher/ExperimentPresets';
import { AdminDashboard } from './pages/admin/Dashboard';
import { LabContainer } from './pages/LabContainer';

const App: React.FC = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <EnvGuard>
      <HashRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/lab/:subjectName" element={<SubjectLab />} />
              <Route path="/teacher/presets" element={<ExperimentPresets />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            {/* 独立的全屏实验容器路由 */}
            <Route path="/lab/:subjectName/:experimentId" element={<LabContainer />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </EnvGuard>
  );
};

export default App;
