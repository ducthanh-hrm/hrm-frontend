import { Modal, Form, Input, DatePicker, Avatar } from "antd";
import dayjs from "dayjs";

function UserForm({ visible, onCancel, onSave, initialValues, saving }) {
  const [form] = Form.useForm();

  // Reset or set form fields when modal opens/closes
  if (visible && initialValues) {
    form.setFieldsValue({
      ...initialValues,
      joinDate: initialValues.joinDate ? dayjs(initialValues.joinDate) : null
    });
  } else if (visible && !initialValues) {
    form.resetFields();
  }

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onSave({
          ...values,
          joinDate: values.joinDate ? values.joinDate.format("YYYY-MM-DD") : null
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
      okText="Lưu lại"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      centered
      className="custom-modal"
    >
      <Form
        form={form}
        layout="vertical"
        name="user_form"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="name"
          label="Họ và Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
        >
          <Input size="large" placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email truy cập"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input size="large" placeholder="email@congty.com" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Chức vụ"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
        >
          <Input size="large" placeholder="Developer, Designer..." />
        </Form.Item>

        <Form.Item
          name="joinDate"
          label="Ngày vào làm"
        >
          <DatePicker size="large" style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Đường dẫn Ảnh đại diện (URL)"
        >
          <Input size="large" placeholder="https://..." />
        </Form.Item>
        
        {/* Preview avatar mechanism not included here to keep it simple, but doable */}
      </Form>
    </Modal>
  );
}

export default UserForm;
