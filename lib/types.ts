export interface AnalysisResult {
  id: string
  url: string
  timestamp: number
  overallScore: number
  virusTotalResults: VirusTotalResults
  regexResults: RegexResults
  domainInfo: DomainInfo
  recommendations: string[]
}

export interface VirusTotalResults {
  score: number
  totalEngines: number
  positiveEngines: number
  detailedResults: VirusTotalCategory[]
}

export interface VirusTotalCategory {
  category: string
  total: number
  positives: number
  engines: string[]
}

export interface RegexResults {
  score: number
  detectedPatterns: number
  totalPatterns: number
  detailedResults: RegexResult[]
}

export interface RegexResult {
  name: string
  description: string
  detected: boolean
  pattern?: string
}

export interface DomainInfo {
  domain: string
  registrationDate: string | null
  age: string | null
  hasValidSSL: boolean
}
