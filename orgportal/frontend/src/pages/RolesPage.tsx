import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Drawer, Tree } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons'
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, setRolePermissions } from '../api/roles'
import { getPermissionTree } from '../api/permissions'

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [permTree, setPermTree] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any[]>([])

  const load = async () => {
    setLoading(true)
    try { setRoles(await getRoles()) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openPerms = async (role: any) => {
    setSelectedRole(role)
    const [tree, current] = await Promise.all([getPermissionTree(), getRolePermissions(role.id)])
    const treeData = buildTreeData(tree)
    setPermTree(treeData)
    setCheckedKeys(current.map((p: any) => `perm-${p.id}`))
    setDrawerOpen(true)
  }

  const buildTreeData = (apps: any[]): any[] =>
    apps.map(app => ({
      title: app.name, key: `app-${app.id}`,
      children: (app.modules || []).map((mod: any) => ({
        title: mod.name, key: `mod-${app.id}-${mod.name}`,
        children: (mod.permissions || []).map((p: any) => ({
          title: p.action, key: `perm-${p.id}`, isLeaf: true
        }))
      }))
    }))

  const savePerms = async () => {
    const ids = checkedKeys.filter((k: string) => k.startsWith('perm-')).map((k: string) => parseInt(k.replace('perm-', '')))
    await setRolePermissions(selectedRole.id, ids)
    message.success('دسترسی‌ها ذخیره شد')
    setDrawerOpen(false)
  }

  const handleSave = async () => {
    const vals = await form.validateFields()
    try {
      if (editing) await updateRole(editing.id, vals)
      else await createRole(vals)
      message.success('ذخیره شد'); setModalOpen(false); load()
    } catch { message.error('خطا') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>مدیریت نقش‌ها</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true) }}>نقش جدید</Button>
      </div>
      <Table dataSource={roles} rowKey="id" loading={loading} columns={[
        { title: 'نام نقش', dataIndex: 'name' },
        { title: 'توضیحات', dataIndex: 'description' },
        {
          title: 'عملیات', render: (_, r) => (
            <Space>
              <Button size="small" icon={<SettingOutlined />} onClick={() => openPerms(r)}>دسترسی‌ها</Button>
              <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }} />
              <Popconfirm title="حذف شود؟" onConfirm={async () => { await deleteRole(r.id); load() }}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )
        }
      ]} />
      <Modal title={editing ? 'ویرایش نقش' : 'نقش جدید'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} okText="ذخیره" cancelText="انصراف">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="نام نقش" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
      <Drawer title={`دسترسی‌های نقش: ${selectedRole?.name}`} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={400}
        footer={<Button type="primary" onClick={savePerms}>ذخیره</Button>}>
        <Tree checkable treeData={permTree} checkedKeys={checkedKeys} onCheck={setCheckedKeys} defaultExpandAll />
      </Drawer>
    </div>
  )
}
