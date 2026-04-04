---
name: monitor
description: Check Vercel deployment logs for errors, diagnose issues, and fix them. Use with `/loop 5m /monitor` for continuous monitoring.
user_invocable: true
---

# /monitor — Vercel Log Monitor

Check production logs for errors, diagnose root causes, and fix them.

## What this does

1. Pull recent Vercel function logs via CLI
2. Filter for errors (5xx, uncaught exceptions, timeouts)
3. Diagnose the root cause from stack traces
4. If fixable — create a fix and show the diff
5. If not fixable — report the issue with context

## Steps

### 1. Check deployment status
```bash
vercel ls --limit 3
```
Note the latest deployment URL and status.

### 2. Pull function logs
```bash
vercel logs --limit 50 --output json 2>/dev/null || vercel logs --limit 50
```
If JSON output fails, parse the text output.

### 3. Filter for errors
Look for:
- HTTP 500, 502, 503, 504 responses
- `Error:`, `TypeError:`, `ReferenceError:` in output
- `FUNCTION_INVOCATION_TIMEOUT`
- `EDGE_FUNCTION_INVOCATION_FAILED`
- Unhandled promise rejections

### 4. Diagnose
For each error found:
- Read the stack trace to identify the file and line
- Read that file in the codebase
- Determine if it's a code bug, config issue, or external service failure

### 5. Act
- **Code bug** → Fix it, show the diff, explain what was wrong
- **Config issue** → Tell the user what env var or setting to change
- **External service down** → Report it, no code change needed
- **No errors** → Report "All clear — no errors in recent logs"

## Usage

One-time check:
```
/monitor
```

Continuous monitoring (checks every 5 minutes):
```
/loop 5m /monitor
```

Schedule a daily check:
```
/schedule "Check production logs" --cron "0 9 * * *" --prompt "/monitor"
```
