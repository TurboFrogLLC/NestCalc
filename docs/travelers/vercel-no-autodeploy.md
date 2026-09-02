# Traveler

Repo: NestCalc
Owner: wReckless
Part: Vercel git auto-deploy off
Description: Stop Vercel builds on every Git push. Local `npx vercel --prod` stays the deploy.
PR: 132
Branch: docs/vercel-no-autodeploy
Head: c79211ef20f89a7db538ede4cbd5760984f81042
Session: fresh
job_id: NGJ-20260902-vercel-git
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               one Cut. git.deploymentEnabled false. Local deploy  c79211ef20f89a7db538ede4cbd5760984f81042
2    Start-branch       Owner local soft-sync
3    Cut                vercel.json git.deploymentEnabled false
4    Send for review    Owner look. No Codex unless named
5    Inspection
6    Merge
7    Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/vercel-no-autodeploy.md
When this packets log → docs/travelers/vercel-no-autodeploy-packets.md
When Vercel git config → https://vercel.com/docs/project-configuration/git-configuration

Do not touch COMPOSITION-FLIPIT-v3.html.
Do not touch traveler 131.
Do not pause the Vercel project.
Do not disconnect Git.

## Cut lock

### Cut 1 — vercel.json
Add repo-root `vercel.json` with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": false
  }
}
```

If a vercel.json already exists, merge that key. Do not replace unrelated keys.
Pushes to any branch stop creating Vercel deployments.
Owner deploys from the laptop with `npx vercel --prod --yes` in the NestCalc worktree.
Project stays linked: prj_p5OV6mDAzqLGBpkXVzbR1rsgtjus nest-calc / TurboFrogLLC/NestCalc.
