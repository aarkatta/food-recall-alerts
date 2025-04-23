import { Skeleton } from "@/components/ui/skeleton"

export default function RecallListLoading() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
