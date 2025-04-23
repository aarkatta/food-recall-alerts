"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Recall } from "@/lib/types"

export default function RecallLayout({ recall, summary }: { recall: Recall; summary?: string }) {
  // Function to get severity variant based on classification
  function getSeverityVariant(classification: string): "default" | "destructive" | "outline" | "secondary" {
    if (classification.includes("Class I")) return "destructive"
    if (classification.includes("Class II")) return "secondary"
    return "outline"
  }

  // If we have a summary, parse and display it
  if (summary) {
    // Split the summary into sections based on double newlines
    const sections = summary.split("\n\n").filter((section) => section.trim() !== "")

    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all recalls
        </Link>

        <Card className="max-w-3xl mx-auto overflow-hidden">        

          <div className="p-6">
            {sections.map((section, index) => {
              if (!section.trim()) return null

              // Split the section into lines
              const lines = section.split("\n")

              // Extract the title (if it exists)
              let title = ""
              let content = lines

              // Check if the first line contains a title (bold text)
              if (lines[0].includes("**")) {
                title = lines[0].replace(/\*\*/g, "").replace(":", "").trim()
                content = lines.slice(1)
              }

              // Filter out empty lines and lines with just dashes
              const filteredContent = content.filter((line) => line.trim() !== "" && !/^\s*-\s*$/.test(line))

              if (filteredContent.length === 0) return null

              return (
                <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                  {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}

                  {filteredContent.map((line, i) => {
                    // Process bullet points
                    if (line.trim().startsWith("- ")) {
                      const bulletContent = line.trim().substring(2)

                      // Process bold text within bullet points
                      const formattedBulletContent = bulletContent.replace(/\*\*(.*?)\*\*/g, "$1").trim()

                      // Check for links in the format [text](url)
                      const urlMatch = formattedBulletContent.match(/\[(.*?)\]$$(.*?)$$/)

                      if (urlMatch) {
                        const beforeLink = formattedBulletContent.substring(0, formattedBulletContent.indexOf("["))
                        const linkText = urlMatch[1]
                        const linkUrl = urlMatch[2]
                        const afterLink = formattedBulletContent.substring(formattedBulletContent.indexOf(")") + 1)

                        return (
                          <div key={i} className="flex mt-2">
                            <span className="mr-2">•</span>
                            <p>
                              {beforeLink}
                              <Link href={linkUrl} className="text-primary hover:underline">
                                {linkText}
                              </Link>
                              {afterLink}
                            </p>
                          </div>
                        )
                      }

                      return (
                        <div key={i} className="flex mt-2">
                          <span className="mr-2">•</span>
                          <p>{formattedBulletContent}</p>
                        </div>
                      )
                    }

                    // Process regular text (non-bullet points)
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "$1").trim()

                    // Check for links in the format [text](url)
                    const urlMatch = formattedLine.match(/\[(.*?)\]$$(.*?)$$/)

                    if (urlMatch) {
                      const beforeLink = formattedLine.substring(0, formattedLine.indexOf("["))
                      const linkText = urlMatch[1]
                      const linkUrl = urlMatch[2]
                      const afterLink = formattedLine.substring(formattedLine.indexOf(")") + 1)

                      return (
                        <p key={i} className="mt-2">
                          {beforeLink}
                          <Link href={linkUrl} className="text-primary hover:underline">
                            {linkText}
                          </Link>
                          {afterLink}
                        </p>
                      )
                    }

                    return (
                      <p key={i} className="mt-2">
                        {formattedLine}
                      </p>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  // If no summary is provided, fall back to the structured display
  const sections = [    
    {
      title: "Recall Details",
      content: [
        `Reason: ${recall.reason}`,
        recall.risk ? `Risk: ${recall.risk}` : null,
        recall.classification ? `Classification: ${recall.classification}` : null,
        recall.status ? `Status: ${recall.status}` : null,
      ].filter(Boolean),
    },
    {
      title: "Distribution Information",
      content: [
        recall.distribution ? `Distribution: ${recall.distribution}` : null,
        recall.state ? `State: ${recall.state}` : null,
        recall.city ? `City: ${recall.city}` : null,
      ].filter(Boolean),
    },
    {
      title: "Dates",
      content: [
        recall.reportDate ? `Report Date: ${formatDate(recall.reportDate)}` : null,
        recall.recallDate ? `Recall Date: ${formatDate(recall.recallDate)}` : null,
        recall.voluntaryMandated ? `Type: ${recall.voluntaryMandated}` : null,
      ].filter(Boolean),
    },
  ]

  // Only return sections that have content
  const filteredSections = sections.filter((section) => section.content.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all recalls
      </Link>

      <Card className="max-w-3xl mx-auto overflow-hidden">
        
        <div className="p-6">
          {filteredSections.map((section, index) => (
            <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              {section.content.map((line, i) => (
                <p key={i} className="mt-2 text-base">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function formatDate(dateString: string): string {
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
