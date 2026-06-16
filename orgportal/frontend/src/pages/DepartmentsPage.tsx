import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departments'
import { getCompanies } from '../api/companies'

export default function DepartmentsPage() {
  const [data, setData] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try { const [d, c] = await Promise.all([getDepartments(), getCompanies()]); setData(d); setCompanies(c) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    const vals = await form.validateFields()
    try {
      if (editing) await updateDepartment(editing.id, vals); else await createDepartment(vals)
      message.success('ذخیره شد'); setOpen(false); load()
    } catch { message.error('خطا') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>دپارتمان‌ها</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true) }}>جدید</Button>
      </div>
      <Table dataSource={data} rowKey="id" loading={loading} columns={[
        { title: 'نام', dataIndex: 'name' },
        { title: 'کد', dataIndex: 'code' },
        { title: 'شرکت', dataIndex: 'companyName' },
        { title: 'دپارتمان والد', dataIndex: 'parentDepartmentName' },
        { title: 'عملیات', render: (_, r) => <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true) }} />
          <Popconfirm title="حذف؟" onConfirm={async () => { await deleteDepartment(r.id); load() }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space> }
      ]} />
      <Modal title={editing ? 'ویرایش' : 'جدید'} open={open} onOk={save} onCancel={() => setOpen(false)} okText="ذخیره" cancelText="انصراف">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="نام" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="کد" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="companyId" label="شرکت" rules={[{ required: true }]}>
            <Select options={companies.map(c => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Form.Item name="parentDepartmentId" label="دپارتمان والد">
            <Select options={data.filter(d => d.id !== editing?.id).map(d => ({ value: d.id, label: d.name }))} allowClear />
          </Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
