import React, { useState } from 'react'
import { User, KeyRound, Briefcase, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { updateProfile } from '@/Services/userService'

const Profile: React.FC = () => {
  const currentName = localStorage.getItem('name') ?? ''
  const role = localStorage.getItem('role') ?? ''

  const [form, setForm] = useState({ name: currentName, expertise: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [confirmError, setConfirmError] = useState('')

  const PASSWORD_RULES = [
    { regex: /.{8,}/, message: 'At least 8 characters' },
    { regex: /[A-Z]/, message: 'At least one uppercase letter' },
    { regex: /[a-z]/, message: 'At least one lowercase letter' },
    { regex: /[0-9]/, message: 'At least one number' },
    { regex: /[^A-Za-z0-9]/, message: 'At least one special character' },
  ]

  const validatePassword = (value: string) =>
    value ? PASSWORD_RULES.filter((r) => !r.regex.test(value)).map((r) => r.message) : []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'password') {
      setPasswordErrors(validatePassword(value))
      setConfirmError(form.confirmPassword && value !== form.confirmPassword ? 'Passwords do not match.' : '')
    }
    if (name === 'confirmPassword') {
      setConfirmError(value !== form.password ? 'Passwords do not match.' : '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(false)

    if (!form.name.trim()) { setError('Name is required.'); return }

    const nameChanged = form.name.trim() !== currentName
    const expertiseChanged = form.expertise.trim() !== ''
    const passwordChanged = form.password !== ''

    if (!nameChanged && !expertiseChanged && !passwordChanged) {
      setError('No changes made. Update at least one field.'); return
    }

    if (passwordChanged) {
      const errs = validatePassword(form.password)
      if (errs.length > 0) { setPasswordErrors(errs); return }
      if (form.password !== form.confirmPassword) { setConfirmError('Passwords do not match.'); return }
    }

    setLoading(true)
    try {
      const payload: { name?: string; password?: string; expertise?: string } = {}
      if (nameChanged) payload.name = form.name.trim()
      if (expertiseChanged) payload.expertise = form.expertise.trim()
      if (passwordChanged) payload.password = form.password

      await updateProfile(payload)
      localStorage.setItem('name', form.name.trim())
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const initials = currentName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 text-sm mt-0.5">Update your name, expertise, and password.</p>
      </div>

      {/* Avatar card */}
      <Card className="border-slate-200">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{currentName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{role}</p>
          </div>
        </CardContent>
      </Card>

      {/* Update form */}
      <Card className="border-slate-200">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </Label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="h-10" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-slate-700 text-sm flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Expertise
              </Label>
              <Input name="expertise" value={form.expertise} onChange={handleChange} placeholder="e.g. Financial Audit, IT Compliance" className="h-10" />
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Change Password
              </p>
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">New Password</Label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create new password" className="h-10" />
                {form.password && passwordErrors.length > 0 && (
                  <ul className="flex flex-col gap-0.5 mt-1">
                    {PASSWORD_RULES.map((r) => {
                      const passed = r.regex.test(form.password)
                      return (
                        <li key={r.message} className={`text-xs flex items-center gap-1.5 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
                          <span>{passed ? '✓' : '✗'}</span> {r.message}
                        </li>
                      )
                    })}
                  </ul>
                )}
                {form.password && passwordErrors.length === 0 && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1"><span>✓</span> Password looks good</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-700 text-sm">Confirm New Password</Label>
                <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat new password" className="h-10" />
                {confirmError && <p className="text-xs text-red-500">{confirmError}</p>}
                {form.confirmPassword && !confirmError && <p className="text-xs text-emerald-600 flex items-center gap-1"><span>✓</span> Passwords match</p>}
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>}

            {success && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Profile updated successfully.
              </div>
            )}

            <Button type="submit" disabled={loading} className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
