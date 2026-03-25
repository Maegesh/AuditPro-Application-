import React from 'react'
import { Card, CardContent } from '@/Components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  message: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => (
  <Card className="border-slate-200">
    <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-slate-500 text-sm text-center">{message}</p>
    </CardContent>
  </Card>
)

export default EmptyState
