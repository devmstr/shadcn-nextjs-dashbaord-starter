import { FilterItem } from '@/components/layout/types'

export const categories: FilterItem[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    icon: 'Cpu'
  },
  {
    value: 'clothing',
    label: 'Clothing',
    icon: 'Shirt'
  },
  {
    value: 'books',
    label: 'Books',
    icon: 'BookOpen'
  },
  {
    value: 'furniture',
    label: 'Furniture',
    icon: 'Bed'
  },
  {
    value: 'sports',
    label: 'Sports',
    icon: 'Dumbbell'
  },
  {
    value: 'toys',
    label: 'Toys',
    icon: 'Puzzle'
  }
]

export const availability: FilterItem[] = [
  {
    value: 'in-stock',
    label: 'In Stock',
    icon: 'Check'
  },
  {
    value: 'out-of-stock',
    label: 'Out of Stock',
    icon: 'X'
  },
  {
    value: 'preorder',
    label: 'Preorder',
    icon: 'Clock'
  }
]

export const priceRanges: FilterItem[] = [
  {
    label: 'Budget',
    value: 'budget',
    icon: 'HandCoins'
  },
  {
    label: 'Standard',
    value: 'standard',
    icon: 'CreditCard'
  },
  {
    label: 'Premium',
    value: 'premium',
    icon: 'Crown'
  }
]
