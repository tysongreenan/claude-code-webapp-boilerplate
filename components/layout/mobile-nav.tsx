"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
  { href: "/changelog", label: "Changelog" },
  { href: "/dashboard", label: "Dashboard" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden w-9 h-9">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="text-left font-heading">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-2">
          <Link href="/auth/signin" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full">Sign In</Button>
          </Link>
          <Link href="/auth/register" onClick={() => setOpen(false)}>
            <Button className="w-full">Get Started</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
