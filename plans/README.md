# Execution Plans

This directory contains execution plans and their associated tasks for the project.

## Directory Structure and Naming Conventions

Every plan will have its own dedicated directory following the naming pattern: `PLAN-YYYYMMDD-XX-short_description`.
- `YYYYMMDD`: The date the plan was created.
- `XX`: A sequential number for the day (e.g., `01`, `02`).
- `short_description`: A concise description of the plan.

**Example:** `PLAN-20260331-01-add_user_test`

Inside each plan's directory, the following structure must be maintained:

1. **`PLAN.md`**: The main file containing the detailed execution plan mapping the goal, proposed changes, and verification sequence.
2. **`tasks/`**: A subdirectory containing individual task files.
   - Task files must follow the naming pattern: `TASKXXX-short_task_name.md`.
   - `XXX`: A padded sequential number detailing the task sequence (e.g., `001`, `002`).
   - `short_task_name`: A concise description of the task.
   - **Example:** `TASK001-add_unit_user_tests.md`

## The `purge` Directory

The `/plans/purge` directory is reserved for holding plans and tasks that are either deprecated, abandoned, or have been fully executed and are no longer relevant to the active project state but are kept for historical context.
