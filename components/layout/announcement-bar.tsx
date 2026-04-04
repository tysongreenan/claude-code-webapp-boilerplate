"use client"

import { useState } from "react"
import Link from "next/link"

interface AnnouncementBarProps {
  message: string
  link?: string
  linkText?: string
}

export function AnnouncementBar({ message, link, linkText = "Learn more" }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-primary text-primary-foreground text-sm py-2 px-4 text-center relative">
      <span>{message}</span>
      {link && (
        <Link href={link} className="ml-2 underline underline-offset-2 font-medium">
          {linkText} &rarr;
        </Link>
      )}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  )
}
