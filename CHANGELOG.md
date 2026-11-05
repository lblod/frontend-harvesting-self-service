## Unreleased

## v2.9.0 (2026-11-05)

#### :rocket: Enhancement

- Require the subject of a job or scheduled job to be a URI or empty, and trim the input
- Show the endpoint of the scheduled job on jobs it created, falling back to the job's own tasks
- Scheduled jobs overview: link titles to the details page and show schedules in readable form
- Scheduled job details: show the URI, which moved from the overview
- Stop loading tasks on the jobs overview

#### :bug: Bug Fix

- Reset the subject when opening the new scheduled job form
- Clear the subject when switching to a job type without a subject field

#### :house: Internal

- Drop route mixins
- Simplify error handling
- Bump browserslist
g
## v2.8.0 (2026-10-22)

#### :rocket: Enhancement

- Add dct:subject to job creation and scheduled job creation

## v2.6.1 (2026-02-02)

#### :bug: Bug Fix

- [#41](https://github.com/lblod/frontend-harvesting-self-service/pull/41) fix(authentication-configuration): fix handling of input fields ([@elpoelma](https://github.com/elpoelma))

## v2.6.0 (2025-10-14)

#### :rocket: Enhancement

- [#40](https://github.com/lblod/frontend-harvesting-self-service/pull/40) [DL-6794] Add ACM/IDM as an authentication option ([@Windvis](https://github.com/Windvis))

#### :house: Internal

- [#39](https://github.com/lblod/frontend-harvesting-self-service/pull/39) [DL-6725] Update to the Ember v5.12 LTS blueprint ([@Windvis](https://github.com/Windvis))
- [#38](https://github.com/lblod/frontend-harvesting-self-service/pull/38) Dependency maintenance ([@Windvis](https://github.com/Windvis))
- [#36](https://github.com/lblod/frontend-harvesting-self-service/pull/36) Update to node 22 ([@Windvis](https://github.com/Windvis))
