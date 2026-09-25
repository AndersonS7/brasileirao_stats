// `search` is the TheSportsDB query; the match is verified against its `idAPIfootball` field.
// `name` is the display name (the API strips accents).
export interface TeamMapEntry {
  apiFootballId: number
  slug: string
  name: string
  short: string
  search: string
}

export const TEAM_MAP: TeamMapEntry[] = [
  { apiFootballId: 118, slug: 'bahia', name: 'Bahia', short: 'BAH', search: 'Bahia' },
  { apiFootballId: 119, slug: 'internacional', name: 'Internacional', short: 'INT', search: 'Internacional' },
  { apiFootballId: 120, slug: 'botafogo', name: 'Botafogo', short: 'BOT', search: 'Botafogo' },
  { apiFootballId: 121, slug: 'palmeiras', name: 'Palmeiras', short: 'PAL', search: 'Palmeiras' },
  { apiFootballId: 124, slug: 'fluminense', name: 'Fluminense', short: 'FLU', search: 'Fluminense' },
  { apiFootballId: 126, slug: 'sao-paulo', name: 'São Paulo', short: 'SAO', search: 'Sao Paulo' },
  { apiFootballId: 127, slug: 'flamengo', name: 'Flamengo', short: 'FLA', search: 'Flamengo' },
  { apiFootballId: 130, slug: 'gremio', name: 'Grêmio', short: 'GRE', search: 'Gremio' },
  { apiFootballId: 131, slug: 'corinthians', name: 'Corinthians', short: 'COR', search: 'Corinthians' },
  { apiFootballId: 133, slug: 'vasco', name: 'Vasco da Gama', short: 'VAS', search: 'Vasco da Gama' },
  { apiFootballId: 134, slug: 'athletico-pr', name: 'Athletico Paranaense', short: 'CAP', search: 'Athletico Paranaense' },
  { apiFootballId: 135, slug: 'cruzeiro', name: 'Cruzeiro', short: 'CRU', search: 'Cruzeiro' },
  { apiFootballId: 136, slug: 'vitoria', name: 'Vitória', short: 'VIT', search: 'Vitoria' },
  { apiFootballId: 140, slug: 'criciuma', name: 'Criciúma', short: 'CRI', search: 'Criciuma' },
  { apiFootballId: 144, slug: 'atletico-go', name: 'Atlético Goianiense', short: 'ACG', search: 'Atletico Goianiense' },
  { apiFootballId: 152, slug: 'juventude', name: 'Juventude', short: 'JUV', search: 'Juventude' },
  { apiFootballId: 154, slug: 'fortaleza', name: 'Fortaleza', short: 'FOR', search: 'Fortaleza' },
  { apiFootballId: 794, slug: 'bragantino', name: 'RB Bragantino', short: 'RBB', search: 'Bragantino' },
  { apiFootballId: 1062, slug: 'atletico-mg', name: 'Atlético Mineiro', short: 'CAM', search: 'Atletico Mineiro' },
  { apiFootballId: 1193, slug: 'cuiaba', name: 'Cuiabá', short: 'CUI', search: 'Cuiaba' },
]
