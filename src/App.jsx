import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/User/Home";
import ThreadPage from "./pages/User/ThreadPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import CreateThreadForm from "./components/Forms/CreateThreadForm";

function App() {
  function handleClose() {
    console.log('close')
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          <div className="app-container">
            <main className="main-center-content">
              <Routes>
                <Route
                  path="/register"
                  element={<Register />}
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="*"
                  element={
                    <Navigate to="/home" replace />
                  }
                />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
