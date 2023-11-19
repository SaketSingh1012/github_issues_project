class GitHubApi {
  constructor({ token }) {
    this.token = token;
  }

  async createIssue({ owner, repo, title, body }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create issue: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to create issue.");
    }
  }

  async updateIssue({ owner, repo, id, title, body }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update issue: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to update issue.");
    }
  }

  async closeIssue({ owner, repo, id }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: "closed" }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to close issue: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to close issue.");
    }
  }
}

export { GitHubApi };
