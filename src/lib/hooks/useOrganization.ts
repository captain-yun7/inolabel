'use client'

import { useOrganizationData } from './useOrganizationData'
import type { UnitType } from '@/types/organization'

export interface UseOrganizationOptions {
  unit?: UnitType
  liveOnly?: boolean
  realtime?: boolean
}

export function useOrganization(options: UseOrganizationOptions = {}) {
  return useOrganizationData(options)
}

