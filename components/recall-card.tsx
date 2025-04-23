import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, AlertTriangle, FileText } from "lucide-react"
import type { Recall } from "@/lib/types"
import Link from "next/link"

export default function RecallCard({ recall }: { recall: Recall }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="line-clamp-2">{recall.reason}</CardTitle>            
          </div>
          <Badge variant={getSeverityVariant(recall.classification)}>{recall.classification}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Recalled Product:</h3>
          <p className="line-clamp-3">{recall.product}</p>
        </div>

        {recall.status && (
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">Status: {recall.status}</span>
          </div>
        )}

        {recall.risk && (
          <div className="flex items-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{recall.risk}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Report Date: {formatDate(recall.reportDate)}</span>
        </div>
        <Link href={`/recall/${recall.id}`} className="text-sm font-medium text-primary hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

function getSeverityVariant(classification: string): "default" | "destructive" | "outline" | "secondary" {
  if (classification.includes("Class I")) return "destructive"
  if (classification.includes("Class II")) return "secondary"
  return "outline"
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown date"

  try {
    // Try to parse the date
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    return dateString
  }
}
