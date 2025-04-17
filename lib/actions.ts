"use server"

import { v4 as uuidv4 } from "uuid"
import type { AnalysisResult } from "./types"
import { analyzeWithVirusTotal } from "./virustotal"
import { analyzeWithRegex } from "./regex"
import { getDomainInfo } from "./domain"
import { generateRecommendations } from "./recommendations"

// In-memory storage for analysis results
const analysisResults = new Map<string, AnalysisResult>()

export async function analyzeUrl(url: string): Promise<string> {
  try {
    // Generate a unique ID for this analysis
    const id = uuidv4()

    // Run all analyses in parallel
    const [virusTotalResults, regexResults, domainInfo] = await Promise.all([
      analyzeWithVirusTotal(url),
      analyzeWithRegex(url),
      getDomainInfo(url),
    ])

    // Calculate overall score (weighted average)
    const vtWeight = 0.6
    const regexWeight = 0.4
    const overallScore = Math.round(virusTotalResults.score * vtWeight + regexResults.score * regexWeight)

    // Generate recommendations based on analysis results
    const recommendations = await generateRecommendations(virusTotalResults, regexResults, domainInfo)

    // Create the complete analysis result
    const result: AnalysisResult = {
      id,
      url,
      timestamp: Date.now(),
      overallScore,
      virusTotalResults,
      regexResults,
      domainInfo,
      recommendations,
    }

    // Store the result
    analysisResults.set(id, result)

    return id
  } catch (error) {
    console.error("Error analyzing URL:", error)
    throw new Error("Failed to analyze URL")
  }
}

export async function getAnalysisResult(id: string): Promise<AnalysisResult | null> {
  return analysisResults.get(id) || null
}
