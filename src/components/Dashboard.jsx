import { Card, Statistic, Row, Col } from "antd";
import { TeamOutlined, RiseOutlined } from "@ant-design/icons";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard({ users }) {
  const positionCount = {};
  users.forEach(u => {
    const pos = u.position || "Khác";
    positionCount[pos] = (positionCount[pos] || 0) + 1;
  });

  // Palette xịn xò hiện đại
  const brandColors = [
    'rgba(24, 144, 255, 0.85)',
    'rgba(114, 46, 209, 0.85)',
    'rgba(250, 140, 22, 0.85)',
    'rgba(82, 196, 26, 0.85)',
    'rgba(245, 34, 45, 0.85)',
  ];

  const barChartData = {
    labels: Object.keys(positionCount),
    datasets: [
      {
        label: "Nhân viên",
        data: Object.values(positionCount),
        backgroundColor: brandColors,
        borderRadius: 8, // Apple-style rounded corners
        maxBarThickness: 45 // Prevent bars from turning into fat rectangles
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide legend to make it cleaner
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 14, family: "Inter", weight: "bold" },
        bodyFont: { size: 13, family: "Inter" },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false }, // Xóa kẻ sọc dọc
        ticks: { font: { family: "Inter", size: 13 } }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { family: "Inter", size: 13 } },
        grid: { color: "rgba(0,0,0,0.06)", borderDash: [5, 5] }, // Nền nét đứt nhẹ nhàng
        border: { display: false }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  // Mock data for Doughnut (Thâm niên)
  const doughnutData = {
    labels: ["Sắp hết hạn HĐ", "Mới vào (Thử việc)", "Làm lâu năm"],
    datasets: [{
      data: [Math.floor(users.length * 0.1), Math.floor(users.length * 0.3), Math.floor(users.length * 0.6)],
      backgroundColor: [
        'rgba(245, 34, 45, 0.85)',
        'rgba(250, 173, 20, 0.85)',
        'rgba(24, 144, 255, 0.85)'
      ],
      hoverOffset: 4,
      borderWidth: 0
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { font: { family: 'Inter', size: 13 }, padding: 20, usePointStyle: true }
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="glass-panel" style={{ background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)", color: "white" }}>
            <Statistic 
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Tổng nhân sự toàn công ty</span>} 
              value={users.length} 
              valueStyle={{ color: "white", fontSize: 42, fontWeight: 700 }}
              prefix={<TeamOutlined style={{ marginRight: 12, opacity: 0.8 }} />} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="glass-panel" style={{ background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)", color: "white" }}>
            <Statistic 
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Số lượng vị trí công việc</span>} 
              value={Object.keys(positionCount).length} 
              valueStyle={{ color: "white", fontSize: 42, fontWeight: 700 }}
              prefix={<RiseOutlined style={{ marginRight: 12, opacity: 0.8 }} />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Cơ cấu nhân sự theo Phòng ban/Chức vụ</span>} 
            bordered={false} 
            className="glass-panel"
            headStyle={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div style={{ height: 360, width: "100%" }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Tình trạng Hợp đồng (Mock)</span>} 
            bordered={false} 
            className="glass-panel"
            headStyle={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div style={{ height: 360, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
}

export default Dashboard;
