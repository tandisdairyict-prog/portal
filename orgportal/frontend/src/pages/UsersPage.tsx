import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getUsers, createUser, updateUser, deleteUser } from '../api/users'
import { getRoles } from '../api/roles'
import { getPositions } from '../api/positions'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const [u, r, p] = await Promise.all([getUsers(), getRoles(), getPositions()])
      setUsers(u); setRoles(r); setPositions(p)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }

  const handleSave = async () => {
    const vals = await form.validateFields()
    try {
      if (editing) await updateUser(editing.id, vals)
      else await createUser(vals)
      message.success('ذخیره شد')
      setModalOpen(false); load()
    } catch { message.error('خطا') }
  }

  const handleDelete = async (id: number) => {
    await deleteUser(id); message.success('حذف شد'); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>مدیریت کاربران</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>کاربر جدید</Button>
      </div>
      <Table
        dataSource={users} rowKey="id" loading={loading}
        columns={[
          { title: 'نام کاربری', dataIndex: 'username' },
          { title: 'نام و نام خانوادگی', dataIndex: 'displayName' },
          { title: 'ایمیل', dataIndex: 'email' },
          { title: 'وضعیت', dataIndex: 'isActive', render: v => <Tag color={v ? 'green' : 'red'}>{v ? 'فعال' : 'غیرفعال'}</Tag> },
          {
            title: 'عملیات', render: (_, r) => (
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                <Popconfirm title="حذف شود؟" onConfirm={() => handleDelete(r.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />
      <Modal title={editing ? 'ویرایش کاربر' : 'کاربر جدید'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} okText="ذخیره" cancelText="انصراف">
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="نام کاربری" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="displayName" label="نام و نام خانوادگی" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="ایمیل">
            <Input />
          </Form.Item>
          {!editing && (
            <Form.Item name="password" label="رمز عبور" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="positionId" label="پست سازمانی">
            <Select options={positions.map(p => ({ value: p.id, label: p.title }))} allowClear />
          </Form.Item>
          <Form.Item name="isActive" label="وضعیت" initialValue={true}>
            <Select options={[{ value: true, label: 'فعال' }, { value: false, label: 'غیرفعال' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
