"use server"

import type { VirusTotalResults, RegexResults, DomainInfo } from "./types"

export async function generateRecommendations(
  virusTotalResults: VirusTotalResults,
  regexResults: RegexResults,
  domainInfo: DomainInfo,
): Promise<string[]> {
  const recommendations: string[] = []

  // If no threats detected, provide appropriate recommendations
  if (virusTotalResults.positiveEngines === 0 && regexResults.detectedPatterns === 0) {
    recommendations.push("No security threats were detected for this URL.")
    recommendations.push("While the URL appears safe, always remain cautious when sharing personal information online.")

    // Add domain-specific recommendations
    if (!domainInfo.hasValidSSL) {
      recommendations.push(
        "This website does not use a secure connection (HTTPS). Consider using HTTPS for better security.",
      )
    }

    if (domainInfo.age && domainInfo.age.includes("month")) {
      recommendations.push(
        "This is a relatively new domain. While not necessarily suspicious, newer domains sometimes have less established reputations.",
      )
    }

    // Add general security advice
    recommendations.push("Use a password manager to generate and store unique passwords for each website.")
    recommendations.push("Enable two-factor authentication whenever possible for additional security.")

    return recommendations
  }

  // Base recommendation
  recommendations.push("Always verify the legitimacy of websites before entering sensitive information.")

  // VirusTotal-based recommendations
  if (virusTotalResults.positiveEngines > 0) {
    recommendations.push(
      `This URL was flagged by ${virusTotalResults.positiveEngines} security vendors. Avoid visiting this site.`,
    )
  }

  // Regex-based recommendations
  const suspiciousPatterns = regexResults.detailedResults.filter((r) => r.detected)

  if (suspiciousPatterns.length > 0) {
    if (suspiciousPatterns.some((p) => p.name === "Brand Impersonation")) {
      recommendations.push(
        "This URL appears to be impersonating a well-known brand. Verify the official website through a search engine instead.",
      )
    }

    if (suspiciousPatterns.some((p) => p.name === "Numeric IP")) {
      recommendations.push(
        "This URL uses an IP address instead of a domain name, which is unusual for legitimate websites.",
      )
    }

    if (suspiciousPatterns.some((p) => p.name === "URL Shortener")) {
      recommendations.push(
        "This URL uses a shortening service which can hide the real destination. Use a URL expander to see the actual destination before visiting.",
      )
    }

    if (suspiciousPatterns.some((p) => p.name === "Suspicious Characters")) {
      recommendations.push(
        "This URL contains characters designed to look like standard letters but are actually different. This is a common phishing technique.",
      )
    }
  }

  // Domain info-based recommendations
  if (domainInfo.age && domainInfo.age.includes("month")) {
    recommendations.push("This domain was registered recently, which can be a sign of a phishing website.")
  }

  if (!domainInfo.hasValidSSL) {
    recommendations.push(
      "This website does not use a secure connection (HTTPS). Never enter sensitive information on non-secure websites.",
    )
  }

  // General security recommendations
  if (recommendations.length < 3) {
    recommendations.push("Use a password manager to generate and store unique passwords for each website.")
    recommendations.push("Enable two-factor authentication whenever possible for additional security.")
  }

  return recommendations
}
