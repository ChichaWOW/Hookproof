"use client"

import type { AnalysisResult } from "./types"

export async function analyzeUrlClient(url: string): Promise<AnalysisResult> {
  try {
    console.log("Client action: Analyzing URL", url)

    // Make a request to our server action
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to analyze URL")
    }

    const result = await response.json()
    console.log("Client action: Received result", result)

    return result
  } catch (error) {
    console.error("Error analyzing URL:", error)
    throw error
  }
}
