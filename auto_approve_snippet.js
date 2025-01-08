const trustedTools = [
  "sequentialthinking",
  "fetch",
  "search_google",
  "visit_page",
]

let lastClickTime = 0
const COOLDOWN_MS = 1000

const observer = new MutationObserver((mutations) => {
  const now = Date.now()

  if (now - lastClickTime < COOLDOWN_MS) {
    console.log("🕒 Still in cooldown period, skipping...")
    return
  }

  console.log("🔍 Checking mutations...")

  const dialog = document.querySelector("[role=dialog]")
  if (!dialog) {
    console.log("❌ No dialog found")
    return
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
    return
  }

  console.log("🛠️ Tool name:", toolName)

  if (trustedTools.includes(toolName)) {
    console.log("🚀 Auto-approving tool:", toolName)
    lastClickTime = now
    allowButton.click()
  } else {
    console.log("❌ Tool not in trusted list:", toolName)
  }
})

// Start observing
console.log("👀 Starting observer for trusted tools:", trustedTools)

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
