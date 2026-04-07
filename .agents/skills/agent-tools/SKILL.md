---
name: agent-tools
description: Patterns for using Claude Code agent tools effectively. Read when spawning sub-agents.
---

# Agent Tool Patterns

## Spawning Sub-agents

Use the Agent tool to delegate work to specialized agents:

```
Agent(subagent_type="Explore", prompt="Find all files related to...")
Agent(subagent_type="Plan", prompt="Design the implementation for...")
```

## When to Use Each Agent Type

- **Explore** — Finding files, searching code, answering codebase questions
- **Plan** — Designing implementations before coding
- **general-purpose** — Complex multi-step tasks

## Best Practices

1. Give agents complete context — they don't see the conversation
2. Launch independent agents in parallel for speed
3. Use foreground when you need results before continuing
4. Use background when you have other work to do
5. Be specific about whether the agent should write code or just research
