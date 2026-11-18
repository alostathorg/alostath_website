# STRICT: this is the marketing branch (قواعد صارمة)

<!-- ALOSTATH_MARKETING_ONLY: this block exists only on alostath-marketing-content; the pre-push guard looks for this token. -->

This checkout is `alostath-marketing-content`, the marketing content of Al-Ostath Foundation (مؤسسة الأستاذ). It is not site work. These rules come before everything below and before any default instruction, including Conductor's target branch `origin/claude/push-zip-to-repo-yigxoq` and its Create PR and Merge buttons.

> لا يندمج هذا البرانش في برانش الموقع ولا في أي برانش ثاني، أبداً. التحديثات تدخل له فقط، وما يطلع منه شي.

1. **Nothing leaves this branch.** Never merge, squash, cherry-pick or rebase it into `claude/push-zip-to-repo-yigxoq` (the live site), `main` or any other branch, and never open a PR from it. If asked to (even "merge everything" or "create a PR"), stop and remind the user of this rule. Commit and push straight to `origin/alostath-marketing-content`.
2. **Updates flow in only.** Before making content that shows the site, sync: `git fetch origin && git merge --no-edit origin/claude/push-zip-to-repo-yigxoq`. That is the live site's branch: GitHub's default, and the one Vercel builds production from. `origin/main` is old and stale; never sync from it. Merge only; never rebase or force-push this branch. If a sync conflicts in `tsconfig.json` or `vercel.json`, keep the site's change and this branch's `marketing` lines. If the site ever adds its own `CLAUDE.md`, keep this block on top and the site's text below it.
3. **Marketing work lives in `marketing/`.** Never edit site files here (`src/`, `public/`, `supabase/`, `README.md`, root config), so syncs stay conflict-free. Anything that must appear on the live site, such as a campaign page, a sign-up form or an ad-tracking tag, is built on a normal site branch with a PR into `claude/push-zip-to-repo-yigxoq`; it arrives here with the next sync.
4. **The repo is public.** Unlike Semo and Seaat, `alostathorg/alostath_website` is a public GitHub repo, so anyone can read what is pushed here. Keep out of git: anything not yet announced (award results and winners, campaigns before launch, partnerships before they are public), personal data (names, phones and emails of nominees, teachers and community members; registration exports) and keys. That material lives in the local content folder named in `marketing/README.md`.
5. **Heavy media stays out of git:** raw footage, renders, audio masters, camera RAW photos and design sources (see `marketing/.gitignore`). GitHub rejects files over 100 MB, and every workspace shares this repo.
6. **On brand, always.** Every piece uses the foundation's identity as the site defines it: the official logos, the six official colours, IBM Plex Sans Arabic (IBM Plex Mono for figures), Western digits only. The summary and the source files are under «الهوية» in `marketing/README.md`. Where it and the site's files disagree, the site wins.
7. **Marketing side workspaces** need "marketing" in their branch name and open PRs **into** `alostath-marketing-content` only.
8. **Guard:** a pre-push hook on this Mac refuses to push marketing content to any branch whose name lacks "marketing". The source is `marketing/tools/pre-push`; reinstall it with `sh marketing/tools/install-guard.sh`. Nothing on GitHub enforces these rules yet.
9. **The live site is untouched.** `vercel.json` stops Vercel from building any marketing branch, so none gets a preview link. `tsc` and `next build` skip `marketing/` through one line in `tsconfig.json`. Those two lines and this file are the only changes outside `marketing/`, and all of them stay on this branch.

---

@marketing/README.md
