import { Layout, Menu } from "antd";
import {
  TeamOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ScheduleOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

function Sidebar({ page, setPage, logout }) {
  return (
    <Sider 
      width={240} 
      theme="dark" 
      breakpoint="lg"
      collapsedWidth="0"
      style={{ boxShadow: "var(--shadow-lg)", zIndex: 10, minHeight: "100vh" }}
    >
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "24px 20px",
          fontSize: 22,
          fontWeight: 700,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 10,
          background: "linear-gradient(90deg, var(--secondary-color), var(--primary-color))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        🌟 HRM PRO
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[page]}
        onClick={(e) => {
          if (e.key === "logout") logout();
          else setPage(e.key);
        }}
        items={[
          { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
          { key: "users", icon: <TeamOutlined />, label: "Nhân sự" },
          { key: "attendance", icon: <ScheduleOutlined />, label: "Chấm công (Demo)" },
          { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
        ]}
      />
    </Sider>
  );
}

export default Sidebar;
