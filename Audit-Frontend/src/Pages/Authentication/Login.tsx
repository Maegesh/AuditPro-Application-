import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, ClipboardList, Users, BarChart3,
  Eye, EyeOff, CheckCircle2, ArrowRight, Lock, Mail,
} from 'lucide-react'
import api from '@/Services/api'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { cn } from '@/lib/utils'

const features = [
  { icon: ClipboardList, text: 'End-to-end audit lifecycle management' },
  { icon: ShieldCheck,   text: 'Real-time compliance & risk tracking' },
  { icon: Users,         text: 'Role-based access for every stakeholder' },
  { icon: BarChart3,     text: 'Actionable reports & analytics' },
]

const stats = [
  { value: '10K+', label: 'Audits Completed' },
  { value: '98%',  label: 'Compliance Rate' },
  { value: '500+', label: 'Organizations' },
]

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, role, name } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('name', name ?? '')
      const routes: Record<string, string> = { Admin: '/admin', Auditor: '/auditor', Employee: '/employee' }
      navigate(routes[role] ?? '/')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden bg-[#0f1c3f] px-14 py-12">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none tracking-tight">AuditPro</p>
            <p className="text-blue-300 text-[11px] tracking-widest uppercase">Enterprise Suite</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Trusted by audit teams worldwide
            </span>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Audit smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Stay compliant.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              A unified platform to plan, execute, and close audits — with full visibility across
              departments, findings, and corrective actions.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto flex-shrink-0" />
              </li>
            ))}
          </ul>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit SSL encrypted · SOC 2 compliant · GDPR ready</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-slate-50">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">AuditPro</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-[400px] flex flex-col gap-8">

            {/* Heading */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to your AuditPro account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-9 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                    Password
                  </Label>
                 
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-9 pr-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-slate-900"
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

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <span className="mt-0.5 flex-shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  'h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-600/20',
                  loading && 'opacity-70 cursor-not-allowed'
                )}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">Access levels</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Role badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'Admin',    color: 'bg-purple-50 border-purple-100 text-purple-700' },
                { role: 'Auditor',  color: 'bg-blue-50 border-blue-100 text-blue-700' },
                { role: 'Employee', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
              ].map(({ role, color }) => (
                <div key={role} className={cn('rounded-lg border px-3 py-2.5 text-center', color)}>
                  <p className="text-xs font-semibold">{role}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">Portal access</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} AuditPro. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Lock className="w-3 h-3" />
            <span>Secure login</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
