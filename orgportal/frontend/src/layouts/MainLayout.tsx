import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Typography, Badge, Space } from 'antd'
import {
  HomeOutlined, TeamOutlined, SafetyOutlined, ApartmentOutlined,
  BankOutlined, BellOutlined, UserOutlined,
  LogoutOutlined, KeyOutlined, AppstoreOutlined
} from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'خانه' },
  { key: 'org', icon: <ApartmentOutlined />, label: 'سازمان', children: [
    { key: '/companies', icon: <BankOutlined />, label: 'شرکت‌ها' },
    { key: '/departments', icon: <AppstoreOutlined />, label: 'واحدها' },
    { key: '/positions', icon: <ApartmentOutlined />, label: 'سمت‌ها' },
    { key: '/org-chart', icon: <ApartmentOutlined />, label: 'نمودار سازمانی' },
  ]},
  { key: 'users', icon: <TeamOutlined />, label: 'مدیریت کاربران', children: [
    { key: '/users', icon: <UserOutlined />, label: 'کاربران' },
    { key: '/roles', icon: <KeyOutlined />, label: 'نقش‌ها' },
    { key: '/permissions', icon: <SafetyOutlined />, label: 'دسترسی‌ها' },
  ]},
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'پروفایل' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'خروج', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') { logout(); navigate('/login') }
    },
  }

  return (
    <Layout style={{ minHeight: '100vh', direction: 'rtl' }}>
      <Sider
        width={220}
        style={{
          background: '#1e2a4a',
          position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 100,
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <Space>
            <div style={{ width: 36, height: 36, background: '#3b5bdb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppstoreOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>پرتال سازمانی</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>Enterprise Portal</div>
            </div>
          </Space>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['org', 'users']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#1e2a4a', border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginRight: 220 }}>
        <Header style={{
          background: '#fff', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #e8edf5', position: 'sticky', top: 0, zIndex: 99,
          height: 64,
        }}>
          <Text style={{ fontSize: 15, fontWeight: 600 }}>
            {menuItems.flatMap(m => 'children' in m ? m.children ?? [] : [m]).find(m => m.key === location.pathname)?.label || 'خانه'}
          </Text>
          <Space size="middle">
            <Badge count={3}>
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#718096' }} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomLeft">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ background: '#3b5bdb' }} icon={<UserOutlined />} size={34} />
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.fullName || 'کاربر'}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>مدیر سیستم</div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
