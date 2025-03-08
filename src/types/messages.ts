
export type Message = {
  id: string
  message_id: string
  user_id: string
  subject: string
  from: string
  to: string
  model: string
  temperature: number
  summary: string
  reason: string
  need_action: boolean
  category_id: string | null
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
