---
layout: post
title: "Running my life like a small platform"
description: "A second brain is a platform with one user: an inbox for ingest, skills as jobs, cron for scheduled runs, guardrails for the AI, and git for rollback. An intro to how mine works, where the metaphor breaks, and why its structure keeps changing."
date: 2026-11-11
tags: [devops, productivity, devex]
---

**TL;DR:** A second brain isn't a pile of notes - it's a platform with exactly one user. Mine has an inbox for ingest, skills that act as jobs, cron for scheduled runs, a guard around the AI agents and git for rollback. Its structure keeps changing as new use cases show up, and that is by design. Treating it like infrastructure is why it stays trustworthy, and the same lens shows where the comparison breaks.

For years I hoarded notes the way I hoarded half-written blog drafts: plenty of capture, no system behind it. Then life got busy and things became too much to track in my head, with no note I trusted enough to track it for me.

That's when I came across the concept of a second brain: a collection of notes with an agent sitting on top, giving a single user the features I'd expect from any platform - ingest, ownership, sync and a rollback plan. If I wouldn't run production without those, why would I run my own knowledge that way?

## The Platform, Mapped

My second brain is a folder of plain Markdown files edited in Obsidian and versioned in git. AI agents maintain it. Every part has a platform equivalent:

```
capture -> Inbox -> sort -> Notes (Markdown + metadata)
                              |-> skills (jobs)    -> saved reports
                              |-> scheduled runs   -> briefing, calendar
                              '-> git              -> history, rollback
```

- **Inbox is ingest:** Everything lands in one place and gets sorted later. No decisions at capture time.
- **Syncs to my iPhone:** One-way sync via Syncthing and the Synctrain mobile app.
- **Metadata is the schema:** Every note carries `type`, `status`, `sensitivity`, `updated` and `sources`, so confirmed facts stay apart from wishes and open questions.
- **Folders are the architecture:**

```
01 - Inbox/       quick captures
02 - Projects/    one folder per project
03 - Areas/       ongoing responsibilities
04 - Knowledge/   durable reference notes
06 - Journal/     briefings and saved reports
07 - Archives/    nothing is deleted, only archived
08 - System/      skills, templates, standards
```

## Skills and Schedules

A skill is a written workflow: purpose, trigger, what it reads, what it writes, steps and approval gates. A few I use:

- **`/daily-briefing`:** Priorities, due and overdue tasks, project updates and deadlines on one page.
- **`/inbox`:** Sorts quick captures into the right notes.
- **`/new-project`:** Interviews me, then drafts a groomed project note.
- **`/youtube-notes`:** A timestamped summary of a video, shown in chat and saved only if I ask.
- **`/study-quiz`:** Quizzes me from a study note, explains misses and keeps the attempt history.

Most follow the same pipeline: gather, draft, show, approve, write. This post went through it - ideas, an interview about what I actually did, a draft, and a file written only after my yes.

The boring parts run on cron:

```
0 7  * * *  github-progress   # project state, read-only on GitHub
30 7 * * *  calendar-sync     # dated tasks to my calendar
0 12 * * *  daily-briefing
0 20 * * *  evening-inbox     # report only, nothing filed
0 18 * * 0  weekly-changes
0 23 * * 0  backup
0 9  1 * *  monthly-audit
```

The calendar sync only creates events. It never edits or deletes one, and it skips anything already there.

Every run ends in a report, and each finding becomes a `#review` task tagged `fix: auto` or `fix: ask`. A `/fix` command applies the safe ones as one batch (links, stale dates), asks me about the rest one at a time and archives reports with nothing left open.

## Guardrails, Not Trust

Scheduled agents write to my notes while I'm not looking, so each run is controlled:

```
lock -> snapshot -> agent run (scoped) -> scope guard -> logs
```

The lock keeps one writer in the vault at a time. A git snapshot comes first, so any automated change can be reverted. Then the agent may write only inside its job's scope. Afterwards a script checks what changed, copies anything out of scope to quarantine and restores it from the snapshot. Nothing is deleted.

It's also agent agnostic. The rules live in `AGENTS.md`, not in a tool. Claude Code runs my skills interactively through a thin `CLAUDE.md` pointer, another agent (Devin) runs the scheduled jobs, and the slash commands are wrappers that name the same skill file. Switching the scheduler is one variable:

