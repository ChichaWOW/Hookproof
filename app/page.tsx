"use client"

import { useState } from "react"
import { Shield } from "lucide-react"
import UrlForm from "@/components/url-form"
import ResultsSection from "@/components/results-section"
import { analyzeUrlClient } from "@/lib/client-actions"
import type { AnalysisResult } from "@/lib/types"

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyzeUrl = async (url: string) => {
    setIsAnalyzing(true)
    setError(null)

    try {
      console.log("Analyzing URL:", url)
      const result = await analyzeUrlClient(url)
      console.log("Analysis result:", result)
      setResults(result)
    } catch (err) {
      console.error("Error during analysis:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze URL")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-center mb-12 pt-8">
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10 text-black" />
            <h1 className="text-4xl font-bold tracking-tighter">HookProof</h1>
          </div>
        </header>

        <main>
          <section className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              Advanced Phishing Detection
            </h2>
            <p className="text-gray-600 mb-8">
              Enter any suspicious URL and get a comprehensive security analysis powered by VirusTotal and advanced
              pattern recognition.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
              <UrlForm onAnalyze={handleAnalyzeUrl} isAnalyzing={isAnalyzing} error={error} />
            </div>
          </section>

          {!results && !isAnalyzing && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">VirusTotal Analysis</h3>
                <p className="text-gray-600">
                  Leverages VirusTotal's database of 70+ security vendors to identify malicious URLs.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Advanced regex patterns detect common phishing techniques and suspicious URL structures.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
                <p className="text-gray-600">
                  Comprehensive analysis with visual indicators and actionable security recommendations.
                </p>
              </div>
            </section>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Analyzing URL with VirusTotal and pattern recognition...</p>
            </div>
          )}

          {results && <ResultsSection result={results} />}
        </main>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>HookProof © {new Date().getFullYear()} | Advanced Phishing Detection</p>
        </footer>
      </div>
    </div>
  )
}
