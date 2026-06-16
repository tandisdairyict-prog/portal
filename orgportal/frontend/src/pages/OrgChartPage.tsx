import { useEffect, useState } from 'react'
import { Card, Spin, Tag } from 'antd'
import { getOrgChart } from '../api/orgchart'

interface OrgNode {
  id: number
  title: string
  departmentName?: string
  assignedUserName?: string
  children?: OrgNode[]
}

function OrgNodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card
        size="small"
        style={{ minWidth: 160, textAlign: 'center', cursor: hasChildren ? 'pointer' : 'default', borderColor: depth === 0 ? '#3b5bdb' : '#d9d9d9' }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div style={{ fontWeight: 600, fontSize: 13 }}>{node.title}</div>
        {node.departmentName && <div style={{ fontSize: 11, color: '#888' }}>{node.departmentName}</div>}
        {node.assignedUserName && <Tag color="blue" style={{ marginTop: 4, fontSize: 11 }}>{node.assignedUserName}</Tag>}
        {hasChildren && <div style={{ fontSize: 10, color: '#3b5bdb', marginTop: 4 }}>{expanded ? '▲' : '▼'} {node.children!.length}</div>}
      </Card>
      {hasChildren && expanded && (
        <div style={{ marginTop: 8, display: 'flex', gap: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', width: '100%', height: 1, background: '#d9d9d9', transform: 'translateX(-50%)' }} />
          {node.children!.map(child => (
            <OrgNodeCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrgChartPage() {
  const [data, setData] = useState<OrgNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrgChart().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: 24 }}>چارت سازمانی</h2>
      <div style={{ overflowX: 'auto', padding: '24px 0' }}>
        {data ? <OrgNodeCard node={data} /> : <p>داده‌ای یافت نشد</p>}
      </div>
    </div>
  )
}
