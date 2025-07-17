export interface Notification {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}