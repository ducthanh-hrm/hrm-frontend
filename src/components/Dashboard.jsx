import { Card, Statistic, Row, Col } from "antd";
import { TeamOutlined, RiseOutlined } from "@ant-design/icons";
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard({ users }) {
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
        data: Object.values(positionCount),
        backgroundColor: [
          'rgba(24, 144, 255, 0.6)',
          'rgba(114, 46, 209, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(24, 144, 255, 1)',
          'rgba(114, 46, 209, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter' } }
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="glass-panel" style={{ background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)", color: "white" }}>
            <Statistic 
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Tổng nhân sự</span>} 
              value={users.length} 
              valueStyle={{ color: "white", fontSize: 36, fontWeight: "bold" }}
              prefix={<TeamOutlined style={{ marginRight: 8, opacity: 0.8 }} />} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="glass-panel" style={{ background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)", color: "white" }}>
            <Statistic 
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Vị trí công việc</span>} 
              value={Object.keys(positionCount).length} 
              valueStyle={{ color: "white", fontSize: 36, fontWeight: "bold" }}
              prefix={<RiseOutlined style={{ marginRight: 8, opacity: 0.8 }} />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Phân bố chức vụ" bordered={false} className="glass-panel">
            <div style={{ height: 400, display: "flex", justifyContent: "center" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
}

export default Dashboard;
