"use server"

import type { RegexResults, RegexResult } from "./types"

export async function analyzeWithRegex(url: string): Promise<RegexResults> {
  // Define regex patterns to detect common phishing techniques
  const patterns: RegexResult[] = [
    {
      name: "Suspicious TLD",
      description: "Domain uses uncommon TLDs often associated with phishing",
      pattern: /\.(xyz|top|gq|tk|ml|ga|cf|pw)$/i,
      detected: false,
    },
    {
      name: "Brand Impersonation",
      description: "URL contains popular brand names but on suspicious domains",
      pattern:
        /(paypal|apple|microsoft|amazon|netflix|google|facebook|instagram|twitter|linkedin).*\.((?!com|net|org|co|io).)+$/i,
      detected: false,
    },
    {
      name: "Numeric IP",
      description: "URL uses IP address instead of domain name",
      pattern: /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,
      detected: false,
    },
    {
      name: "Excessive Subdomains",
      description: "URL has an unusual number of subdomains",
      pattern: /https?:\/\/([^/]+\.){5,}/i,
      detected: false,
    },
    {
      name: "Misleading Subdomains",
      description: "Subdomain tries to look like a legitimate domain",
      pattern: /https?:\/\/[^/]*?([a-z0-9]+-[a-z0-9]+\.)+[a-z0-9]+\.[a-z]{2,}/i,
      detected: false,
    },
    {
      name: "URL Shortener",
      description: "URL uses a shortening service which can hide the real destination",
      pattern: /https?:\/\/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|buff\.ly|ow\.ly|rebrand\.ly|tiny\.cc)/i,
      detected: false,
    },
    {
      name: "Suspicious Characters",
      description: "URL contains Unicode characters that look like ASCII",
      pattern: /[а-яА-Я\u0430-\u044f\u0410-\u042f]/,
      detected: false,
    },
    {
      name: "Excessive Hyphens",
      description: "Domain contains an unusual number of hyphens",
      pattern: /https?:\/\/[^/]*(-[^/]*){3,}\.[^/]+/i,
      detected: false,
    },
    {
      name: "Suspicious Keywords",
      description: "URL contains words commonly used in phishing",
      pattern: /(secure|login|signin|verify|account|update|confirm|password|banking|authenticate|validation)/i,
      detected: false,
    },
    {
      name: "Data URI Scheme",
      description: "URL uses data URI scheme which can be used to embed content",
      pattern: /data:[^;]+;base64,/i,
      detected: false,
    },
  ]

  // Check each pattern against the URL
  let detectedPatterns = 0

  patterns.forEach((pattern) => {
    if (pattern.pattern && pattern.pattern.test(url)) {
      pattern.detected = true
      detectedPatterns++
    }
  })

  // Calculate score (0-100, higher is better/safer)
  const totalPatterns = patterns.length
  const score = Math.round(((totalPatterns - detectedPatterns) / totalPatterns) * 100)

  return {
    score,
    detectedPatterns,
    totalPatterns,
    detailedResults: patterns,
  }
}
