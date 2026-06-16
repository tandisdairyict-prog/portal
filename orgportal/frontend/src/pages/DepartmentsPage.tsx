import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getDepartments, createDepartment, deleteDepartment } from '../api/departments'
import { getCompanies } from '../api/companies'
import type { Department, Company } from '../types'
import type { ColumnsType } from 'antd/es/table'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try { const [d, c] = await Promise.all([getDepartments(), getCompanies()]); setDepartments(d); setCompanies(c) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const columns: ColumnsType<Department> = [
    { title: 'نام واحد', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'کد', dataIndex: 'code', key: 'code', render: (v: string) => <code style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: 4 }}>{v}</code> },
    { title: 'شرکت', dataIndex: 'companyName', key: 'companyName' },
    { title: 'وضعیت', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => <Tag color={v ? 'success' : 'error'}>{v ? 'فعال' : 'غیرفعال'}</Tag> },
    {
      title: 'عملیات', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(r); setModalOpen(true) }} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={async () => { await deleteDepartment(r.id); message.success('حذف شد'); load() }} />
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت واحدها</div>
          <div style={{ color: '#718096', fontSize: 13 }}>تعریف واحدهای سازمانی</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true) }}>واحد جدید</Button>
      </div>
      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Table columns={columns} dataSource={departments} loading={loading} rowKey="id" />
      </Card>
      <Modal title="واحد جدید" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v: Parameters<typeof createDepartment>[0]) => { await createDepartment(v); message.success('ذخیره شد'); setModalOpen(false); load() }} style={{ marginTop: 16 }}>
          <Form.Item name="companyId" label="شرکت" rules={[{ required: true }]}>
            <Select options={companies.map(c => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Form.Item name="parentDepartmentId" label="واحد والد">
            <Select options={departments.map(d => ({ value: d.id, label: d.name }))} allowClear />
          </Form.Item>
          <Form.Item name="name" label="نام واحد" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="کد واحد" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">ذخیره</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
