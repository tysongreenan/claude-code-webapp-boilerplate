"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ className }: { className?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const elements = document.querySelectorAll("h1, h2, h3")
    const arr: Heading[] = []
    elements.forEach((el) => {
      if (el.id) arr.push({ id: el.id, text: el.textContent || "", level: parseInt(el.tagName.charAt(1)) })
    })
    setHeadings(arr)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const positions = headings.map((h) => {
        const el = document.getElementById(h.id)
        return { id: h.id, top: el ? el.getBoundingClientRect().top : Infinity }
      })

      let active = positions.find((h) => h.top >= -50 && h.top <= 100)
      if (!active) {
        const above = positions.filter((h) => h.top < -50).sort((a, b) => b.top - a.top)
        active = above[0]
      }
      if (active && active.id !== activeId) setActiveId(active.id)
    }

    let timeout: NodeJS.Timeout
    const throttled = () => { clearTimeout(timeout); timeout = setTimeout(handleScroll, 10) }
    window.addEventListener("scroll", throttled, { passive: true })
    handleScroll()
    return () => { window.removeEventListener("scroll", throttled); clearTimeout(timeout) }
  }, [headings, activeId])

  const handleClick = (id: string) => {
    window.history.pushState({}, '', `#${id}`)
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-semibold text-foreground mb-4">On this page</h4>
      <nav>
        <ul className="space-y-2">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => handleClick(h.id)}
                className={cn(
                  "block w-full text-left text-sm transition-colors hover:text-foreground text-muted-foreground",
                  activeId === h.id && "text-foreground font-medium underline underline-offset-4"
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
