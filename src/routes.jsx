import LogInPage from "./pages/login-page.jsx";
import SignUpPage from "./pages/signup-page.jsx";

import GeneralError from "./pages/500.jsx";
import NotFoundError from "./pages/404.jsx";

import TaskList from "./components/entities/tasks/list.jsx";
import { TaskDrawer } from "./components/entities/tasks/form-drawer.jsx";
import CompanyDetails from "./components/entities/companies/CompanyDetails.jsx";
import CompaniesList from "./components/entities/companies/CompaniesList.jsx";

import { createBrowserRouter } from "react-router-dom";
import { AuthenticatedRoute, UnauthenticatedRoute } from "./features/auth/videur.jsx";

import "./styles/index.css";
import Root from "./root.jsx";
import Index from "./components/shared/Index.jsx";
import ContactsList from "./components/entities/contacts/ContactsList.jsx";
import ContactDetails from "./components/entities/contacts/ContactDetails.jsx";
import DealList from "./components/entities/deals/list.jsx";
import { DealDrawer } from "./components/entities/deals/drawer.jsx";
import { ProfileForm } from "./components/profile/profile-form.jsx";
import ProfilePage from "./pages/profile-page.jsx";

const routerNT = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <Root />
      </AuthenticatedRoute>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        errorElement: <GeneralError />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "/overview",
            element: (
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/companies",
            element: (
              <AuthenticatedRoute>
                <CompaniesList />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/companies/:companyId",
            element: (
              <AuthenticatedRoute>
                <CompanyDetails />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/users",
            element: (
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/me",
            element: (
              <AuthenticatedRoute>
                <ProfilePage />
              </AuthenticatedRoute>
            ),
            children: [
              { index: true, element: <ProfileForm /> },
              { path: "/me/preferences", element: <Index /> },
              { path: "/me/socials", element: <Index /> },
              { path: "/me/data", element: <Index /> },
              { path: "/me/security", element: <Index /> },
            ],
          },
          {
            path: "/contacts",
            element: (
              <AuthenticatedRoute>
                <ContactsList />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/contacts/:contactId",
            element: (
              <AuthenticatedRoute>
                <ContactDetails />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/tasks",
            element: (
              <AuthenticatedRoute>
                <TaskList />
                <TaskDrawer />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/deals",
            element: (
              <AuthenticatedRoute>
                <DealList />
                <DealDrawer />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/archive",
            element: (
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/analytics",
            element: (
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "/integrations",
            element: (
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            ),
          },
          {
            path: "*",
            element: <NotFoundError />,
          },
        ],
      },
    ],
  },
  {
    errorElement: <GeneralError />,
    path: "/login",
    element: (
      <UnauthenticatedRoute>
        <LogInPage />
      </UnauthenticatedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <UnauthenticatedRoute>
        <SignUpPage />
      </UnauthenticatedRoute>
    ),
    errorElement: <GeneralError />,
  },
  {
    path: "*",
    element: <NotFoundError />,
  },
]);

export default routerNT;
