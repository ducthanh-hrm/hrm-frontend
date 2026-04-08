import { useState } from "react";
import API from "./api";
import { Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/login", { email, password });
      const { token, role } = res.data;

      if (!token) {
        message.error("Không nhận được token!");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      message.success(`Đăng nhập thành công (${role})`);
      setIsAuth(true);
    } catch (err) {
      message.error("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative background shapes */}
      <div style={styles.shape1}></div>
      <div style={styles.shape2}></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel"
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.logo}>
            <LoginOutlined style={{ fontSize: 32, color: "var(--primary-color)" }} />
          </div>
          <Title level={3} style={{ margin: "10px 0 5px 0" }}>
            Chào mừng trở lại!
          </Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <Text strong style={styles.label}>Email truy cập</Text>
            <Input
              size="large"
              placeholder="admin@gmail.com"
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              style={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              onPressEnter={handleLogin}
            />
          </div>

          <div style={styles.inputGroup}>
            <Text strong style={styles.label}>Mật khẩu</Text>
            <Input.Password
              size="large"
              placeholder="Tròn 6 ký tự"
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleLogin}
            />
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            style={styles.btn}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
        
        <div style={styles.footer}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            Phát triển bởi: Nguyễn Đức Thành & Mai Quang Trường
          </Text>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    position: "relative",
    overflow: "hidden"
  },
  shape1: {
    position: "absolute",
    width: 400,
    height: 400,
    background: "rgba(24, 144, 255, 0.4)",
    filter: "blur(80px)",
    borderRadius: "50%",
    top: "-10%",
    left: "-10%",
    zIndex: 0
  },
  shape2: {
    position: "absolute",
    width: 300,
    height: 300,
    background: "rgba(114, 46, 209, 0.3)",
    filter: "blur(60px)",
    borderRadius: "50%",
    bottom: "5%",
    right: "-5%",
    zIndex: 0
  },
  card: {
    width: 420,
    padding: "40px",
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.7)", 
  },
  header: {
    textAlign: "center",
    marginBottom: 30
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "var(--shadow-md)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  label: {
    fontSize: 14,
    color: "var(--text-secondary)"
  },
  input: {
    padding: "10px 14px",
  },
  btn: {
    marginTop: 10,
    height: 48,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "var(--shadow-glow)"
  },
  footer: {
    marginTop: 30,
    textAlign: "center"
  }
};

export default Login;