import { NavLink, Outlet } from 'react-router-dom'
import { BriefcaseBusiness, CalendarDays, ChartNoAxesColumnIncreasing, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { logout } from '../../services/authService'

const items = [{to:'/', label:'Overview', icon:ChartNoAxesColumnIncreasing},{to:'/applications',label:'Applications',icon:BriefcaseBusiness},{to:'/calendar',label:'Calendar',icon:CalendarDays},{to:'/settings',label:'Settings',icon:Settings}]
export default function AppShell() {
  const { user } = useAuth()
  const nav = <>{items.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === '/'}><Icon size={20}/><span>{label}</span></NavLink>)}</>
  return <div className="shell"><aside><div className="brand"><span className="brandmark"><BriefcaseBusiness/></span><span>ApplyJobz</span></div><nav>{nav}</nav><div className="account"><div className="avatar">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</div><div><strong>{user?.displayName || 'Job seeker'}</strong><small>{user?.email}</small></div><button className="icon-btn" onClick={logout} aria-label="Logout"><LogOut size={18}/></button></div></aside><main><Outlet/></main><nav className="mobile-nav">{nav}</nav></div>
}
