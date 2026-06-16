import { useEffect, useState } from 'react'
import { Select, Card, Tree, Tag, Space, message, Button } from 'antd'
import { getUsers, getUserPermissions, updateUserOverrides } from '../api/users'
import { getPermissionTree } from '../api/permissions'

export default function PermissionsPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [permTree, setPermTree] = useState<any[]>([])
  const [effectivePerms, setEffectivePerms] = useState<string[]>([])
  const [grantedKeys, setGrantedKeys] = useState<any[]>([])
  const [deniedKeys, setDeniedKeys] = useState<any[]>([])
  const [allPermIds, setAllPermIds] = useState<number[]>([])

  useEffect(() => {
    getUsers().then(setUsers)
    getPermissionTree().then(tree => {
      const buildTree = (apps: any[]): any[] =>
        apps.map(app => ({
          title: app.name, key: `app-${app.id}`,
          children: (app.modules || []).map((mod: any) => ({
            title: mod.name, key: `mod-${mod.name}`,
            children: (mod.permissions || []).map((p: any) => ({ title: `${p.action} (${p.name})`, key: `perm-${p.id}`, isLeaf: true }))
          }))
        }))
      setPermTree(buildTree(tree))
      const ids: number[] = []
      tree.forEach((a: any) => a.modules?.forEach((m: any) => m.permissions?.forEach((p: any) => ids.push(p.id)))
      )
      setAllPermIds(ids)
    })
  }, [])

  const loadUserPerms = async (userId: number) => {
    const data = await getUserPermissions(userId)
    setEffectivePerms(data.effectivePermissions || [])
    setGrantedKeys((data.grantedOverrides || []).map((p: any) => `perm-${p.id}`))
    setDeniedKeys((data.deniedOverrides || []).map((p: any) => `perm-${p.id}`))
  }

  const onUserChange = (id: number) => { setSelectedUser(id); loadUserPerms(id) }

  const saveOverrides = async () => {
    if (!selectedUser) return
    const granted = grantedKeys.filter((k: string) => k.startsWith('perm-')).map((k: string) => parseInt(k.replace('perm-', '')))
    const denied = deniedKeys.filter((k: string) => k.startsWith('perm-')).map((k: string) => parseInt(k.replace('perm-', '')))
    await updateUserOverrides(selectedUser, { grantedPermissionIds: granted, deniedPermissionIds: denied })
    message.success('ذخیره شد')
    loadUserPerms(selectedUser)
  }

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>مدیریت دسترسی‌های کاربر</h2>
      <Select
        style={{ width: 300, marginBottom: 24 }}
        placeholder="انتخاب کاربر"
        options={users.map(u => ({ value: u.id, label: u.displayName || u.username }))}
        onChange={onUserChange}
      />
      {selectedUser && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Card title="دسترسی‌های اعطاشده (Override)">
            <Tree checkable treeData={permTree} checkedKeys={grantedKeys} onCheck={setGrantedKeys} defaultExpandAll />
          </Card>
          <Card title="دسترسی‌های مسدودشده (Override)">
            <Tree checkable treeData={permTree} checkedKeys={deniedKeys} onCheck={setDeniedKeys} defaultExpandAll />
          </Card>
          <Card title="دسترسی‌های مؤثر (نهایی)">
            <Space wrap>
              {effectivePerms.map(p => <Tag key={p} color="blue">{p}</Tag>)}
            </Space>
          </Card>
        </div>
      )}
      {selectedUser && (
        <Button type="primary" style={{ marginTop: 16 }} onClick={saveOverrides}>ذخیره تغییرات</Button>
      )}
    </div>
  )
}
