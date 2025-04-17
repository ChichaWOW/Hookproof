"use server"

import type { DomainInfo } from "./types"

export async function getDomainInfo(url: string): Promise<DomainInfo> {
  try {
    // Extract domain from URL
    const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`)
    const domain = urlObj.hostname

    // For a real implementation, you would query WHOIS data
    // Since we can't make those API calls here, we'll simulate the response

    // Generate a random registration date between 1 month and 10 years ago
    const now = new Date()
    const randomMonthsAgo = Math.floor(Math.random() * 120) + 1 // 1 to 120 months
    const registrationDate = new Date(now)
    registrationDate.setMonth(now.getMonth() - randomMonthsAgo)

    // Calculate domain age
    const ageInMonths = randomMonthsAgo
    let age: string

    if (ageInMonths < 12) {
      age = `${ageInMonths} month${ageInMonths !== 1 ? "s" : ""}`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      age = `${years} year${years !== 1 ? "s" : ""}${months > 0 ? `, ${months} month${months !== 1 ? "s" : ""}` : ""}`
    }

    // Check for SSL (simulated)
    const hasValidSSL = url.startsWith("https://") || Math.random() > 0.3

    return {
      domain,
      registrationDate: registrationDate.toISOString().split("T")[0],
      age,
      hasValidSSL,
    }
  } catch (error) {
    console.error("Error getting domain info:", error)

    // Return fallback data
    return {
      domain: "unknown",
      registrationDate: null,
      age: null,
      hasValidSSL: false,
    }
  }
}
