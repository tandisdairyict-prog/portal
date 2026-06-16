import { Form, Input, Button, Typography, Space, Alert } from 'antd'
import { UserOutlined, LockOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true); setError('')
    try {
      const res = await login(values.username, values.password)
      setAuth(res.token, res.user)
      navigate('/')
    } catch {
      setError('نام کاربری یا رمز عبور اشتباه است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)',
    }}>
      <div style={{ display: 'flex', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(59,91,219,.15)', maxWidth: 800, width: '100%' }}>
        {/* Left panel */}
        <div style={{
          flex: 1, background: 'linear-gradient(145deg, #1e2a4a 0%, #3b5bdb 100%)',
          padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff',
        }}>
          <div>
            <Space style={{ marginBottom: 40 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppstoreOutlined style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>پرتال سازمانی</div>
                <div style={{ opacity: .65, fontSize: 12 }}>Enterprise Portal</div>
              </div>
            </Space>
            <Title level={2} style={{ color: '#fff', lineHeight: 1.4 }}>یک پرتال،<br/>تمام نرم‌افزارها</Title>
            <Text style={{ color: 'rgba(255,255,255,.75)', fontSize: 14, lineHeight: 1.7 }}>
              با یک بار ورود به تمام سیستم‌های سازمانی دسترسی داشته باشید.
            </Text>
            <div style={{ marginTop: 32 }}>
              {[
                { icon: '🏢', text: 'مدیریت ساختار سازمانی' },
                { icon: '👥', text: 'مدیریت کاربران و نقش‌ها' },
                { icon: '🔐', text: 'مدیریت دسترسی‌های دقیق' },
                { icon: '📊', text: 'پشتیبانی از BPM، BI، HR و ...' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, opacity: .85 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <Text style={{ color: 'rgba(255,255,255,.85)', fontSize: 13 }}>{item.text}</Text>
                </div>
              ))}
            </div>
          </div>
          <Text style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>© پرتال سازمانی — تمام حقوق محفوظ است</Text>
        </div>

        {/* Right form */}
        <div style={{ width: 380, background: '#fff', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Title level={3} style={{ marginBottom: 4 }}>ورود به حساب</Title>
          <Text type="secondary" style={{ fontSize: 13, marginBottom: 28, display: 'block' }}>اطلاعات کاربری خود را وارد کنید</Text>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 10 }} />}

          <Form onFinish={onFinish} layout="vertical" size="large">
            <Form.Item name="username" label="نام کاربری" rules={[{ required: true, message: 'نام کاربری الزامی است' }]}>
              <Input prefix={<UserOutlined />} placeholder="نام کاربری یا شماره پرسنلی" style={{ borderRadius: 10 }} />
            </Form.Item>
            <Form.Item name="password" label="رمز عبور" rules={[{ required: true, message: 'رمز عبور الزامی است' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="رمز عبور یا کد ملی" style={{ borderRadius: 10 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 46, borderRadius: 12, fontSize: 15, fontWeight: 600 }}>
              ورود به سیستم
            </Button>
          </Form>

          <div style={{ marginTop: 24 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>روش‌های ورود:</Text>
            {[
              { title: 'اکتیو دایرکتوری (AD)', desc: 'نام کاربری شبکه + رمز AD' },
              { title: 'ورود محلی', desc: 'شماره پرسنلی + کدملی به عنوان رمز' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e8edf5', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{m.title}</div>
                <div style={{ color: '#718096', fontSize: 12 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
