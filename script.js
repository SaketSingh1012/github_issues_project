import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "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",
});

async function showIssues() {
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner: "SaketSingh1012",
      repo: "github_issues_project",
    });

    const issuesList = document.getElementById("issues-list");
    issuesList.innerHTML = "";

    response.data.forEach((issue) => {
      const issueElement = document.createElement("div");
      issueElement.innerHTML = `
        <strong>${issue.title}</strong>
        <p>${issue.body}</p>
        <p>State: ${issue.state}</p>
        <button class="update-button" data-issue-number="${issue.number}">Update</button>
        <button class="close-button" data-issue-number="${issue.number}">Close</button>
        <hr>
      `;
      issuesList.appendChild(issueElement);
    });

    const updateButtons = document.querySelectorAll(".update-button");
    updateButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const issueNumber = button.dataset.issueNumber;
        await updateIssue(issueNumber);
        showIssues();
      });
    });

    const closeButtons = document.querySelectorAll(".close-button");
    closeButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const issueNumber = button.dataset.issueNumber;
        await closeIssue(issueNumber);
        showIssues();
      });
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
  }
}

async function createIssue() {
  const title = document.getElementById("issue-title").value;
  const body = document.getElementById("issue-body").value;

  try {
    await octokit.rest.issues.create({
      owner: "SaketSingh1012",
      repo: "github_issues_project",
      title: title,
      body: body,
    });
    showIssues();
  } catch (error) {
    console.error("Error creating issue:", error);
  }
}

async function updateIssue(issueNumber) {
  try {
    const updateButton = document.querySelector(
      `.update-button[data-issue-number="${issueNumber}"]`
    );
    updateButton.disabled = true;
    updateButton.style.backgroundColor = 'blue';

    const issue = await octokit.rest.issues.get({
      owner: "SaketSingh1012",
      repo: "github_issues_project",
      issue_number: issueNumber,
    });

    const newTitle = prompt("Enter new title:", issue.data.title);
    const newBody = prompt("Enter new body:", issue.data.body);

    await octokit.rest.issues.update({
      owner: "SaketSingh1012",
      repo: "github_issues_project",
      issue_number: issueNumber,
      title: newTitle,
      body: newBody,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
  } finally {
    const updateButton = document.querySelector(
      `.update-button[data-issue-number="${issueNumber}"]`
    );
    updateButton.disabled = false;
  }
}

async function closeIssue(issueNumber) {
  try {
    const closeButton = document.querySelector(
      `.close-button[data-issue-number="${issueNumber}"]`
    );
    closeButton.disabled = true;
    closeButton.style.backgroundColor = 'red';
    await octokit.rest.issues.update({
      owner: "SaketSingh1012",
      repo: "github_issues_project",
      issue_number: issueNumber,
      state: "closed",
    });
  } catch (error) {
    console.error("Error closing issue:", error);
  } finally {
    const closeButton = document.querySelector(
      `.close-button[data-issue-number="${issueNumber}"]`
    );
    closeButton.disabled = false;
  }
}

showIssues();

document
  .getElementById("create-issue-button")
  .addEventListener("click", createIssue);
