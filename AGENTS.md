<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database Operations Rule

## Strict Supabase MCP Requirement
- **Requirement:** For all database operations, schema inspections, data retrieval, table modifications, or any SQL queries, the agent MUST use the configured **Supabase MCP** server.
- **Scope:** This rule is strictly applicable across every single stage and phase of the workflow.
- **Constraints:** Do not attempt to run direct local database command-line tools or write ad-hoc Python/Node scripts to query the database unless explicitly requested by the user. Use the `mcp` tool actions corresponding to the registered Supabase server.

