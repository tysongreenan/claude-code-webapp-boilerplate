# Blog Writing Guide

## How to Write a Blog Post

1. **Create a new Markdown file** in the `content/blog/` directory
2. **Name it** using kebab-case (e.g., `my-awesome-blog-post.md`)
3. **Use the template below** as a starting point
4. **Set `published: true`** when ready to publish, or `false` to save as draft

## Template

```markdown
---
title: "Your Blog Post Title"
description: "A compelling 150-160 character description for SEO and social sharing"
date: "2025-11-23"
updatedDate: "2025-11-23"  # Optional: only if you update the post later
author: "cookie-banner-team"  # Or your name
tags: ["Tag1", "Tag2", "Tag3"]  # 3-5 relevant tags
published: true  # Set to false to save as draft
image: "/images/blog/your-image.jpg"  # Optional: featured image URL
---

# Your Blog Post Title

<div class="direct-answer">
<strong>Direct Answer:</strong> Start with a clear, direct answer to the main question your post addresses. This helps with SEO and user experience.

[Learn more about this topic →](/relevant-link)
</div>

---

## Table of Contents

- [First Section](#first-section)
- [Second Section](#second-section)
- [Conclusion](#conclusion)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## First Section

Write your content here using Markdown. You can use:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists
- Code blocks

### Subsection

You can nest headings for better organization.

---

## Second Section

More content here...

---

## Conclusion

Wrap up your post with key takeaways.

---

## Frequently Asked Questions

### Question 1?

**Answer:** Your answer here.

### Question 2?

**Answer:** Your answer here.

---

**Ready to learn more?** [Call to action →](/link)
```

## Required Frontmatter Fields

- `title`: The blog post title (appears in H1 and SEO)
- `description`: Meta description for SEO (150-160 characters)
- `date`: Publication date (YYYY-MM-DD format)
- `author`: Author name (defaults to "cookie-banner-team")
- `tags`: Array of tags for categorization
- `published`: `true` to publish, `false` for draft

## Optional Frontmatter Fields

- `updatedDate`: When you last updated the post
- `image`: Featured image URL (appears at top of post)
- `schema`: FAQ structured data (for advanced SEO)

## Tips

1. **Use descriptive headings** - They become anchor links automatically
2. **Include a Table of Contents** - Helps with navigation
3. **Add a "Direct Answer" box** - Great for SEO and UX
4. **Use tags wisely** - Helps readers find related content
5. **Include FAQs** - Common questions improve SEO
6. **Add internal links** - Link to other pages on your site
7. **Use images** - Visual content improves engagement

## Example Tags

- "PIPEDA", "CASL", "GDPR", "Privacy Law"
- "Cookie Consent", "Compliance", "Legal"
- "WordPress", "Shopify", "Webflow", "Technical"
- "Canada", "Quebec", "Law 25"
- "Analytics", "Marketing", "Advertising"

## Publishing Checklist

- [ ] Frontmatter is complete and correct
- [ ] `published: true` is set
- [ ] Content is proofread
- [ ] Links are working
- [ ] Images are optimized
- [ ] Tags are relevant
- [ ] Table of contents is accurate

