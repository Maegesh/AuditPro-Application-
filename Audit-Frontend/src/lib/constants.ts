export const severityColors: Record<string, string> = {
  Low: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-red-50 text-red-700',
}

export const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-700',
  InProgress: 'bg-amber-50 text-amber-700',
  PendingApproval: 'bg-violet-50 text-violet-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Open: 'bg-blue-50 text-blue-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
}

export const roleColors: Record<string, string> = {
  Auditor: 'bg-blue-50 text-blue-700',
  Employee: 'bg-violet-50 text-violet-700',
}
