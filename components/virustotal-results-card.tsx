import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { VirusTotalResults } from "@/lib/types"
import { AlertCircle } from "lucide-react"

interface VirusTotalResultsCardProps {
  virusTotalResults: VirusTotalResults
}

export default function VirusTotalResultsCard({ virusTotalResults }: VirusTotalResultsCardProps) {
  const { score, totalEngines, positiveEngines } = virusTotalResults

  // Check if VirusTotal analysis was successful
  const isVirusTotalAvailable = totalEngines > 0

  return (
    <Card className="bg-white border-gray-200 futuristic-glow result-card">
      <CardHeader>
        <CardTitle>VirusTotal Analysis</CardTitle>
        <CardDescription>
          {isVirusTotalAvailable ? `Results from ${totalEngines} security vendors` : "VirusTotal analysis unavailable"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVirusTotalAvailable ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Detection Rate</div>
              <div className="font-medium">
                {positiveEngines} / {totalEngines}
              </div>
            </div>

            <Progress
              value={(positiveEngines / totalEngines) * 100}
              className="h-2 bg-gray-200"
              indicatorClassName={positiveEngines > 0 ? "bg-red-500" : "bg-green-500"}
            />

            <div className="pt-4">
              <div className="text-sm text-gray-600 mb-2">Summary</div>
              <div className="text-sm">
                {positiveEngines === 0 ? (
                  <span className="text-green-600">No security vendors flagged this URL as malicious</span>
                ) : positiveEngines < 3 ? (
                  <span className="text-yellow-600">
                    {positiveEngines} security vendors flagged this URL as potentially malicious
                  </span>
                ) : (
                  <span className="text-red-600">{positiveEngines} security vendors flagged this URL as malicious</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-600">
              VirusTotal analysis is currently unavailable. The assessment is based on pattern recognition only.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
