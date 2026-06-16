import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Space, message, Card, Drawer } from 'antd'
import { PlusOutlined, EditOutlined, CopyOutlined, KeyOutlined } from '@ant-design/icons'
import { getRoles, createRole, cloneRole, getRole, assignRolePermissions } from '../api/roles'
import { getPermissionTree } from '../api/permissions'
import type { Role, PermissionTree } from '../types'
import type { ColumnsType } from 'antd/es/table'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [permDrawer, setPermDrawer] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [permTree, setPermTree] = useState<PermissionTree[]>([])
  const [checkedPerms, setCheckedPerms] = useState<Set<number>>(new Set())
  const [form] = Form.useForm()
  const [cloneForm] = Form.useForm()
  const [cloneModal, setCloneModal] = useState(false)

  const load = async () => { setLoading(true); try { setRoles(await getRoles()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openPermDrawer = async (role: Role) => {
    setSelectedRole(role)
    const [full, tree] = await Promise.all([getRole(role.id), getPermissionTree()])
    setPermTree(tree)
    setCheckedPerms(new Set(full.permissions.map(p => p.id)))
    setPermDrawer(true)
  }

  const savePermissions = async () => {
    if (!selectedRole) return
    try {
      await assignRolePermissions(selectedRole.id, [...checkedPerms])
      message.success('دسترسی‌ها ذخیره شد')
      setPermDrawer(false)
    } catch { message.error('خطا در ذخیره') }
  }

  const togglePerm = (id: number) => {
    setCheckedPerms(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  const toggleModule = (actions: { id: number }[], allChecked: boolean) => {
    setCheckedPerms(prev => {
      const s = new Set(prev)
      if (allChecked) actions.forEach(a => s.delete(a.id))
      else actions.forEach(a => s.add(a.id))
      return s
    })
  }

  const columns: ColumnsType<Role> = [
    { title: 'نام نقش', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'توضیحات', dataIndex: 'description', key: 'description' },
    { title: 'وضعیت', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => <Tag color={v ? 'success' : 'error'}>{v ? 'فعال' : 'غیرفعال'}</Tag> },
    {
      title: 'عملیات', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<KeyOutlined />} onClick={() => openPermDrawer(r)}>دسترسی‌ها</Button>
          <Button size="small" icon={<CopyOutlined />} onClick={() => { setSelectedRole(r); setCloneModal(true) }}>کپی</Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(r); setModalOpen(true) }} />
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت نقش‌ها</div>
          <div style={{ color: '#718096', fontSize: 13 }}>تعریف نقش و تخصیص دسترسی</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true) }}>نقش جدید</Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Table columns={columns} dataSource={roles} loading={loading} rowKey="id" />
      </Card>

      <Modal title="نقش جدید" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v: { name: string; description?: string }) => { await createRole(v); message.success('نقش ایجاد شد'); setModalOpen(false); load() }} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="نام نقش" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea rows={2} /></Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">ذخیره</Button>
          </div>
        </Form>
      </Modal>

      <Modal title="کپی نقش" open={cloneModal} onCancel={() => setCloneModal(false)} footer={null}>
        <Form form={cloneForm} layout="vertical" onFinish={async (v: { newName: string }) => { if (selectedRole) { await cloneRole(selectedRole.id, v.newName); message.success('نقش کپی شد'); setCloneModal(false); load() } }} style={{ marginTop: 16 }}>
          <Form.Item name="newName" label="نام نقش جدید" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCloneModal(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">کپی</Button>
          </div>
        </Form>
      </Modal>

      <Drawer title={`دسترسی‌های نقش: ${selectedRole?.name}`} open={permDrawer} onClose={() => setPermDrawer(false)} width={480} footer={<Button type="primary" onClick={savePermissions} block>ذخیره دسترسی‌ها</Button>}>
        {permTree.map(app => (
          <div key={app.appCode} style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, padding: '8px 0', borderBottom: '2px solid #eef2ff', marginBottom: 8, color: '#3b5bdb' }}>
              {app.appName}
            </div>
            {app.modules.map(mod => {
              const allChecked = mod.actions.every(a => checkedPerms.has(a.id))
              return (
                <div key={mod.module} style={{ marginBottom: 12, paddingRight: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input type="checkbox" checked={allChecked} onChange={() => toggleModule(mod.actions, allChecked)} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{mod.module}</span>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    {mod.actions.map(action => (
                      <div key={action.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <input type="checkbox" checked={checkedPerms.has(action.id)} onChange={() => togglePerm(action.id)} />
                        <span style={{ fontSize: 13 }}>{action.action}</span>
                        <span style={{ fontSize: 11, color: '#718096', fontFamily: 'monospace' }}>{action.fullName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </Drawer>
    </div>
  )
}
