import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const getUsers = () => {
    API.get("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Lỗi lấy users:", err);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const addUser = () => {
    if (name.trim() === "") {
      alert("Vui lòng nhập tên");
      return;
    }

    API.post("/users", { name })
      .then(() => {
        setName("");
        getUsers();
      })
      .catch((err) => {
        console.log("Lỗi thêm user:", err);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Danh sách Users</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nhập tên user"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            marginRight: "10px"
          }}
        />
        <button
          onClick={addUser}
          style={{
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Thêm User
        </button>
      </div>

      {users.length === 0 ? (
        <p>Chưa có dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;