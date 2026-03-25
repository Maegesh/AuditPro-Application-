import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'

interface QuickActionCardProps {
  label: string
  icon: LucideIcon
  description: string
  onClick: () => void
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ label, icon: Icon, description, onClick }) => (
  <Card className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardHeader className="pb-2 pt-5 px-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <CardTitle className="text-sm text-slate-800">{label}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="px-5 pb-5">
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      <Button size="sm" variant="ghost" className="mt-3 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent text-xs font-medium h-auto">
        Go →
      </Button>
    </CardContent>
  </Card>
)

export default QuickActionCard
