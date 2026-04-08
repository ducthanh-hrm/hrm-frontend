import { Layout, Avatar, Dropdown, Space, Switch } from "antd";
import { UserOutlined, SettingOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons";

const { Header } = Layout;

function HeaderBar({ role, logout, isDarkMode, setIsDarkMode }) {
  const items = [
    {
      key: '1',
      label: 'Cài đặt tài khoản',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Đăng xuất',
      danger: true,
      onClick: logout
    },
  ];

  return (
    <Header
      style={{
        background: isDarkMode ? "rgba(20, 20, 20, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: 72,
        boxShadow: isDarkMode ? "none" : "var(--shadow-sm)",
        position: "sticky",
        top: 0,
        zIndex: 9
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)", fontSize: 20 }}>
        Quản lý nhân sự
      </h2>

      <Space size="large">
        <Switch 
          checkedChildren={<BulbOutlined />} 
          unCheckedChildren={<BulbFilled />} 
          checked={isDarkMode} 
          onChange={(checked) => setIsDarkMode(checked)} 
          style={{ background: isDarkMode ? "#1890ff" : "#bfbfbf" }}
        />
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Space style={{ cursor: "pointer", padding: "4px 12px", borderRadius: 20, background: isDarkMode ? "rgba(255,255,255,0.08)" : "#f0f2f5", transition: "background 0.3s" }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "var(--primary-color)" }} />
            <span style={{ fontWeight: 500, color: "var(--text-primary)", textTransform: "capitalize" }}>
              {role}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}

export default HeaderBar;
