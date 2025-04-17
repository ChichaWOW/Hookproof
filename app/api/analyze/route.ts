import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithVirusTotal } from "@/lib/virustotal"
import { analyzeWithRegex } from "@/lib/regex"
import { getDomainInfo } from "@/lib/domain"
import { generateRecommendations } from "@/lib/recommendations"
import type { AnalysisResult } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 })
    }

    console.log("API route: Analyzing URL", url)

    // Run all analyses in parallel
    const [virusTotalResults, regexResults, domainInfo] = await Promise.all([
      analyzeWithVirusTotal(url).catch((error) => {
        console.error("VirusTotal analysis failed:", error)
        // Return a safe fallback if VirusTotal fails
        return {
          score: 90, // High score (safe) as fallback
          totalEngines: 0,
          positiveEngines: 0,
          detailedResults: [
            {
              category: "API Error",
              total: 1,
              positives: 0,
              engines: [],
            },
          ],
        }
      }),
      analyzeWithRegex(url),
      getDomainInfo(url),
    ])

    console.log("Analysis results:", {
      virusTotalResults,
      regexResults,
      domainInfo,
    })

    // CRITICAL FIX: Determine risk level based on actual findings
    let overallScore = 90 // Default to safe (low risk)

    // Only if there are actual detections, calculate a weighted score
    if (virusTotalResults.positiveEngines > 0 || regexResults.detectedPatterns > 0) {
      // Calculate weighted score based on detections
      const vtWeight = 0.6
      const regexWeight = 0.4

      // Calculate individual scores (lower = more risky)
      const vtScore =
        virusTotalResults.positiveEngines > 0 ? Math.max(0, 100 - virusTotalResults.positiveEngines * 20) : 100

      const regexScore = regexResults.detectedPatterns > 0 ? Math.max(0, 100 - regexResults.detectedPatterns * 10) : 100

      // Calculate weighted average
      overallScore = Math.round(vtScore * vtWeight + regexScore * regexWeight)
    }

    console.log("Final calculated score:", overallScore)

    // Generate recommendations based on analysis results
    const recommendations = await generateRecommendations(virusTotalResults, regexResults, domainInfo)

    // Create the complete analysis result
    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      url,
      timestamp: Date.now(),
      overallScore: overallScore,
      virusTotalResults,
      regexResults,
      domainInfo,
      recommendations,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing URL:", error)
    return NextResponse.json({ message: "Failed to analyze URL" }, { status: 500 })
  }
}
