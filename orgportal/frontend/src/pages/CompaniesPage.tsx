import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Space, message, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getCompanies, createCompany, deleteCompany } from '../api/companies'
import type { Company } from '../types'
import type { ColumnsType } from 'antd/es/table'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const load = async () => { setLoading(true); try { setCompanies(await getCompanies()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const columns: ColumnsType<Company> = [
    { title: 'نام شرکت', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'نام مختصر', dataIndex: 'shortName', key: 'shortName' },
    { title: 'وضعیت', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => <Tag color={v ? 'success' : 'error'}>{v ? 'فعال' : 'غیرفعال'}</Tag> },
    {
      title: 'عملیات', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(r); setModalOpen(true) }} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={async () => { await deleteCompany(r.id); message.success('حذف شد'); load() }} />
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>مدیریت شرکت‌ها</div>
          <div style={{ color: '#718096', fontSize: 13 }}>تعریف شرکت‌های سازمانی</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true) }}>شرکت جدید</Button>
      </div>
      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Table columns={columns} dataSource={companies} loading={loading} rowKey="id" />
      </Card>
      <Modal title="شرکت جدید" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v: Parameters<typeof createCompany>[0]) => { await createCompany(v); message.success('ذخیره شد'); setModalOpen(false); load() }} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="نام شرکت" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="shortName" label="نام مختصر"><Input /></Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="primary" htmlType="submit">ذخیره</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
