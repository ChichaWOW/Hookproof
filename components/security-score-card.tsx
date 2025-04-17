"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, AlertCircle } from "lucide-react"

interface SecurityScoreCardProps {
  score: number
}

export default function SecurityScoreCard({ score }: SecurityScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)

    return () => clearTimeout(timer)
  }, [score])

  // Debug information
  console.log("SecurityScoreCard received score:", score)

  const getScoreColor = () => {
    if (score < 30) return "text-red-600"
    if (score < 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getScoreBackground = () => {
    if (score < 30) return "from-red-100 to-transparent"
    if (score < 70) return "from-yellow-100 to-transparent"
    return "from-green-100 to-transparent"
  }

  const getScoreIcon = () => {
    if (score < 30) return <AlertCircle className="h-8 w-8 text-red-600" />
    if (score < 70) return <AlertTriangle className="h-8 w-8 text-yellow-600" />
    return <Shield className="h-8 w-8 text-green-600" />
  }

  const getScoreText = () => {
    if (score < 30) return "High Risk"
    if (score < 70) return "Medium Risk"
    return "Low Risk"
  }

  const getScoreDescription = () => {
    if (score < 30) {
      return "This URL shows indicators of being potentially malicious. Proceed with caution."
    } else if (score < 70) {
      return "This URL has some suspicious elements. Exercise caution when visiting."
    } else {
      return "This URL appears to be safe based on our analysis."
    }
  }

  return (
    <Card className="bg-white border-gray-200 futuristic-glow result-card overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${getScoreBackground()} opacity-50`} />
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span>Security Score</span>
          {getScoreIcon()}
        </CardTitle>
        <CardDescription>Overall threat assessment</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col items-center justify-center py-4">
          <div className={`text-6xl font-bold ${getScoreColor()}`}>{animatedScore}</div>
          <div className="text-xl mt-2">{getScoreText()}</div>
          <div className="text-sm text-gray-600 mt-4 text-center">{getScoreDescription()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
