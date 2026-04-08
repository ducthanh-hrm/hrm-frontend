import { useState, useEffect } from "react";
import { Table, Card, Tag, Typography, Space, Button } from "antd";
import { ScheduleOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function Attendance({ users }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateMockData = () => {
    setLoading(true);
    const mockData = [];
    
    // Generate dates for the last 14 days
    const dates = Array.from({ length: 14 }).map((_, i) => 
      dayjs().subtract(13 - i, 'day').format('YYYY-MM-DD')
    );

    let idTracker = 1;
    dates.forEach(date => {
      // For each date, random subset of users check in
      users.forEach(user => {
        // Skip weekend mostly, give 80% attendance rate
        const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;
        const willAttend = Math.random() > (isWeekend ? 0.9 : 0.2);
        
        if (willAttend) {
          // Random check-in time between 7:30 and 9:30
          const checkInHour = Math.floor(Math.random() * 2) + 7;
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkInStr = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`;
          
          // Random check-out time 8-9 hours later
          const checkOutHour = checkInHour + 8 + (Math.random() > 0.5 ? 1 : 0);
          const checkOutMinute = Math.floor(Math.random() * 60);
          const checkOutStr = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`;

          const isLate = checkInHour >= 8 && checkInMinute > 15;

          mockData.push({
            id: idTracker++,
            date,
            user: user.name,
            position: user.position,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            status: isLate ? "Trễ" : "Đúng giờ"
          });
        }
      });
    });

    // Reverse to show most recent first
    setData(mockData.reverse());
    
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    if (users.length > 0) {
      generateMockData();
    }
  }, [users]);

  const columns = [
    { title: "Ngày", dataIndex: "date", render: (text) => <Text strong>{dayjs(text).format("DD/MM/YYYY")}</Text> },
    { title: "Nhân viên", dataIndex: "user", render: (text) => <Text style={{ color: "var(--primary-color)" }}>{text}</Text> },
    { title: "Chức vụ", dataIndex: "position" },
    { title: "Giờ vào (Check-in)", dataIndex: "checkIn" },
    { title: "Giờ ra (Check-out)", dataIndex: "checkOut" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Trễ" ? "volcano" : "green"}>{status}</Tag>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card 
        bordered={false} 
        className="glass-panel"
        title={
          <Space>
            <ScheduleOutlined style={{ color: "var(--primary-color)" }} />
            <span>Lịch sử chấm công (Giả lập)</span>
          </Space>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={generateMockData} loading={loading}>
            Làm mới ngẫu nhiên
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 12, position: ["bottomCenter"] }}
        />
      </Card>
    </motion.div>
  );
}

export default Attendance;
