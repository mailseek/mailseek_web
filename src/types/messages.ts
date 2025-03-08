
export type Message = {
  id: string
  subject: string
  from: string
  to: string
  model: string
  temperature: number
  summary: string
  reason: string
  need_action: boolean
}

export type Category = {
  id: string
  name: string
  definition: string
}
