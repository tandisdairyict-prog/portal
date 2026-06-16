import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getPositions, createPosition, updatePosition, deletePosition } from '../api/positions'
import { getDepartments } from '../api/departments'
import type { Position, Department } from '../types'
import type { ColumnsType } from 'antd/es/table'

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Position | null>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try { const [p, d] = await Promise.all([getPositions(), getDepartments()]); setPositions(p); setDepartments(d) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const columns: ColumnsType<Position> = [
    { title: 'عنوان سمت', dataIndex: 'title', key: 'title', render: (v: string) => <strong>{v}</strong> },
    { title: 'واحد', dataIndex: 'departmentName', key: 'departmentName' },
    { title: 'سمت مافوق', dataIndex: 'parentPositionTitle', key: 'parentPositionTitle', render: (v: string) => v || <span style={{ color: '#718096' }}>—</span> },
    { title: 'سطح', dataIndex: 'level', key: 'level', render: (v: number) => <Tag>{v}</Tag> },
    { title: 'وضعیت', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => <Tag color={v ? 'success' : 'error'}>{v ? 'فعال' : 'غیرفعال'}</Tag> },
    {
      title: 'عملیات', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(r); form.setFieldsValue(r); setModalOpen(true) }} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={async () => { await deletePosition(r.id); message.success('حذف شد'); load() }} />
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت سمت‌ها</div>
          <div style={{ color: '#718096', fontSize: 13 }}>تعریف سمت‌های سازمانی</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalOpen(true) }}>سمت جدید</Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Table columns={columns} dataSource={positions} loading={loading} rowKey="id" />
      </Card>

      <Modal title={editingItem ? 'ویرایش سمت' : 'سمت جدید'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v: Parameters<typeof createPosition>[0]) => {
          if (editingItem) await updatePosition(editingItem.id, v); else await createPosition(v)
          message.success('ذخیره شد'); setModalOpen(false); load()
        }} style={{ marginTop: 16 }}>
          <Form.Item name="departmentId" label="واحد" rules={[{ required: true }]}>
            <Select options={departments.map(d => ({ value: d.id, label: d.name }))} placeholder="انتخاب واحد" />
          </Form.Item>
          <Form.Item name="parentPositionId" label="سمت مافوق">
            <Select options={positions.map(p => ({ value: p.id, label: p.title }))} placeholder="انتخاب سمت مافوق" allowClear />
          </Form.Item>
          <Form.Item name="title" label="عنوان سمت" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea rows={2} /></Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">ذخیره</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
