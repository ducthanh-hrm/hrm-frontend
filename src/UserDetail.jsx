import { Card, Avatar, Button } from "antd";
import dayjs from "dayjs"; // 🔥 thêm

function UserDetail({ user, onBack }) {
  if (!user) return null;

  // 🔥 FIX: tính thâm niên chuẩn hơn
  const getSeniority = (date) => {
    if (!date) return "—";
    return dayjs().diff(dayjs(date), "year") + " năm";
  };

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={onBack} style={{ marginBottom: 20 }}>
        ← Quay lại
      </Button>

      <Card style={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
        <Avatar
          size={120}
          src={user.avatar}
          style={{ marginBottom: 20 }}
        >
          {!user.avatar && user.name?.charAt(0)}
        </Avatar>

        <h2>{user.name}</h2>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Chức vụ:</b> {user.position}</p>

        {/* 🔥 FIX DATE */}
        <p>
          <b>Ngày vào làm:</b>{" "}
          {user.joinDate
            ? dayjs(user.joinDate).format("DD/MM/YYYY")
            : "—"}
        </p>

        <p>
          <b>Thâm niên:</b> {getSeniority(user.joinDate)}
        </p>
      </Card>
    </div>
  );
}

export default UserDetail;