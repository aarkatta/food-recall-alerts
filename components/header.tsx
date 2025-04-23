"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { AlertTriangle } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <span className="font-bold text-xl">Food Recall Alerts</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="#about" className="hover:underline">
            About
          </Link>
          <Link href="#contact" className="hover:underline">
            Contact
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
