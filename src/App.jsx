import { useEffect, useState } from "react";
import API from "./api";
import Login from "./Login";

import { Layout, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import UserDetail from "./components/UserDetail";
import Attendance from "./components/Attendance";

const { Content } = Layout;

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const getUsers = () => {
    setLoading(true);
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => message.error("Lỗi tải dữ liệu nhân sự"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuth) getUsers();
  }, [isAuth]);

  const saveUser = async (id, values) => {
    try {
      if (id) {
        await API.put(`/users/${id}`, values);
        message.success("Cập nhật thành công");
      } else {
        await API.post("/users", values);
        message.success("Thêm nhân viên thành công");
      }
      getUsers();
    } catch (err) {
      message.error("Có lỗi xảy ra khi lưu");
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      message.success("Đã xóa nhân viên");
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      message.error("Không thể xóa lúc này");
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
  };

  if (!isAuth) return <Login setIsAuth={setIsAuth} />;

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sidebar page={page} setPage={(p) => { setPage(p); setSelectedUser(null); }} logout={logout} />

      <Layout style={{ background: "var(--bg-color)" }}>
        <HeaderBar 
          role={role} 
          logout={logout} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />

        <Content style={{ margin: "24px 24px 0", overflowY: "auto", paddingBottom: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page + (selectedUser ? "-detail" : "")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {page === "dashboard" && <Dashboard users={users} />}
              
              {page === "attendance" && <Attendance users={users} />}

              {page === "users" && (
                selectedUser ? (
                  <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />
                ) : (
                  <UserManagement 
                    users={users} 
                    loading={loading}
                    isAdmin={isAdmin}
                    deleteUser={deleteUser}
                    saveUser={saveUser}
                    setSelectedUser={setSelectedUser}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;