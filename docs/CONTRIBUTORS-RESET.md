# Unwanted Contributors — Root Cause & Fix

## Root cause

The repo shows **600+ contributors** (e.g. sokra, jaredpalmer, mehulkar, chris-olszewski, tknickman, vercel[bot]) because it inherited **full git history** from an upstream template.

### Evidence

| Check | Result |
|------|--------|
| Root commit | `eb27309e` (2019-08-22) by "Goren G" — "Initial commit" |
| Total commits (main) | ~8,700 |
| Top contributors (GitHub API) | sokra (Webpack), jaredpalmer (Turborepo), mehulkar (Vercel), chris-olszewski (Vercel), tknickman (Turborepo) |
| GitHub `fork` flag | `false` — not a fork, but history was copied during repo creation |

The project was likely created from a **Turborepo / Vercel monorepo template** that was cloned or copied with full history. Turborepo/Next.js templates often include commits from the parent ecosystem, so all past contributors appear in your repo.

---

## Fix: Fresh history (orphan branch)

The only way to reset contributors is to **replace all history** with a single commit containing the current tree. GitHub computes contributors from commit authorship; there is no way to hide or filter them.

### Effects of the fix

- Contributors list will show only you (`pohlai88`) until others commit.
- All prior history, blame, and commit links will be gone.
- Force push is required; anyone with a clone will need to re-clone or `git fetch && git reset --hard origin/main`.

### Prerequisites

- You have pushed everything you want to keep (current state on disk).
- You have push access to the remote.
- You are aware this is **destructive** and cannot be undone.

---

## Branch protection blocks force-push

If `main` has branch protection (no force-push, required status checks), the script cannot push directly. The fresh history has been pushed to **`main-fresh`**. To complete the reset:

1. In GitHub: **Settings → Branches → Branch protection rule for `main`**
2. Temporarily **disable** "Do not allow force pushes" (or add an admin exception)
3. Optionally disable "Require status checks" for this one push
4. From repo root: `git push -f origin main`
5. Re-enable branch protection
6. Delete `main-fresh` after verifying contributors

Alternatively: change the default branch to `main-fresh`, delete `main`, then rename `main-fresh` → `main` in GitHub (more steps).

---

## Run the reset script

From the repo root, using Git Bash (or WSL):

```bash
./scripts/reset-contributors.sh
```

Or run the commands manually (see [ Manual steps ](#manual-steps) below).

---

## Manual steps

```bash
# 1. Ensure working tree is clean and up to date
git status
git add -A && git status

# 2. Create orphan branch (no parent history)
git checkout --orphan fresh-main

# 3. Stage all tracked + untracked (respects .gitignore)
git add -A

# 4. Commit everything as a single initial commit
git commit -m "Initial commit: AFENDA-NEXUS monorepo"

# 5. Replace main with the new history
git branch -D main
git branch -m fresh-main main

# 6. Force push (REQUIRED — overwrites remote history)
git push -f origin main

# 7. (Optional) Recreate and push other branches from main
git checkout -b erp
git push -f origin erp
```

After step 6, the repo will have one commit and only your account as contributor.

---

## Push to new repo (after deleting old)

If you **delete the repo and create a new one**, follow this to avoid re-introducing unwanted contributors:

**Critical:** Only `main` has clean history (1 commit). Branches `erp` and `feat/security-stack` still contain the old 8,700-commit history — do **not** push them.

```bash
# 1. Verify main has exactly 1 commit (no inherited history)
git checkout main
git rev-list --count main   # must show: 1

# 2. Remove branches that contain old history (prevents accidental push)
git branch -D erp feat/security-stack

# 3. Delete old remote (after you've deleted the repo)
git remote remove origin

# 4. Add the new repo as origin
git remote add origin https://github.com/pohlai88/YOUR-NEW-REPO.git

# 5. Push only main
git push -u origin main

# 6. Recreate erp from main when needed
git checkout -b erp
git push -u origin erp
```

**Optional:** Prune local git objects so old history is fully gone:
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## If you need to preserve some history

If you want to keep commits from a specific point (e.g. only AFENDA work), you can use `git rebase -i` or `git filter-branch` to squash a range of commits. That is more complex and outside the scope of this document.
