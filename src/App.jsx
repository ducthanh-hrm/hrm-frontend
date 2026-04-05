import { useEffect, useState } from "react";
import API from "./api";
import Login from "./Login";
import UserDetail from "./UserDetail";

import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Input,
  Form,
  Row,
  Col,
  Statistic,
  Avatar,
  message,
  Skeleton,
  Popconfirm,
  DatePicker
} from "antd";

import {
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SearchOutlined
} from "@ant-design/icons";

import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const { Header, Sider, Content } = Layout;

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    avatar: "",
    joinDate: null
  });

  const [editingId, setEditingId] = useState(null);

  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  const getUsers = () => {
    setLoading(true);
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => message.error("Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuth) getUsers();
  }, [isAuth]);

  const saveUser = () => {
    if (!form.name || !form.email) {
      message.warning("Nhập đầy đủ thông tin!");
      return;
    }

    setSaving(true);

    const request = editingId
      ? API.put(`/users/${editingId}`, form)
      : API.post("/users", form);

    request
      .then(() => {
        message.success(editingId ? "Cập nhật" : "Thêm thành công");
        getUsers();
        setForm({
          name: "",
          email: "",
          position: "",
          avatar: "",
          joinDate: null
        });
        setEditingId(null);
      })
      .catch(() => message.error("Có lỗi xảy ra"))
      .finally(() => setSaving(false));
  };

  const deleteUser = (id) => {
    API.delete(`/users/${id}`).then(() => {
      message.success("Đã xóa");
      setUsers(users.filter(u => u.id !== id));
    });
  };

  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
  };

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.position || "").toLowerCase().includes(search.toLowerCase())
  );

  const positionCount = {};
  users.forEach(u => {
    const pos = u.position || "Khác";
    positionCount[pos] = (positionCount[pos] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(positionCount),
    datasets: [
      {
        label: "Số nhân viên",
        data: Object.values(positionCount)
      }
    ]
  };

  const exportExcel = () => {
    const data = users.map((u, index) => ({
      STT: index + 1,
      Tên: u.name,
      Email: u.email,
      "Chức vụ": u.position,
      "Ngày vào làm": u.joinDate
        ? dayjs(u.joinDate).format("DD/MM/YYYY")
        : "",
      "Thâm niên": u.joinDate
        ? dayjs().diff(dayjs(u.joinDate), "year") + " năm"
        : ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NhanVien");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(new Blob([buffer]), "DanhSachNhanVien.xlsx");
  };

  if (!isAuth) return <Login setIsAuth={setIsAuth} />;

  const columns = [
    {
      title: "Avatar",
      render: (_, r) => (
        <Avatar src={r.avatar}>
          {!r.avatar && r.name?.charAt(0)}
        </Avatar>
      )
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (text, record) => (
        <span
          style={{ color: "#1677ff", cursor: "pointer" }}
          onClick={() => setSelectedUser(record)}
        >
          {text}
        </span>
      )
    },
    { title: "Email", dataIndex: "email" },
    { title: "Chức vụ", dataIndex: "position" },
    {
      title: "Ngày vào",
      render: (_, r) =>
        r.joinDate
          ? dayjs(r.joinDate).format("DD/MM/YYYY")
          : "—"
    },
    ...(isAdmin
      ? [{
          title: "Hành động",
          render: (_, r) => (
            <>
              <Button onClick={() => {
                setForm({ ...r });
                setEditingId(r.id);
              }}>
                Sửa
              </Button>

              <Popconfirm title="Xóa?" onConfirm={() => deleteUser(r.id)}>
                <Button danger>Xóa</Button>
              </Popconfirm>
            </>
          )
        }]
      : [])
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <div style={{ color: "#fff", textAlign: "center", padding: 20 }}>
          🚀 HRM PRO
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          onClick={(e) => {
            if (e.key === "logout") logout();
            else {
              setPage(e.key);
              setSelectedUser(null);
            }
          }}
         items={[
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "users", icon: <TeamOutlined />, label: "Nhân sự" }, // 🔥 luôn hiện
  { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" }
]}
        />
      </Sider>

      <Layout>
        {/* HEADER MỚI */}
        <Header style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px"
        }}>
          <h3>Quản lý nhân sự ({role})</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar icon={<UserOutlined />} />
            <b>{role}</b>
          </div>
        </Header>

        <Content style={{ margin: 20 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {page === "dashboard" && (
              <>
                <Card>
                  <Statistic title="Tổng nhân sự" value={users.length} />
                </Card>

                <Card style={{ marginTop: 20 }}>
                  <Bar data={chartData} />
                </Card>
              </>
            )}

            {page === "users" && (
              selectedUser ? (
                <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />
              ) : (
                <>
                  {isAdmin && (
                    <Card title="Thêm / Cập nhật">
                      <Form layout="vertical">

                        <Form.Item label="Tên">
                          <Input
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                          />
                        </Form.Item>

                        <Form.Item label="Email">
                          <Input
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                          />
                        </Form.Item>

                        <Form.Item label="Chức vụ">
                          <Input
                            value={form.position}
                            onChange={e => setForm({ ...form, position: e.target.value })}
                          />
                        </Form.Item>

                        <Form.Item label="Avatar URL">
                          <Input
                            value={form.avatar}
                            onChange={e => setForm({ ...form, avatar: e.target.value })}
                          />
                        </Form.Item>

                        {form.avatar && (
                          <Avatar src={form.avatar} size={80} style={{ marginBottom: 10 }} />
                        )}

                        <Form.Item label="Ngày vào làm">
                          <DatePicker
                            style={{ width: "100%" }}
                            value={form.joinDate ? dayjs(form.joinDate) : null}
                            onChange={(d) =>
                              setForm({
                                ...form,
                                joinDate: d ? d.format("YYYY-MM-DD") : null
                              })
                            }
                          />
                        </Form.Item>

                        <Button type="primary" block loading={saving} onClick={saveUser}>
                          Lưu
                        </Button>

                      </Form>
                    </Card>
                  )}

                  <Card style={{ marginTop: 20 }}>
                    {isAdmin && (
                      <Button onClick={exportExcel} style={{ marginBottom: 10 }}>
                        📊 Xuất Excel
                      </Button>
                    )}

                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Tìm nhân viên..."
                      style={{ width: 300, marginBottom: 10 }}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    {loading ? <Skeleton /> : (
                      <Table
                        dataSource={filteredUsers}
                        columns={columns}
                        rowKey="id"
                      />
                    )}
                  </Card>
                </>
              )
            )}

          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;