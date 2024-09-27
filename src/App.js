import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import PrivateRoute from './components/common/PrivateRoute.js';
import NavigationBar from './components/common/NavigationBar.js';
import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import RequestPasswordReset from './components/specific/auth/RequestPasswordReset.js';
import OTPValidation from './components/specific/auth/OTPValidation.js';
import SetNewPassword from './components/specific/auth/SetNewPassword.js';
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Profile from './pages/Profile.js';
import EditProfile from './pages/EditProfile.js';
import AllServices from './pages/AllServices.js';
import ProcurementForm from './components/specific/ProcurementForm.js'
import ProcurementDetails from './components/specific/ProcurementDetails';
import ProcurementApplication from './components/specific/ProcurementApplication';
import SupplierRegistration from './components/specific/SupplierRegistration';
import AppliedServicesList from './components/specific/AppliedServicesList';
import AppliedServiceDetails from './components/specific/AppliedServiceDetails.js';
import SupplierListPage from './pages/SupplierListPage.js'
import "./App.css";

function App() {

  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <NavigationBar />
          <Content />
        </Router>
      </div>
    </AuthProvider>
  );
}

// Content component to conditionally render Sidebar and Routes
function Content() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div>
        <Routes>
          {/* General routes */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/validate-otp" element={<OTPValidation />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/list" element={<AllServices />} />
          <Route path="/procure-detail/:id" element={<ProcurementDetails />} />
          <Route path="/supplier-registration" element={<SupplierRegistration />} />
          <Route path="/" element={<Home />} />

          {/* Protected routes */}
          <Route path="/apply-procurement/:id" element={<PrivateRoute element={<ProcurementApplication />} />} />
          <Route path="/create-procurement-post" element={<PrivateRoute element={<ProcurementForm />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/edit-profile/:userID" element={<PrivateRoute element={<EditProfile />} />} />
          <Route path="/applied/list" element={<PrivateRoute element={<AppliedServicesList />} />} />
          <Route path="/service-details/:serviceID" element={<PrivateRoute element={<AppliedServiceDetails />} />} />
          <Route path="/suppliers-list" element={<PrivateRoute element={<SupplierListPage/>}/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
