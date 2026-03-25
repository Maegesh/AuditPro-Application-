import React, { useEffect, useState } from 'react'
import { Eye, ClipboardList } from 'lucide-react'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import { severityColors } from '@/lib/constants'
import { getAdminAudits, type Audit } from '@/Services/auditService'
import { getObservations } from '@/Services/observationService'

interface Observation {
  observationId: number; title: string; description: string; areaOrLocation: string
  finding: string; riskOrImpact: string; recommendation: string; severity: string; dueDate: string
}

const AdminObservations: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([])
  const [selectedAuditId, setSelectedAuditId] = useState<string>('')
  const [observations, setObservations] = useState<Observation[]>([])

  useEffect(() => {
    getAdminAudits().then((res) => setAudits(res.data)).catch(() => setAudits([]))
  }, [])

  useEffect(() => {
    if (selectedAuditId) {
      getObservations(Number(selectedAuditId)).then((res) => setObservations(res.data)).catch(() => setObservations([]))
    } else {
      setObservations([])
    }
  }, [selectedAuditId])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Observations</h2>
        <p className="text-slate-500 text-sm mt-0.5">View audit observations submitted by auditors.</p>
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <Label className="text-slate-700 text-sm">Select Audit</Label>
        <select value={selectedAuditId} onChange={(e) => setSelectedAuditId(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select an audit</option>
          {audits.map((a) => <option key={a.auditId} value={a.auditId}>{a.auditName} — {a.status}</option>)}
        </select>
      </div>

      {!selectedAuditId ? (
        <EmptyState icon={ClipboardList} message="Select an audit to view its observations." />
      ) : observations.length === 0 ? (
        <EmptyState icon={Eye} message="No observations found for this audit." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {observations.map((o) => (
            <Card key={o.observationId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{o.title}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${severityColors[o.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                    {o.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{o.description}</p>
                <div className="text-xs text-slate-400 flex flex-col gap-0.5 pt-1">
                  <span><span className="font-medium text-slate-600">Location:</span> {o.areaOrLocation}</span>
                  <span><span className="font-medium text-slate-600">Finding:</span> {o.finding}</span>
                  <span><span className="font-medium text-slate-600">Risk:</span> {o.riskOrImpact}</span>
                  <span><span className="font-medium text-slate-600">Recommendation:</span> {o.recommendation}</span>
                  <span><span className="font-medium text-slate-600">Due:</span> {o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminObservations
