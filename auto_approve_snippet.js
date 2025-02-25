const trustedTools = [
  "sequentialthinking",
  "fetch",
  "search_google",
  "visit_page",
  "search_esa_posts",
  "read_esa_multiple_posts",
  "read_esa_post",
  "create_directory",
  "write_file",
  "edit_file",
  "list_directory",
  "read_multiple_files",
  "read_file",
  "run_command",
]

let lastExecution = 0
const COOLDOWN_MS = 500

const autoContinue = () => {
  const latestMessageBox = Array.from(
    document.querySelectorAll(`div[data-test-render-count`)
  ).at(-1)

  if (latestMessageBox === undefined) {
    console.log("❌ No message box found")
    return false
  }

  const warningMessage = latestMessageBox.querySelector(
    "div[data-testid=message-warning]"
  )
  if (
    warningMessage === null ||
    warningMessage.innerText !==
      "Claude’s response was limited as it hit the maximum length allowed at this time."
  ) {
    console.log("❌ No warning message found")
    return false
  }

  document.querySelector("div[contenteditable=true]").innerText = "続けて"
  document.querySelector("button[aria-label='Send Message']").click()

  return true
}

const autoApprove = () => {
  console.log("🔍 Checking mutations...")

  const dialog = document.querySelector("[role=dialog]")
  if (!dialog) {
    console.log("❌ No dialog found")
    return false
  }

  const toolName = dialog
    .querySelector("button > div")
    .textContent?.match(/Run (\S+) from/)
    ?.at(1)
  const allowButton = dialog.querySelector("[type=button]")

  if (!toolName || !allowButton) {
    console.error(
      "❌ No tool name or Allow button found",
      toolName,
      allowButton
    )
    return false
  }

  console.log("🛠️ Tool name:", toolName)

  if (trustedTools.includes(toolName)) {
    console.log("🚀 Auto-approving tool:", toolName)
    allowButton.click()
  } else {
    console.log("❌ Tool not in trusted list:", toolName)
  }

  return true
}

const observer = new MutationObserver((mutations) => {
  const now = Date.now()

  if (now - lastExecution < COOLDOWN_MS) {
    console.log("🕒 Still in cooldown period, skipping...")
    return
  }

  try {
    autoContinue()
    autoApprove()
  } catch (error) {
    console.error("❌ Error in observer:", error)
  } finally {
    lastExecution = now
  }
})

// Start observing
console.log("👀 Starting observer for trusted tools:", trustedTools)

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
