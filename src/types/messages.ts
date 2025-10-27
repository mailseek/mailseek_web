
export type AnalyzeResult = {
  message_id: string
  model: string
  temperature: number
  result: {
    summary: string
    status: 'no_errors' | 'minor_errors' | 'critical_errors'
    errors: {
      document_type: string
      error: string
      field: string
      severity: 'minor' | 'major' | 'critical'
    }[]
  }
}

export type Message = {
  id: string
  message_id: string
  user_id: string
  subject: string
  from: string
  status: string
  to: string
  model: string
  temperature: number
  summary: string
  reason: string
  need_action: boolean
  category_id: string | null
  sent_at: string | null
  analyze_result: AnalyzeResult | null
}

export type Category = {
  id: string
  name: string
  definition: string
  message_count: number
}

export type CategorySettingsItem = {
  id: string
  key: string
  value: {
    type: 'boolean'
    value: boolean
  }
}

export type CategorySettings = {
  items: CategorySettingsItem[]
}

export type MessageContent = {
  id: string
  html: string
  text: string
}

export type Report = {
  id: string
  message_id: string
  type: string
  status: string
  user_id: string
  payload: {
    image_path?: string
    order?: number
  }
}
