"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import toast from "react-hot-toast"

export default function TeamSettingsPage() {
  const teams = useQuery(api.teams.list)
  const createTeam = useMutation(api.teams.create)
  const inviteMember = useMutation(api.teams.invite)

  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("editor")
  const [creating, setCreating] = useState(false)
  const [inviting, setInviting] = useState(false)

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault()
    if (!newTeamName.trim()) return
    setCreating(true)
    try {
      await createTeam({ name: newTeamName.trim() })
      setNewTeamName("")
      toast.success("Team created")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create team")
    }
    setCreating(false)
  }

  async function handleInvite(e: React.FormEvent, teamId: any) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      await inviteMember({ teamId, email: inviteEmail.trim(), role: inviteRole })
      setInviteEmail("")
      toast.success("Invitation sent")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to invite")
    }
    setInviting(false)
  }

  return (
    <div className="space-y-6">
      {/* Teams list */}
      <Card>
        <CardHeader>
          <CardTitle>Your Teams</CardTitle>
          <CardDescription>Workspaces you belong to</CardDescription>
        </CardHeader>
        <CardContent>
          {!teams || teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teams yet.</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team: any) => (
                <div key={team._id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">Role: {team.role}</p>
                    </div>
                  </div>

                  {/* Invite form (only for owner/admin) */}
                  {(team.role === "owner" || team.role === "admin") && (
                    <form onSubmit={(e) => handleInvite(e, team._id)} className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <Input
                        type="email"
                        placeholder="Invite by email..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="px-2 py-1 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <Button type="submit" size="sm" disabled={inviting}>
                        {inviting ? "..." : "Invite"}
                      </Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create team */}
      <Card>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
          <CardDescription>Start a new workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="flex gap-3">
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={creating || !newTeamName.trim()}>
              {creating ? "Creating..." : "Create Team"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
