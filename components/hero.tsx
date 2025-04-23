import { AlertTriangle } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-12 md:py-20 text-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Food Recall Alert System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay informed about the latest food recall alerts to protect yourself and your family from potentially harmful
          products.
        </p>
      </div>
    </section>
  )
}
