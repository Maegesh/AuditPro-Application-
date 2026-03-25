import React, { useEffect, useState } from 'react'
import { ClipboardList, Calendar, Send, PlusCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import { statusColors } from '@/lib/constants'
import { getAuditorAudits, submitAudit, type Audit } from '@/Services/auditService'
import { getObservations } from '@/Services/observationService'
import { getCorrectiveActions } from '@/Services/correctiveActionService'
import { useNavigate } from 'react-router-dom'

interface ActionSummary { total: number; resolved: number }

const AuditorAudits: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([])
  const [submitting, setSubmitting] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState<string>('')
  const [actionSummary, setActionSummary] = useState<Record<number, ActionSummary>>({})
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  const fetchActionSummaries = async (auditList: Audit[]) => {
    const summaries: Record<number, ActionSummary> = {}
    await Promise.all(auditList.map(async (a) => {
      try {
        const obsRes = await getObservations(a.auditId)
        const observations = obsRes.data
        let total = 0, resolved = 0
        await Promise.all(observations.map(async (o: any) => {
          const actRes = await getCorrectiveActions(o.observationId)
          const actions = actRes.data
          total += actions.length
          resolved += actions.filter((ca: any) => ca.status === 'Resolved').length
        }))
        summaries[a.auditId] = { total, resolved }
      } catch {
        summaries[a.auditId] = { total: 0, resolved: 0 }
      }
    }))
    setActionSummary(summaries)
  }

  const loadAll = async () => {
    const res = await getAuditorAudits().catch(() => ({ data: [] }))
    setAudits(res.data)
    await fetchActionSummaries(res.data)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAll()
    setRefreshing(false)
  }

  useEffect(() => { loadAll() }, [])

  const handleSubmit = async (auditId: number) => {
    setSubmitting(auditId)
    setSubmitError('')
    try {
      await submitAudit(auditId)
      await loadAll()
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? 'Cannot submit audit.')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Audits</h2>
          <p className="text-slate-500 text-sm mt-0.5">View your assigned audits, add observations, and submit for approval.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {submitError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{submitError}</p>
      )}

      {audits.length === 0 ? (
        <EmptyState icon={ClipboardList} message="No audits assigned to you yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {audits.map((a) => (
            <Card key={a.auditId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{a.auditName}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{a.startDate ?? '—'} → {a.endDate ?? '—'}</span>
                </div>

                {actionSummary[a.auditId] && (
                  <div className="text-xs">
                    {actionSummary[a.auditId].total === 0 ? (
                      <span className="text-amber-600">No corrective actions assigned yet</span>
                    ) : actionSummary[a.auditId].resolved === actionSummary[a.auditId].total ? (
                      <span className="text-emerald-600 font-medium">✓ All {actionSummary[a.auditId].total} actions resolved</span>
                    ) : (
                      <span className="text-amber-600">{actionSummary[a.auditId].resolved}/{actionSummary[a.auditId].total} actions resolved</span>
                    )}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate(`/auditor/observations?auditId=${a.auditId}`)}>
                    <PlusCircle className="w-3.5 h-3.5" /> Add Observation
                  </Button>
                  {(a.status === 'InProgress' || a.status === 'Scheduled') && (
                    <Button size="sm" className="flex-1 h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSubmit(a.auditId)} disabled={submitting === a.auditId}>
                      <Send className="w-3.5 h-3.5" />
                      {submitting === a.auditId ? 'Submitting...' : 'Submit'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditorAudits
