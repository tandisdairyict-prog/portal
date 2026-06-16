import { useState, useEffect } from 'react'
import { Card, Tag, Tooltip, Spin, Empty } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getPositionTree } from '../api/positions'
import type { PositionTree } from '../types'

function OrgNode({ node, depth = 0 }: { node: PositionTree; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const colors = ['#3b5bdb', '#16a34a', '#d97706', '#7c3aed', '#0891b2']
  const color = colors[depth % colors.length]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{
        background: '#fff', border: `2px solid ${color}`, borderRadius: 12,
        padding: '12px 20px', minWidth: 160, textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,.08)', cursor: 'pointer',
        transition: 'all .2s',
      }} onClick={() => node.children.length > 0 && setExpanded(!expanded)}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a202c', marginBottom: 4 }}>{node.title}</div>
        {node.assignedUsers.map(u => (
          <Tooltip key={u.id} title={u.fullName}>
            <Tag icon={<UserOutlined />} color="blue" style={{ fontSize: 11, margin: '2px' }}>
              {u.fullName}
            </Tag>
          </Tooltip>
        ))}
        {node.children.length > 0 && (
          <div style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>
            {expanded ? '▲' : '▼'} {node.children.length} زیرمجموعه
          </div>
        )}
      </div>

      {expanded && node.children.length > 0 && (
        <>
          <div style={{ width: 2, height: 24, background: color }} />
          <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {node.children.length > 1 && (
              <div style={{
                position: 'absolute', top: 0, right: 0, left: 0,
                height: 2, background: color, zIndex: 0
              }} />
            )}
            {node.children.map(child => (
              <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 2, height: 24, background: color }} />
                <OrgNode node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function OrgChartPage() {
  const [tree, setTree] = useState<PositionTree[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPositionTree().then(setTree).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>نمودار سازمانی</div>
          <div style={{ color: '#718096', fontSize: 13 }}>ساختار سلسله‌مراتبی سازمان</div>
        </div>
      </div>

      <Card bordered={false} style={{ borderRadius: 14, overflowX: 'auto', minHeight: 400 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : tree.length === 0 ? (
          <Empty description="هیچ سمتی تعریف نشده" />
        ) : (
          <div style={{ padding: 32, overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 32 }}>
              {tree.map(node => <OrgNode key={node.id} node={node} />)}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
