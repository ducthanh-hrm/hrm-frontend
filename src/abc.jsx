import { useState } from "react";
import API from "./api";
import { Card, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

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

      // 🔥 LƯU TOKEN + ROLE
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
      <Card style={styles.card}>
        <h2 style={styles.title}>🔐 Đăng nhập hệ thống</h2>

        <Input
          size="large"
          placeholder="Email"
          prefix={<UserOutlined />}
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input.Password
          size="large"
          placeholder="Mật khẩu"
          prefix={<LockOutlined />}
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          style={styles.button}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e6f0ff, #f5f7fa)"
  },
  card: {
    width: 400,
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    border: "none"
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold"
  },
  input: {
    marginBottom: 15,
    borderRadius: 8
  },
  button: {
    borderRadius: 8,
    height: 45,
    fontWeight: "bold"
  }
};

export default Login;