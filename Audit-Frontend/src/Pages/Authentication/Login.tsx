import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ClipboardList, Users, BarChart3, Eye, EyeOff } from 'lucide-react'
import api from '@/Services/api'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: ClipboardList,
    title: 'Audit Management',
    description: 'Plan, schedule, and track audits across all departments with full lifecycle visibility.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Tracking',
    description: 'Monitor compliance status in real-time and ensure regulatory standards are met.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Separate workflows for Admins, Auditors, and Employees with tailored dashboards.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Insights',
    description: 'Generate detailed reports on audit findings, corrective actions, and trends.',
  },
]

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, role } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      const routes: Record<string, string> = { Admin: '/admin', Auditor: '/auditor', Employee: '/employee' }
      navigate(routes[role] ?? '/')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-800 tracking-tight">AuditPro</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left — Hero + Features */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Audit Platform
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Streamline Your <br />
              <span className="text-blue-600">Audit Workflow</span>
            </h1>
            <p className="text-slate-500 text-base lg:text-lg max-w-lg leading-relaxed">
              A centralized platform to manage audits, track observations, assign corrective actions,
              and ensure compliance — all in one place.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login Card */}
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-800">Sign in</CardTitle>
              <CardDescription className="text-slate-500">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn('h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium', loading && 'opacity-70')}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <p className="text-center text-xs text-slate-400">
                  Having trouble? Contact your system administrator.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Role hint */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {['Admin', 'Auditor', 'Employee'].map((role) => (
              <div key={role} className="rounded-lg bg-white border border-slate-100 py-2 px-3 shadow-sm">
                <p className="text-xs font-medium text-slate-600">{role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Dashboard access</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} AuditPro — Audit Management System
      </footer>
    </div>
  )
}

export default Login
