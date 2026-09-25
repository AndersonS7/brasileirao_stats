const zone = 'America/Sao_Paulo'
const date = new Intl.DateTimeFormat('pt-BR', { timeZone: zone, day: '2-digit', month: '2-digit', year: 'numeric' })
const time = new Intl.DateTimeFormat('pt-BR', { timeZone: zone, hour: '2-digit', minute: '2-digit' })
const number = new Intl.NumberFormat('pt-BR')

export const formatDate = (iso: string): string => date.format(new Date(iso))
export const formatTime = (iso: string): string => time.format(new Date(iso))
export const formatNumber = (n: number): string => number.format(n)
