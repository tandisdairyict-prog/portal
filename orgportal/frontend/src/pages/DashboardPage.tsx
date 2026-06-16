import { Card, Row, Col, Statistic, Typography } from 'antd'
import { TeamOutlined, ApartmentOutlined, SafetyOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)

  const stats = [
    { title: 'کاربران', value: 125, icon: <TeamOutlined />, color: '#3b5bdb', bg: '#eef2ff' },
    { title: 'سمت‌ها', value: 48, icon: <ApartmentOutlined />, color: '#16a34a', bg: '#f0fdf4' },
    { title: 'نقش‌ها', value: 12, icon: <SafetyOutlined />, color: '#d97706', bg: '#fffbeb' },
    { title: 'نرم‌افزارها', value: 6, icon: <AppstoreOutlined />, color: '#7c3aed', bg: '#f5f3ff' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>خوش آمدید، {user?.fullName || 'کاربر'}</Title>
        <Text type="secondary">خلاصه وضعیت سیستم</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: s.color }}>
                  {s.icon}
                </div>
                <Statistic title={s.title} value={s.value} valueStyle={{ color: s.color, fontWeight: 700 }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="نرم‌افزارهای یکپارچه" bordered={false} style={{ borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
            {[
              { name: 'پرتال', code: 'Portal', color: '#3b5bdb', bg: '#eef2ff', icon: '🏠' },
              { name: 'فرآیند (BPM)', code: 'BPM', color: '#16a34a', bg: '#f0fdf4', icon: '⚙️' },
              { name: 'هوش تجاری (BI)', code: 'BI', color: '#d97706', bg: '#fffbeb', icon: '📊' },
              { name: 'حضور و غیاب', code: 'Attendance', color: '#0891b2', bg: '#ecfeff', icon: '📅' },
              { name: 'منابع انسانی', code: 'HR', color: '#7c3aed', bg: '#f5f3ff', icon: '👥' },
              { name: 'حسابداری', code: 'Accounting', color: '#db2777', bg: '#fdf2f8', icon: '💰' },
            ].map((app, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{app.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{app.name}</div>
                  <div style={{ color: app.color, fontSize: 12, fontFamily: 'monospace' }}>{app.code}</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="ساختار سازمانی" bordered={false} style={{ borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#718096', fontSize: 13 }}>
              <ApartmentOutlined style={{ fontSize: 48, color: '#c7d2fe', display: 'block', marginBottom: 12 }} />
              سلسله‌مراتب سازمانی را در بخش نمودار سازمانی مشاهده کنید
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
