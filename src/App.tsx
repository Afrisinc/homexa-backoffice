import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/auth/context/jwt/auth-provider';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UsersPage from '@/pages/UsersPage';
import CreateUserPage from '@/pages/CreateUserPage';
import ProductsPage from '@/pages/ProductsPage';
import CreateProductPage from '@/pages/CreateProductPage';
import CategoriesPage from '@/pages/CategoriesPage';
import CreateCategoryPage from '@/pages/CreateCategoryPage';
import SupportPage from '@/pages/SupportPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users/create"
        element={
          <ProtectedRoute>
            <CreateUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users/:id/edit"
        element={
          <ProtectedRoute>
            <CreateUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users/:id/view"
        element={
          <ProtectedRoute>
            <CreateUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/products/create"
        element={
          <ProtectedRoute>
            <CreateProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/products/:id/edit"
        element={
          <ProtectedRoute>
            <CreateProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/products/:id/view"
        element={
          <ProtectedRoute>
            <CreateProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categories/create"
        element={
          <ProtectedRoute>
            <CreateCategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categories/:id/edit"
        element={
          <ProtectedRoute>
            <CreateCategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categories/:id/view"
        element={
          <ProtectedRoute>
            <CreateCategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/support"
        element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
