
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
}

export type Category = {
  id: string
  name: string
  definition: string
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
