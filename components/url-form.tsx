"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UrlFormProps {
  onAnalyze: (url: string) => Promise<void>
  isAnalyzing: boolean
  error: string | null
}

export default function UrlForm({ onAnalyze, isAnalyzing, error }: UrlFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      return
    }

    // Basic URL validation
    try {
      // Add http:// if missing
      const urlToCheck = url.match(/^https?:\/\//) ? url : `http://${url}`
      new URL(urlToCheck)

      onAnalyze(urlToCheck)
    } catch (err) {
      // URL validation error is handled by the parent component
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter URL to analyze (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white border-gray-300 h-14 pl-4 pr-12 text-black placeholder:text-gray-500"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isAnalyzing}
            className="absolute right-1 top-1 h-12 w-12 rounded-md bg-black text-white hover:bg-gray-800"
          >
            {isAnalyzing ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 text-left">
        Powered by VirusTotal API and advanced pattern recognition algorithms
      </div>
    </div>
  )
}
