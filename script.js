import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import { Octokit } from "@octokit/rest";
import { githubToken } from "./token";
import { GitHubApi } from "./GitHubApi";
const OWNER = "SaketSingh1012";
const REPO = "github_issues_project";

const octokit = new Octokit({
  auth: githubToken,
});

const apiClient = new GitHubApi({ token: githubToken });

function showToast(message, type) {
  Toastify({
    text: message,
    duration: 2000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: type === "success" ? "#00b09a" : "#FF6347",
    },
    onClick: function () {},
  }).showToast();
}

// Function to show issues
async function showIssues() {
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner: OWNER,
      repo: REPO,
    });

    const issuesList = document.getElementById("issues-list");
    issuesList.innerHTML = "";
    issuesList.style.background =
      "linear-gradient(to right, #00eaffa3,#050505)";

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

// Function to create an issue
async function createIssue() {
  const title = document.getElementById("issue-title").value;
  const body = document.getElementById("issue-body").value;

  try {
    await apiClient.createIssue({
      owner: OWNER,
      repo: REPO,
      title: title,
      body: body,
    });

    showToast("Issue created successfully", "success");

    showIssues();
  } catch (error) {
    console.error("Error creating issue:", error);
    showToast("Error creating issue", "error");
  }
}

// Function to update an issue
async function updateIssue(issueNumber) {
  try {
    const updateButton = document.querySelector(
      `.update-button[data-issue-number="${issueNumber}"]`
    );
    updateButton.disabled = true;
    updateButton.style.backgroundColor = "grey";

    const issue = await octokit.rest.issues.get({
      owner: OWNER,
      repo: REPO,
      issue_number: issueNumber,
    });

    const form = document.createElement("form");
    form.innerHTML = `
      <label for="new-title">New Title:</label>
      <input type="text" id="new-title" value="${issue.data.title}" required>
      <label for="new-body">New Body:</label>
      <textarea id="new-body" required>${issue.data.body}</textarea>
      <button type="submit">Update</button>
    `;
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.marginTop = "10px";
    form.style.backgroundColor = "black";

    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.backgroundColor = "white";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "8px";
    dialog.style.border = "2px solid black";
    dialog.appendChild(form);
    document.body.appendChild(dialog);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newTitle = document.getElementById("new-title").value;
      const newBody = document.getElementById("new-body").value;

      await apiClient.updateIssue({
        owner: OWNER,
        repo: REPO,
        id: issueNumber,
        title: newTitle,
        body: newBody,
      });

      document.body.removeChild(dialog);

      showToast("Issue updated successfully", "success");

    });
  } catch (error) {
    console.error("Error updating issue:", error);
    showToast("Error updating issue", "error");
  } finally {
    const updateButton = document.querySelector(
      `.update-button[data-issue-number="${issueNumber}"]`
    );
    updateButton.disabled = false;
  }
}

// Function to close an issue
async function closeIssue(issueNumber) {
  try {
    const closeButton = document.querySelector(
      `.close-button[data-issue-number="${issueNumber}"]`
    );
    closeButton.disabled = true;
    closeButton.style.backgroundColor = "red";

    await apiClient.closeIssue({
      owner: OWNER,
      repo: REPO,
      id: issueNumber,
    });

    showToast("Issue closed successfully", "success");
  } catch (error) {
    console.error("Error closing issue:", error);
    // Show toast for error
    showToast("Error closing issue", "error");
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
