export interface Author {
  name: string
  position: string
  avatar: string
}

export const authors: Record<string, Author> = {
  team: {
    name: "Team",
    position: "Product Team",
    avatar: "/favicon.svg",
  },
}

export function getAuthor(key: string): Author {
  return authors[key] || authors["team"]
}