```
AGENT=devin   # or: AGENT=claude
```

The rules are the source of truth, and the agent is just the runtime.

## From Lecture Slides to Study Notes

Lectures are where a lot of my learning happens, and their PDFs are the raw material. The `/ingest-pdf` skill turns a dropped PDF into a linked study note:

- The original PDF is copied, unchanged, into a sources folder.
- The study note covers every page, and the skill checks that each content page is accounted for.
- Each page reference is a link to that page of the PDF, so I can jump from any claim to the slide behind it.
- On request, a one-page cheatsheet with the must-know items, formulas and pitfalls, each with a page link.

The pieces compound. A course note keeps a week-by-week map, a quiz skill tests me on a study note and keeps the attempt history, and a prep skill builds each week's cheatsheet from its deadlines. When a week needed two notes, I gave them letters (04a, 04b) so the order stayed clear.

## It Keeps Changing

The structure isn't finished, and I don't want it to be. Each new use case has pushed a change into the design, and the changes are visible in the vault's own change log. A few examples:

- **Folders moved from flat to numbered.** Early on, notes sat in a few broad folders. Once there were more of them, I moved everything into numbered folders, so the order in the file tree matches how I use it.
- **Projects went from single files to folders.** Each project got its own folder with a standard `Project.md` note and any research beside it.
- **Filenames got fixed.** Dozens of notes shared generic names like `Project.md`, which made the graph view unreadable. Each note now takes its folder's name.
- **Schedules get re-timed.** The daily briefing started at 07:30 and now runs at noon, because noon is when I actually want to read it.
- **Features get dropped.** A weekly review I'd built was replaced by a read-only changes report, because the inbox was enough.
- **Rules get added after something breaks.** The scope guard exists because a sandbox test failed. The validator is the same story: each time a note broke a convention, a check went in to catch the next one. It now covers links, frontmatter, task formats and bare page references in study notes, and it has its own tests. A pre-commit hook runs it before any manual commit.

The rule I've settled on: when a new use case shows up, I change the structure in the open, log the change, and keep the old version in git history. The brain is a working document, not a finished product.

## The Roadmap Is a Backlog Too

The brain has its own roadmap, split into Now, Next and Later, with one rule borrowed from Kanban: an item enters Now only when another one leaves, and Now holds at most three. Anything that connects a service or installs something needs my approval first. A few items I'm most interested in:

- **Study engine:** Spaced repetition built from my quiz history, so weak topics and exam countdowns show up in the daily briefing instead of in my memory.
- **Phone capture:** A dated iOS Shortcut appends thoughts to a separate `phone-inbox/` folder, and the `inbox` skill files them. The catch is that Syncthing doesn't nest folders, and iOS suspends the app, so captures wait until both devices are connected. Real-time capture was never the goal.
- **A UI layer:** A site or app on top of the vault. It isn't scoped yet, and I'd rather decide the data model first.
- **Cloud-hosted brain and cloud automation:** The scheduled jobs would stop depending on my laptop being awake. The open questions are the host, encryption at rest and how Obsidian and Syncthing reach it, because the vault holds sensitive notes. That is why it sits in Later.
- **Agents, not just skills:** Skills are fixed workflows. Agents would have defined roles and their own approval limits. I'd trial one runtime (Hermes Agent) in a separate test space with no access to the live vault first.

```
Now    (max 3)   in progress
Next             picked, not started
Later            ideas, with the open questions written down
```

The same habit applies to the roadmap as to production: write the constraint next to the feature, so the "why not yet" survives.

## Where the Metaphor Breaks

A platform serves many users. Mine serves one, and that user is me at 2 AM wanting a straight answer. That changes the rules. An agent can't be trusted just because it's capable, so the policy is strict: act freely on drafting and linking, act then report on small reversible edits, ask first for anything that deletes, publishes or leaves the vault. It never silently overwrites a fact, and it logs every change.

The other surprise: structure took longer than tooling. The tools were the easy part. Deciding the folders, the metadata and the rules took far more effort, and that's where the value is.

One honest opinion: this is overkill for most people. If a plain notes app keeps you organized, use that. YMMV. I built mine because I had too much to track, and I'd rather maintain a system with proper tooling than trust my memory.

