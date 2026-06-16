import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getPositions, createPosition, updatePosition, deletePosition } from '../api/positions'
import { getDepartments } from '../api/departments'

export default function PositionsPage() {
  const [data, setData] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try { const [p, d] = await Promise.all([getPositions(), getDepartments()]); setData(p); setDepartments(d) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    const vals = await form.validateFields()
    try {
      if (editing) await updatePosition(editing.id, vals); else await createPosition(vals)
      message.success('ذخیره شد'); setOpen(false); load()
    } catch { message.error('خطا') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>پست‌های سازمانی</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true) }}>جدید</Button>
      </div>
      <Table dataSource={data} rowKey="id" loading={loading} columns={[
        { title: 'عنوان', dataIndex: 'title' },
        { title: 'کد', dataIndex: 'code' },
        { title: 'دپارتمان', dataIndex: 'departmentName' },
        { title: 'پست والد', dataIndex: 'parentPositionTitle' },
        { title: 'عملیات', render: (_, r) => <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true) }} />
          <Popconfirm title="حذف؟" onConfirm={async () => { await deletePosition(r.id); load() }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space> }
      ]} />
      <Modal title={editing ? 'ویرایش' : 'جدید'} open={open} onOk={save} onCancel={() => setOpen(false)} okText="ذخیره" cancelText="انصراف">
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="عنوان" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="کد" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="departmentId" label="دپارتمان" rules={[{ required: true }]}>
            <Select options={departments.map(d => ({ value: d.id, label: d.name }))} />
          </Form.Item>
          <Form.Item name="parentPositionId" label="پست والد">
            <Select options={data.filter(p => p.id !== editing?.id).map(p => ({ value: p.id, label: p.title }))} allowClear />
          </Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
