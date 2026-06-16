import { useState, useEffect } from 'react'
import { Card, Input, Button, Select, message, Tree } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getUsers } from '../api/users'
import { getUserPermissionTree } from '../api/users'
import { setPermissionOverride, removePermissionOverride } from '../api/permissions'
import type { User, PermissionTree } from '../types'

export default function PermissionsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [permTree, setPermTree] = useState<PermissionTree[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { getUsers().then(setUsers) }, [])

  const loadPerms = async (userId: number) => {
    setSelectedUserId(userId)
    setPermTree(await getUserPermissionTree(userId))
  }

  const treeData = permTree
    .filter(app => !search || app.appName.includes(search) || app.modules.some(m => m.module.includes(search)))
    .map(app => ({
      title: <span style={{ fontWeight: 700, color: '#3b5bdb' }}>{app.appName}</span>,
      key: `app-${app.appCode}`,
      children: app.modules.map(mod => ({
        title: <span style={{ fontWeight: 600 }}>{mod.module}</span>,
        key: `mod-${app.appCode}-${mod.module}`,
        children: mod.actions.map(action => ({
          title: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: action.isGranted ? '#16a34a' : '#718096' }}>
                {action.action}
              </span>
              <span style={{ fontSize: 11, color: '#718096', fontFamily: 'monospace' }}>{action.fullName}</span>
              {action.isGranted && (
                <Button size="small" danger style={{ fontSize: 11, height: 20, lineHeight: 1 }}
                  onClick={() => selectedUserId && removePermissionOverride(selectedUserId, action.id).then(() => { message.success('حذف شد'); loadPerms(selectedUserId) })}>
                  لغو
                </Button>
              )}
              {!action.isGranted && (
                <Button size="small" type="link" style={{ fontSize: 11, height: 20, lineHeight: 1 }}
                  onClick={() => selectedUserId && setPermissionOverride(selectedUserId, action.id, true).then(() => { message.success('اعطا شد'); loadPerms(selectedUserId) })}>
                  اعطا
                </Button>
              )}
            </div>
          ),
          key: `perm-${action.id}`,
        }))
      }))
    }))

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت دسترسی‌ها</div>
        <div style={{ color: '#718096', fontSize: 13 }}>مشاهده و ویرایش دسترسی‌های کاربران</div>
      </div>

      <Card bordered={false} style={{ borderRadius: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Select
            style={{ width: 300 }}
            placeholder="انتخاب کاربر..."
            showSearch
            optionFilterProp="label"
            options={users.map(u => ({ value: u.id, label: `${u.fullName} (${u.personnelNumber || u.username})` }))}
            onChange={loadPerms}
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="جستجو در دسترسی‌ها..."
            style={{ width: 250, borderRadius: 10 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {permTree.length > 0 && (
        <Card bordered={false} style={{ borderRadius: 14 }}>
          <Tree treeData={treeData} defaultExpandAll showLine={{ showLeafIcon: false }} />
        </Card>
      )}

      {selectedUserId && permTree.length === 0 && (
        <Card bordered={false} style={{ borderRadius: 14, textAlign: 'center', padding: 40, color: '#718096' }}>
          هیچ دسترسی برای این کاربر تعریف نشده
        </Card>
      )}
    </div>
  )
}
