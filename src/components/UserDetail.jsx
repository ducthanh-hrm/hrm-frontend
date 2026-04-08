import { Card, Avatar, Button, Typography, Space, Divider } from "antd";
import { PrinterOutlined, ArrowLeftOutlined, IdcardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function UserDetail({ user, onBack }) {
  if (!user) return null;

  const getSeniority = (date) => {
    if (!date) return "—";
    const years = dayjs().diff(dayjs(date), "year");
    return years > 0 ? `${years} năm` : "Dưới 1 năm";
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate QR Code using a quick API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`Nhân viên: ${user.name} | Mức: ${user.position} | ID: ${user.id}`)}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="print-container">
      <Space className="no-print" style={{ marginBottom: 20 }}>
        <Button onClick={onBack} icon={<ArrowLeftOutlined />} shape="round">
          Quay lại
        </Button>
        <Button type="primary" onClick={handlePrint} icon={<PrinterOutlined />} shape="round">
          In Thẻ / Xuất PDF
        </Button>
      </Space>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card 
          className="id-card print-badge"
          style={{ width: 340, borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)", textAlign: "center" }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Lanyard Hole */}
          <div style={{ height: 20, width: 60, background: "#f0f2f5", margin: "10px auto", borderRadius: 10, border: "2px solid #d9d9d9" }}></div>
          
          <div style={{ background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)", padding: "30px 20px 60px", color: "white" }}>
            <Title level={4} style={{ color: "white", margin: 0, letterSpacing: 2 }}><IdcardOutlined /> HRM CORP</Title>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>Official Employee Badge</Text>
          </div>
          
          <div style={{ background: "white", padding: "0 20px 30px", marginTop: -50, position: "relative" }}>
            <Avatar
              size={110}
              src={user.avatar}
              style={{ border: "4px solid white", backgroundColor: "#f5f5f5", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            >
              {!user.avatar && user.name?.charAt(0)}
            </Avatar>
            
            <Title level={3} style={{ marginTop: 10, marginBottom: 0 }}>{user.name}</Title>
            <Text type="secondary" style={{ fontSize: 16, fontWeight: 500, color: "var(--primary-color)" }}>{user.position}</Text>
            
            <Divider style={{ margin: "16px 0" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "left", marginBottom: 15 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>Email</Text><br />
                <Text strong>{user.email}</Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text type="secondary" style={{ fontSize: 11 }}>Date Joined</Text><br />
                <Text strong>{user.joinDate ? dayjs(user.joinDate).format("MM/YYYY") : "N/A"}</Text>
              </div>
            </div>
            
            <div style={{ padding: 10, background: "#f9f9f9", borderRadius: 8, display: "inline-block" }}>
              <img src={qrCodeUrl} alt="QR Code" width={100} height={100} style={{ borderRadius: 4 }} />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

export default UserDetail;
