import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/companies'

export default function CompaniesPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const load = async () => { setLoading(true); try { setData(await getCompanies()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const save = async () => {
    const vals = await form.validateFields()
    try {
      if (editing) await updateCompany(editing.id, vals); else await createCompany(vals)
      message.success('ذخیره شد'); setOpen(false); load()
    } catch { message.error('خطا') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>شرکت‌ها</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true) }}>جدید</Button>
      </div>
      <Table dataSource={data} rowKey="id" loading={loading} columns={[
        { title: 'نام', dataIndex: 'name' },
        { title: 'کد', dataIndex: 'code' },
        { title: 'توضیحات', dataIndex: 'description' },
        { title: 'عملیات', render: (_, r) => <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true) }} />
          <Popconfirm title="حذف؟" onConfirm={async () => { await deleteCompany(r.id); load() }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space> }
      ]} />
      <Modal title={editing ? 'ویرایش' : 'جدید'} open={open} onOk={save} onCancel={() => setOpen(false)} okText="ذخیره" cancelText="انصراف">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="نام" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="کد" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="توضیحات"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
