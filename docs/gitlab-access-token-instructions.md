# How to Generate a GitLab Access Token

To integrate KaironTask with GitLab Issues and Merge Requests, create an access token with the `api` scope.

## Personal Access Token

1. Open your GitLab **User Settings** → **Access Tokens**.
2. Create a new personal access token with a descriptive name (for example, `KaironTask`).
3. Enable the **`api`** scope so KaironTask can read issues, merge requests, and submit worklogs.
4. Copy the generated token and paste it into the KaironTask GitLab integration settings.

## Project Access Token

If you use GitLab Premium/Ultimate or self-hosted GitLab, you can alternatively generate a **Project Access Token** scoped to a single repository:

1. Open your repository **Settings** → **Access Tokens**.
2. Select a role with issue read/write permissions (see the [GitLab Permissions Documentation](https://docs.gitlab.com/ee/user/permissions.html#project-planning)).
3. Enable the **`api`** scope and copy the generated token into KaironTask.

For GitHub integration, see [GitHub Access Token Instructions](./github-access-token-instructions.md).
