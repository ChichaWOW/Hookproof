"use server"

import type { VirusTotalResults, VirusTotalCategory } from "./types"

export async function analyzeWithVirusTotal(url: string): Promise<VirusTotalResults> {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY

    if (!apiKey) {
      console.error("VirusTotal API key is not configured")

      // Return a safe result when API key is missing
      return createFallbackResult("No API key configured")
    }

    console.log("Using VirusTotal API key:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4))

    // URL encode the target
    const encodedUrl = encodeURIComponent(url)

    try {
      // First, try to get existing report instead of submitting for scanning
      // This is more reliable and avoids rate limiting issues
      const urlIdentifier = Buffer.from(url)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")

      console.log("Checking for existing VirusTotal report")
      const reportResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${urlIdentifier}`, {
        headers: {
          "x-apikey": apiKey,
          Accept: "application/json",
        },
      })

      // If we get a report, use it
      if (reportResponse.ok) {
        console.log("Found existing VirusTotal report")
        const reportData = await reportResponse.json()
        return processVirusTotalResults(reportData)
      }

      console.log("No existing report found, submitting URL for scanning")

      // If no existing report, submit the URL for scanning
      const submitResponse = await fetch(`https://www.virustotal.com/api/v3/urls`, {
        method: "POST",
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `url=${encodedUrl}`,
      })

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text()
        console.error(`VirusTotal API submission error (${submitResponse.status}): ${errorText}`)
        return createFallbackResult(`API submission error: ${submitResponse.status}`)
      }

      const submitData = await submitResponse.json()
      const analysisId = submitData.data.id

      console.log("VirusTotal analysis ID:", analysisId)

      // Wait a moment for analysis to complete
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Get the analysis results
      const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          "x-apikey": apiKey,
          Accept: "application/json",
        },
      })

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text()
        console.error(`VirusTotal API analysis error (${analysisResponse.status}): ${errorText}`)
        return createFallbackResult(`API analysis error: ${analysisResponse.status}`)
      }

      const analysisData = await analysisResponse.json()
      return processVirusTotalResults(analysisData)
    } catch (apiError) {
      console.error("VirusTotal API error:", apiError)
      return createFallbackResult(`API error: ${apiError instanceof Error ? apiError.message : String(apiError)}`)
    }
  } catch (error) {
    console.error("Error in VirusTotal analysis:", error)
    return createFallbackResult(`General error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Helper function to process VirusTotal results
function processVirusTotalResults(data: any): VirusTotalResults {
  try {
    console.log("Processing VirusTotal results")

    // Handle different response formats
    const stats = data.data.attributes.stats || data.data.attributes.last_analysis_stats

    if (!stats) {
      console.error("No stats found in VirusTotal response")
      return createFallbackResult("No stats in response")
    }

    // Process the results
    const totalEngines = stats.harmless + stats.malicious + stats.suspicious + stats.undetected
    const positiveEngines = stats.malicious + stats.suspicious

    // Calculate score (0-100, higher is better/safer)
    const score = Math.round(((totalEngines - positiveEngines) / totalEngines) * 100)

    console.log("VirusTotal score calculation:", {
      totalEngines,
      positiveEngines,
      score,
    })

    // Extract detailed results by category
    const detailedResults: VirusTotalCategory[] = []

    // Security vendors
    const securityVendors: string[] = []
    const results = data.data.attributes.results || data.data.attributes.last_analysis_results

    if (results) {
      Object.entries(results).forEach(([engine, result]: [string, any]) => {
        if (result.category === "malicious" || result.category === "suspicious") {
          securityVendors.push(engine)
        }
      })
    }

    detailedResults.push({
      category: "Security Vendors",
      total: totalEngines,
      positives: positiveEngines,
      engines: securityVendors,
    })

    return {
      score,
      totalEngines,
      positiveEngines,
      detailedResults,
    }
  } catch (error) {
    console.error("Error processing VirusTotal results:", error)
    return createFallbackResult(`Processing error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Helper function to create a fallback result
function createFallbackResult(reason: string): VirusTotalResults {
  console.log(`Creating fallback VirusTotal result: ${reason}`)
  return {
    score: 90, // High score (safe) as fallback
    totalEngines: 0,
    positiveEngines: 0,
    detailedResults: [
      {
        category: "API Fallback",
        total: 1,
        positives: 0,
        engines: [],
      },
    ],
  }
}
