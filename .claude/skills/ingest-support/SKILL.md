---
name: ingest-support
description: Auto-ingest all support articles into the AI chatbot knowledge base. Run after adding or editing support content.
user_invocable: true
---

# /ingest-support — Feed Support Articles to AI Chatbot

Read all markdown files from `content/support/` and ingest them into Pinecone so the AI chatbot can answer support questions.

## Steps

### 1. Find all support articles
```
Glob: content/support/**/*.md
```

### 2. Read each article
For each `.md` file:
- Parse frontmatter (title, category, description)
- Extract the raw markdown content

### 3. Ingest each article
For each article, call the Convex ingest action via the admin knowledge base UI or directly:

- **Title**: The article title from frontmatter
- **Content**: Full markdown body
- **Source type**: "faq"
- **Source URL**: `/support/{category}/{slug}`

### 4. Alternative: use the admin UI
Tell the user:
```
For each support article:
1. Go to /admin/knowledge
2. Paste the title and content
3. Set source type to "FAQ"
4. Click "Add to Knowledge Base"
```

### 5. Report

```
Ingested X support articles into knowledge base:

Getting Started:
  - "How to Create an Account" (2 chunks)
  - "Dashboard Overview" (2 chunks)

Billing:
  - "Pricing Plans" (3 chunks)
  - "Refunds and Cancellations" (2 chunks)

Features:
  - "Teams and Workspaces" (2 chunks)
  - "AI Chatbot" (2 chunks)

Troubleshooting:
  - "Common Issues" (3 chunks)
  - "Contact Support" (1 chunk)

Total: X articles, Y chunks
The AI chatbot can now answer support questions.
```

## Usage

After adding or editing support articles:
```
/ingest-support
```

Ingest both blog AND support:
```
/ingest-blog
/ingest-support
```

## Content structure

```
content/support/
  getting-started/     ← Onboarding, setup guides
    create-account.md
    dashboard-overview.md
  billing/             ← Plans, payments, refunds
    pricing-plans.md
    refunds.md
  features/            ← How features work
    teams.md
    ai-chatbot.md
  troubleshooting/     ← Common issues, contact
    common-issues.md
    contact-support.md
```

Add new categories by creating new directories. Add new articles by creating `.md` files with frontmatter (title, description, category, order).
