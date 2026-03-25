import React, { useEffect, useState } from 'react'
import { Eye, ClipboardList, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import EmptyState from '@/Components/shared/EmptyState'
import { severityColors, statusColors } from '@/lib/constants'
import { getAdminAudits, type Audit } from '@/Services/auditService'
import { getObservations } from '@/Services/observationService'
import { getCorrectiveActions } from '@/Services/correctiveActionService'
import { getEmployees, type User } from '@/Services/userService'

interface Observation {
  observationId: number; title: string; description: string; areaOrLocation: string
  finding: string; riskOrImpact: string; recommendation: string; severity: string; dueDate: string
}

interface CorrectiveAction {
  actionId: number; actionDescription: string; rootCause: string
  expectedOutcome: string; dueDate: string; status: string; assignedToUserId: number
}

const AdminCorrectiveActions: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([])
  const [selectedAuditId, setSelectedAuditId] = useState<string>('')
  const [observations, setObservations] = useState<Observation[]>([])
  const [actionsMap, setActionsMap] = useState<Record<number, CorrectiveAction[]>>({})
  const [expandedObs, setExpandedObs] = useState<number | null>(null)
  const [employees, setEmployees] = useState<User[]>([])

  useEffect(() => {
    getAdminAudits().then((res) => setAudits(res.data)).catch(() => setAudits([]))
    getEmployees().then((res) => setEmployees(res.data)).catch(() => setEmployees([]))
  }, [])

  useEffect(() => {
    if (selectedAuditId) {
      getObservations(Number(selectedAuditId))
        .then((res) => {
          setObservations(res.data)
          setActionsMap({})
          setExpandedObs(null)
          res.data.forEach((o: Observation) => loadActions(o.observationId))
        })
        .catch(() => setObservations([]))
    } else {
      setObservations([])
      setActionsMap({})
    }
  }, [selectedAuditId])

  const loadActions = (observationId: number) => {
    getCorrectiveActions(observationId)
      .then((res) => setActionsMap((prev) => ({ ...prev, [observationId]: res.data })))
      .catch(() => setActionsMap((prev) => ({ ...prev, [observationId]: [] })))
  }

  const toggleExpand = (observationId: number) => {
    setExpandedObs((prev) => (prev === observationId ? null : observationId))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Corrective Actions</h2>
        <p className="text-slate-500 text-sm mt-0.5">View corrective actions assigned across all audit observations.</p>
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
        <EmptyState icon={ClipboardList} message="Select an audit to view its corrective actions." />
      ) : observations.length === 0 ? (
        <EmptyState icon={Eye} message="No observations found for this audit." />
      ) : (
        <div className="flex flex-col gap-4">
          {observations.map((o) => (
            <Card key={o.observationId} className="border-slate-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{o.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{o.description}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${severityColors[o.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                    {o.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-2 gap-1">
                  <span><span className="font-medium text-slate-600">Location:</span> {o.areaOrLocation}</span>
                  <span><span className="font-medium text-slate-600">Due:</span> {o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}</span>
                  <span><span className="font-medium text-slate-600">Finding:</span> {o.finding}</span>
                  <span><span className="font-medium text-slate-600">Risk:</span> {o.riskOrImpact}</span>
                  <span className="col-span-2"><span className="font-medium text-slate-600">Recommendation:</span> {o.recommendation}</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                  <button
                    onClick={() => toggleExpand(o.observationId)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors w-fit"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                    Corrective Actions ({actionsMap[o.observationId]?.length ?? 0})
                    {expandedObs === o.observationId ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {expandedObs === o.observationId && (
                    <div className="flex flex-col gap-2 mt-1">
                      {!actionsMap[o.observationId] || actionsMap[o.observationId].length === 0 ? (
                        <p className="text-xs text-slate-400 pl-1">No corrective actions assigned yet.</p>
                      ) : (
                        actionsMap[o.observationId].map((ca) => {
                          const emp = employees.find((e) => e.userId === ca.assignedToUserId)
                          return (
                            <div key={ca.actionId} className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 text-xs">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-700">{ca.actionDescription}</p>
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[ca.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                  {ca.status}
                                </span>
                              </div>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Assigned to:</span> {emp?.name ?? `User #${ca.assignedToUserId}`}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Root Cause:</span> {ca.rootCause}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Expected Outcome:</span> {ca.expectedOutcome}</p>
                              <p className="text-slate-500"><span className="font-medium text-slate-600">Due:</span> {ca.dueDate ? new Date(ca.dueDate).toLocaleDateString() : '—'}</p>
                            </div>
                          )
                        })
                      )}
                    </div>
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

export default AdminCorrectiveActions
