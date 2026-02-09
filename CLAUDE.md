# CLAUDE.md
## Knowledge Graph System

Before Doing any thing , break down the task and amend and update the .dev_plans.md file in following format.

Workfolders are 
- client (where react app was scaffolded)
- server (where backend server codes was scaffolded)


Follow the following rules, we are using just pure javascript Es6 on Frontend Client and common js will be used on backend.
Follow Important instructions highlighted by `**IMPORTANT**` in CLAUDE.md.

For Frontend
use Arrow Functions 
Do not use vars, semicolon
**IMPORTANT** Do not modify Week3 ,Week2, .decontainer folders

```
# Dev Journal

## Project Snapshot

- Name: Pet Adoption Portal
- Description : platform is designed to help pets find loving homes, and a big part
of that is the user experience on the front end.Should be
intuitive, visually appealing and showcase the pets in a way that makes people want to click
and learn more.
- Goal: Client Server Application Frontend written in React.js , chakra UI  3.24 , react query 5.83. Backend Written in Express with mongodb with mongoose.
- Phase: MVP Complete
- Last Updated: 2026-01-22

## Progress

Overall: 100%

| Area | Progress | Notes |
|------|----------|-------|
| Project setup | 100% | Created Kotlin project structure with src/main/kotlin directory |
| Student data model | 100% | Implemented Student data class with file serialization and verification fields |
| Student management | 100% | Created StudentManager with registration, login, password hashing, and email verification |


## Changelog

- 2026-01-22: Complete: Implemented email verification flow with 6-digit codes


## Priority Queue / To-Do

- [x] Create Kotlin project structure HIGH
  - Set up src/main/kotlin directory
  - Create data directory for student storage


### Future Enhancements (Optional)

- [ ] Add actual email sending integration LOW
  - Integrate with email service (SendGrid, AWS SES, etc.)
- [ ] Add email validation LOW
  - Validate email format using regex


## Test Policy
- Not Required

## Active Work Slots

| Owner | Area | Task | Status |
|-------|------|------|--------|
|       |      |      |        |

```

CRITICAL RULE:
After ANY code change, you MUST update `KNOWLEDGE.md`, create KNOWLEDGE.md if not exist:
1) New Entities
2) New Relationships
3) Patterns Applied
4) New Components
5) New UI Changes
.

