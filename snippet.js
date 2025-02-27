/**
 * Claude Desktop の補助スクリプト
 * Cmd + Alt + Shift + i で Developer Console を開いて、このスクリプトを貼り付けることで実行できる
 * 2つウィンドウが開くけど、「AI」というログが出てる方(https://claude.ai/new の方)に貼り付ける
 *
 * 機能:
 * - trustedTools については Auto Approve させる
 * - Claude が1レスポンスの上限で止まってしまった場合は自動で「続けて」と送信する
 * - Enter を送信ではなく改行に割り当てる。Shift 以外の装飾キー有りの場合はなにもしないので Ctrl + Enter や Command + Enter で送信できる
 */

const trustedTools = [
  "fetch",
  "search_esa_posts",
  "read_esa_post",
  "read_esa_multiple_posts",
  "search",
  "read_file",
  "read_multiple_files",
  "list_directory",
  "directory_tree",
  "search_files",
  "get_file_info",
  "list_allowed_directories",
  // 更新系は一応許可必要にする
  // "run_command",
  // "run_script",
  // "write_file",
  // "edit_file",
  // "create_directory",
  // "move_file",
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

const handleKeydown = (event) => {
  const contentEditableAttr = event.target.getAttribute("contenteditable")
  if (contentEditableAttr !== "true") {
    console.log(
      "[DEBUG] contenteditable 属性が設定されていないのでスキップします。",
      event.target
    )
    return
  }

  // Enterキーのみの場合（Shift 以外の修飾キーなし）
  const isOnlyEnter = event.key === "Enter" && !(event.ctrlKey || event.metaKey)

  // Enter を無効にして改行判定の Shift+Enter に差し替える
  // 装飾キーがない場合はハンドリングされないので、適当な装飾キーをつければ送信できる
  if (isOnlyEnter) {
    console.log("[DEBUG] Enterキーのため処理を実行")
    // Enter単体でのイベントをキャンセル
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    // Shift+Enterイベントを新たに発行する
    console.log("[DEBUG] Shift+Enter イベントを発行します")
    const newEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    })

    event.target.dispatchEvent(newEvent)
  } else {
    console.log("[DEBUG] Enter キーでないのでなにもしません")
  }
}

// Execute Script
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

const entry = () => {
  if (window.customScriptEnabled) {
    console.log("カスタムスクリプトはすでに有効なのでスキップします。")
    return
  }

  // Start observing
  console.log(
    "👀 AutoApprove するツールの observing を開始します。",
    trustedTools
  )
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  console.log("👀 キーバインドの変更を当てる Listener を設定しました。")
  // WARN: Claude 本体の Listener が document に capture で設定されているので window & capture でないと先にハンドリングできない
  window.addEventListener("keydown", handleKeydown, { capture: true })

  window.customScriptEnabled = true

  console.log("✅ カスタムスクリプトが有効になりました。")
}

entry()
