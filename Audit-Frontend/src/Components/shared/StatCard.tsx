import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/Components/ui/card'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => (
  <Card className="border-slate-200">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </CardContent>
  </Card>
)

export default StatCard
