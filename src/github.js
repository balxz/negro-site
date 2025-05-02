const path = require("path")
const fs = require("fs")
const { Octokit } = require("@octokit/rest")

/** configs **/
const GITHUB_TOKEN = "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" 
const REPO_OWNER = "balxz"
const REPO_NAME = "negro-site"
const BRANCH = "master" 

async function uploadToGitHub(filePath) {
  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const fileContent = fs.readFileSync(filePath, "base64")
  const fileName = path.basename(filePath)
  const fullPath = `public/${fileName}`

  try {
  
  /** check **/
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: fullPath,
      ref: BRANCH
    })
    
    /** update **/
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: fullPath,
      message: `update ${fileName}`,
      content: fileContent,
      sha: fileData.sha,
      branch: BRANCH
    })
  } catch (e) {
  
  /** create **/
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: fullPath,
      message: `add ${fileName}`,
      content: fileContent,
      branch: BRANCH
    })
  }
}

module.exports = { uploadToGitHub }
