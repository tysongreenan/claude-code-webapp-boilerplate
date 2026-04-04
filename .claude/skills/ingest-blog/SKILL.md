---
name: ingest-blog
description: Auto-ingest all blog posts into the AI chatbot knowledge base so it can answer questions about your content.
user_invocable: true
---

# /ingest-blog — Feed Blog Posts to AI Chatbot

Read all markdown blog posts from `content/blog/` and ingest them into the Pinecone knowledge base so the AI chatbot can answer questions about your content.

## Steps

### 1. Find all blog posts
```
Glob: content/blog/*.md
```

### 2. For each post

Read the file, extract:
- Title from frontmatter
- Full content (strip frontmatter)
- Slug from filename

### 3. Ingest via Convex

For each post, call the ingest action. This can be done through the Convex dashboard or by creating a one-time script:

```typescript
// scripts/ingest-blog.ts
import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const blogDir = path.join(process.cwd(), "content/blog")
const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".md"))

for (const file of files) {
  const content = fs.readFileSync(path.join(blogDir, file), "utf8")
  const { data, content: body } = matter(content)
  
  console.log(`Ingesting: ${data.title}`)
  // Note: This requires auth — run via admin API or Convex dashboard
}
```

### 4. Alternative: manual via admin UI

Tell the user:
```
1. Go to /admin/knowledge
2. For each blog post, paste the title and content
3. Set source type to "Blog Post"
4. Click "Add to Knowledge Base"
```

### 5. Report

```
Ingested X blog posts into knowledge base:
- "Getting Started" (3 chunks)
- "How to Use the API" (5 chunks)
...

The AI chatbot can now answer questions about this content.
```

## Usage

```
/ingest-blog
```

After writing new blog posts:
```
/ingest-blog
```
