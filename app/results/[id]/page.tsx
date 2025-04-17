import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getAnalysisResult } from "@/lib/actions"
import RegexResultsCard from "@/components/regex-results-card"
import SecurityScoreCard from "@/components/security-score-card"
import VirusTotalResultsCard from "@/components/virustotal-results-card"

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const result = await getAnalysisResult(params.id)

  if (!result) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8 pt-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-black border-gray-200 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Scanner
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <h1 className="text-2xl font-bold tracking-tighter">HookProof</h1>
          </div>
        </header>

        <main className="grid-pattern pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                URL Analysis Report
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-xl font-mono break-all">{result.url}</h2>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Visit (at your own risk)</span>
                </a>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Badge
                  className={
                    result.overallScore < 30
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : result.overallScore < 70
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                  }
                >
                  {result.overallScore < 30 ? "High Risk" : result.overallScore < 70 ? "Medium Risk" : "Low Risk"}
                </Badge>
                <span className="text-sm text-gray-600">Analyzed on {new Date(result.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SecurityScoreCard score={result.overallScore} />
              <VirusTotalResultsCard virusTotalResults={result.virusTotalResults} />
              <RegexResultsCard regexResults={result.regexResults} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white border-gray-200 futuristic-glow">
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                  <CardDescription>Comprehensive breakdown of security indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Domain Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Domain</div>
                        <div className="font-mono">{result.domainInfo.domain}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Registration Date</div>
                        <div className="font-mono">{result.domainInfo.registrationDate || "Unknown"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Domain Age</div>
                        <div className="font-mono">{result.domainInfo.age || "Unknown"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">SSL Certificate</div>
                        <div className="font-mono flex items-center gap-2">
                          {result.domainInfo.hasValidSSL ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Valid</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span>Invalid/Missing</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">URL Structure Analysis</h3>
                    <div className="space-y-4">
                      {result.regexResults.detailedResults.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium mb-1">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.description}</div>
                            </div>
                            <div className="flex items-center">
                              {item.detected ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Detected
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Not Detected
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">VirusTotal Detailed Results</h3>
                    <div className="space-y-4">
                      {result.virusTotalResults.detailedResults.map((category, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-2">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-sm text-gray-600 ml-2">
                              ({category.positives} / {category.total})
                            </span>
                          </div>
                          <Progress
                            value={(category.positives / category.total) * 100}
                            className="h-2 bg-gray-200"
                            indicatorClassName={category.positives > 0 ? "bg-red-500" : "bg-green-500"}
                          />
                          {category.engines.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {category.engines.map((engine, idx) => (
                                <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {engine}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-black">•</div>
                            <div>{rec}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>HookProof © {new Date().getFullYear()} | Advanced Phishing Detection</p>
        </footer>
      </div>
    </div>
  )
}
