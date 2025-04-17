import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RegexResults } from "@/lib/types"
import { CheckCircle, XCircle } from "lucide-react"

interface RegexResultsCardProps {
  regexResults: RegexResults
}

export default function RegexResultsCard({ regexResults }: RegexResultsCardProps) {
  const { score, detectedPatterns, totalPatterns } = regexResults

  return (
    <Card className="bg-white border-gray-200 futuristic-glow result-card">
      <CardHeader>
        <CardTitle>Pattern Analysis</CardTitle>
        <CardDescription>Advanced regex pattern detection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Suspicious Patterns</div>
            <div className="font-medium">
              {detectedPatterns} / {totalPatterns}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {regexResults.detailedResults.slice(0, 4).map((result, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                {result.detected ? (
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                )}
                <span className="text-xs truncate" title={result.name}>
                  {result.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="text-sm text-gray-600 mb-2">Summary</div>
            <div className="text-sm">
              {detectedPatterns === 0 ? (
                <span className="text-green-600">No suspicious patterns detected</span>
              ) : detectedPatterns < 3 ? (
                <span className="text-yellow-600">Some suspicious patterns detected</span>
              ) : (
                <span className="text-red-600">Multiple suspicious patterns detected</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
