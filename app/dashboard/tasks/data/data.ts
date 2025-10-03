import { FilterItem } from '@/components/layout/types'

export const labels = [
  {
    value: 'bug',
    label: 'Bug'
  },
  {
    value: 'feature',
    label: 'Feature'
  },
  {
    value: 'documentation',
    label: 'Documentation'
  }
]

export const statuses: FilterItem[] = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: 'HelpCircle'
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: 'Circle'
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: 'Timer'
  },
  {
    value: 'done',
    label: 'Done',
    icon: 'CheckCircle'
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: 'CircleOff'
  }
]

export const priorities: FilterItem[] = [
  {
    label: 'Low',
    value: 'low',
    icon: 'ArrowDown'
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: 'ArrowRight'
  },
  {
    label: 'High',
    value: 'high',
    icon: 'ArrowUp'
  }
]
