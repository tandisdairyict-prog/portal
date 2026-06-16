import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Space, Popconfirm, message, Card, Avatar } from 'antd'
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getUsers, createUser, updateUser, deleteUser } from '../api/users'
import type { User } from '../types'
import type { ColumnsType } from 'antd/es/table'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const load = async () => { setLoading(true); try { setUsers(await getUsers()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const handleSubmit = async (values: Parameters<typeof createUser>[0] & Partial<User>) => {
    try {
      if (editingUser) await updateUser(editingUser.id, values)
      else await createUser(values as Parameters<typeof createUser>[0])
      message.success(editingUser ? 'کاربر بروزرسانی شد' : 'کاربر ایجاد شد')
      setModalOpen(false); form.resetFields(); load()
    } catch { message.error('خطا در عملیات') }
  }

  const handleDelete = async (id: number) => {
    try { await deleteUser(id); message.success('کاربر حذف شد'); load() }
    catch { message.error('خطا در حذف') }
  }

  const columns: ColumnsType<User> = [
    {
      title: 'کاربر', key: 'user',
      render: (_, r) => (
        <Space>
          <Avatar style={{ background: '#3b5bdb' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{r.fullName}</div>
            <div style={{ fontSize: 12, color: '#718096' }}>{r.email}</div>
          </div>
        </Space>
      )
    },
    { title: 'نام کاربری', dataIndex: 'username', key: 'username', render: (v: string) => <code style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: 4 }}>{v}</code> },
    { title: 'شماره پرسنلی', dataIndex: 'personnelNumber', key: 'personnelNumber' },
    {
      title: 'وضعیت', dataIndex: 'isActive', key: 'isActive',
      render: (v: boolean) => <Tag color={v ? 'success' : 'error'}>{v ? 'فعال' : 'غیرفعال'}</Tag>
    },
    {
      title: 'عملیات', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingUser(r); form.setFieldsValue(r); setModalOpen(true) }} />
          <Popconfirm title="حذف کاربر؟" onConfirm={() => handleDelete(r.id)} okText="بله" cancelText="خیر">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت کاربران</div>
          <div style={{ color: '#718096', fontSize: 13 }}>لیست کاربران سیستم</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); form.resetFields(); setModalOpen(true) }}>
          کاربر جدید
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
        <Table columns={columns} dataSource={users} loading={loading} rowKey="id" />
      </Card>

      <Modal
        title={editingUser ? 'ویرایش کاربر' : 'کاربر جدید'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="firstName" label="نام" rules={[{ required: true }]}>
            <Input placeholder="نام" />
          </Form.Item>
          <Form.Item name="lastName" label="نام خانوادگی" rules={[{ required: true }]}>
            <Input placeholder="نام خانوادگی" />
          </Form.Item>
          <Form.Item name="username" label="نام کاربری" rules={[{ required: true }]}>
            <Input placeholder="نام کاربری" />
          </Form.Item>
          <Form.Item name="email" label="ایمیل" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="ایمیل" />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="رمز عبور" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="رمز عبور" />
            </Form.Item>
          )}
          <Form.Item name="personnelNumber" label="شماره پرسنلی">
            <Input placeholder="شماره پرسنلی" />
          </Form.Item>
          <Form.Item name="nationalId" label="کدملی">
            <Input placeholder="کدملی" maxLength={10} />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">ذخیره</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
