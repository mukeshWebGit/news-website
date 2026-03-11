import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import ManageArticles from "./pages/ManageArticles";
import AddUser from "./pages/AddUser";
import ManageUsers from "./pages/ManageUsers";
import ManageCategories from "./pages/ManageCategories";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 

function App() {
 
  return (
    <Router>
      <Routes>
        {/* Public (no sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout (with sidebar/header/footer) */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-article" element={<AddArticle />} />
          <Route path="edit-article/:id" element={<EditArticle />} />
          <Route path="manage-articles" element={<ManageArticles />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
