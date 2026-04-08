import { useState, useMemo } from "react";
import { Table, Button, Input, Card, Popconfirm, Avatar, Space, Tag, Select } from "antd";
import { SearchOutlined, PlusOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import UserForm from "./UserForm";

const { Option } = Select;

function UserManagement({ users, loading, deleteUser, saveUser, isAdmin, setSelectedUser }) {
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // Derive unique positions for the filter dropdown
  const uniquePositions = useMemo(() => {
    const posSet = new Set(users.map(u => u.position).filter(Boolean));
    return Array.from(posSet);
  }, [users]);

  // Apply filters and sort
  const processedUsers = useMemo(() => {
    let result = users.filter((u) => {
      const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
                          (u.email || "").toLowerCase().includes(search.toLowerCase());
      const matchPosition = positionFilter === "ALL" || u.position === positionFilter;
      return matchSearch && matchPosition;
    });

    if (sortOrder === "newest") {
      result = result.sort((a, b) => dayjs(b.joinDate || 0).diff(dayjs(a.joinDate || 0)));
    } else if (sortOrder === "oldest") {
      result = result.sort((a, b) => dayjs(a.joinDate || 0).diff(dayjs(b.joinDate || 0)));
    }

    return result;
  }, [users, search, positionFilter, sortOrder]);

  const exportExcel = () => {
    const data = processedUsers.map((u, index) => ({
      STT: index + 1,
      Tên: u.name,
      Email: u.email,
      "Chức vụ": u.position,
      "Ngày vào làm": u.joinDate ? dayjs(u.joinDate).format("DD/MM/YYYY") : "",
      "Thâm niên": u.joinDate ? dayjs().diff(dayjs(u.joinDate), "year") + " năm" : ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NhanVien");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "DanhSachNhanVien.xlsx");
  };

  const openForm = (user = null) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    await saveUser(editingUser ? editingUser.id : null, values);
    setSaving(false);
    setModalVisible(false);
  };

  const columns = [
    {
      title: "Nhân viên",
      key: "user",
      render: (_, r) => (
        <Space>
          <Avatar src={r.avatar} size="large" style={{ backgroundColor: "var(--primary-color)" }}>
            {!r.avatar && r.name?.charAt(0)}
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{ fontWeight: 600, color: "var(--primary-color)", cursor: "pointer", fontSize: 15 }}
              onClick={() => setSelectedUser(r)}
            >
              {r.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.email}</span>
          </div>
        </Space>
      )
    },
    { 
      title: "Chức vụ", 
      dataIndex: "position",
      render: (pos) => <Tag color="blue">{pos || "N/A"}</Tag>
    },
    {
      title: "Ngày vào làm",
      dataIndex: "joinDate",
      render: (date) => <span style={{ color: "var(--text-secondary)" }}>{date ? dayjs(date).format("DD/MM/YYYY") : "—"}</span>
    },
    ...(isAdmin
      ? [{
          title: "Thiết lập",
          key: "action",
          align: "right",
          render: (_, r) => (
            <Space>
              <Button type="text" icon={<EditOutlined style={{ color: "var(--primary-color)" }} />} onClick={() => openForm(r)} />
              <Popconfirm title="Xóa nhân viên này?" onConfirm={() => deleteUser(r.id)} okText="Có" cancelText="Không">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )
        }]
      : [])
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Card bordered={false} className="glass-panel" style={{ padding: "10px 0" }}>
        {/* Filters and Actions Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <Space wrap>
            <Input
              prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }}/>}
              placeholder="Tìm theo tên, email..."
              style={{ width: 220, borderRadius: 20 }}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <Select 
              value={positionFilter} 
              onChange={setPositionFilter} 
              style={{ width: 160 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="ALL">Tất cả chức vụ</Option>
              {uniquePositions.map(pos => <Option key={pos} value={pos}>{pos}</Option>)}
            </Select>

            <Select 
              value={sortOrder} 
              onChange={setSortOrder} 
              style={{ width: 180 }}
              placeholder="Sắp xếp thâm niên"
              allowClear
            >
              <Option value="newest">Mới vào làm</Option>
              <Option value="oldest">Làm lâu năm nhất</Option>
            </Select>
          </Space>
          
          {isAdmin && (
            <Space>
              <Button icon={<DownloadOutlined />} onClick={exportExcel} style={{ borderRadius: 20 }}>
                Xuất Excel
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()} style={{ borderRadius: 20, boxShadow: "var(--shadow-glow)" }}>
                Thêm nhân viên
              </Button>
            </Space>
          )}
        </div>

        <Table
          dataSource={processedUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, position: ["bottomCenter"] }}
          style={{ overflowX: "auto" }}
          scroll={{ x: 800 }}
          className="no-print"
        />
      </Card>

      <UserForm 
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={editingUser}
        saving={saving}
      />
    </motion.div>
  );
}

export default UserManagement;
