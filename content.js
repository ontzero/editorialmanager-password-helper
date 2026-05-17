(() => {
  const STORAGE_PREFIX = "emCredential:";
  const TOOLBAR_ID = "em-password-helper-toolbar";
  const MESSAGE_SOURCE = "em-password-helper";

  function getJournalKey() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const journalPart = pathParts[0] || "root";
    return `${window.location.origin}/${journalPart.toLowerCase()}`;
  }

  function getPageLabel() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const journalPart = pathParts[0] || "Editorial Manager";
    return journalPart;
  }

  function findCredentialFields() {
    const inputs = Array.from(document.querySelectorAll("input"));
    const password = inputs.find((input) => {
      return input.type && input.type.toLowerCase() === "password" && !input.disabled;
    });

    if (!password) {
      return { username: null, password: null };
    }

    const passwordIndex = inputs.indexOf(password);
    const candidates = inputs.slice(0, passwordIndex).reverse();
    const username =
      candidates.find((input) => {
        const type = (input.type || "text").toLowerCase();
        const name = `${input.name || ""} ${input.id || ""}`.toLowerCase();
        return (
          ["text", "email", "search", ""].includes(type) &&
          !input.disabled &&
          !input.readOnly &&
          !name.includes("search")
        );
      }) || null;

    return { username, password };
  }

  function dispatchInputEvents(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function notify(message, isError = false) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = [
      "position:fixed",
      "right:18px",
      "bottom:18px",
      "z-index:2147483647",
      "max-width:320px",
      "padding:10px 12px",
      "border-radius:6px",
      "font:13px/1.4 Arial,sans-serif",
      "box-shadow:0 8px 24px rgba(0,0,0,.18)",
      `background:${isError ? "#8f1d1d" : "#144f3d"}`,
      "color:#fff"
    ].join(";");
    document.documentElement.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2800);
  }

  async function saveCredentialsLocal() {
    const { username, password } = findCredentialFields();
    if (!username || !password) {
      return false;
    }

    const usernameValue = username.value.trim();
    const passwordValue = password.value;
    if (!usernameValue || !passwordValue) {
      notify("Enter the username and password first, then save.", true);
      return true;
    }

    const key = STORAGE_PREFIX + getJournalKey();
    await chrome.storage.local.set({
      [key]: {
        key: getJournalKey(),
        label: getPageLabel(),
        username: usernameValue,
        password: passwordValue,
        savedAt: new Date().toISOString()
      }
    });
    notify(`Saved credentials for ${getPageLabel()}.`);
    return true;
  }

  async function fillCredentialsLocal() {
    const { username, password } = findCredentialFields();
    if (!username || !password) {
      return false;
    }

    const key = STORAGE_PREFIX + getJournalKey();
    const result = await chrome.storage.local.get(key);
    const credential = result[key];
    if (!credential) {
      notify(`No saved credentials for ${getPageLabel()}.`, true);
      return true;
    }

    username.focus();
    username.value = credential.username || "";
    dispatchInputEvents(username);
    password.focus();
    password.value = credential.password || "";
    dispatchInputEvents(password);
    notify(`Filled credentials for ${credential.label || getPageLabel()}.`);
    return true;
  }

  function askFrames(action) {
    return new Promise((resolve) => {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      let handled = false;

      function onMessage(event) {
        const data = event.data || {};
        if (
          data.source === MESSAGE_SOURCE &&
          data.type === "response" &&
          data.requestId === requestId &&
          data.handled
        ) {
          handled = true;
          window.removeEventListener("message", onMessage);
          resolve(true);
        }
      }

      window.addEventListener("message", onMessage);
      window.postMessage(
        {
          source: MESSAGE_SOURCE,
          type: "request",
          requestId,
          action
        },
        "*"
      );

      window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(handled);
      }, 800);
    });
  }

  async function saveCredentials() {
    if (await saveCredentialsLocal()) {
      return;
    }

    if (window.top === window && (await askFrames("save"))) {
      return;
    }

    notify("Could not find username and password fields on this page.", true);
  }

  async function fillCredentials() {
    if (await fillCredentialsLocal()) {
      return;
    }

    if (window.top === window && (await askFrames("fill"))) {
      return;
    }

    notify("Could not find username and password fields on this page.", true);
  }

  window.addEventListener("message", async (event) => {
    const data = event.data || {};
    if (data.source !== MESSAGE_SOURCE || data.type !== "request") {
      return;
    }

    if (window.top === window) {
      return;
    }

    let handled = false;
    if (data.action === "save") {
      handled = await saveCredentialsLocal();
    } else if (data.action === "fill") {
      handled = await fillCredentialsLocal();
    }

    if (handled) {
      window.top.postMessage(
        {
          source: MESSAGE_SOURCE,
          type: "response",
          requestId: data.requestId,
          handled: true
        },
        "*"
      );
    }
  });

  function shouldShowToolbarInThisFrame() {
    return Boolean(findCredentialFields().password);
  }

  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", onClick);
    button.style.cssText = [
      "border:0",
      "border-radius:4px",
      "padding:7px 9px",
      "font:12px Arial,sans-serif",
      "cursor:pointer",
      "background:#2357a4",
      "color:white"
    ].join(";");
    return button;
  }

  function injectToolbar() {
    if (document.getElementById(TOOLBAR_ID)) {
      return;
    }

    if (!shouldShowToolbarInThisFrame()) {
      return;
    }

    const toolbar = document.createElement("div");
    toolbar.id = TOOLBAR_ID;
    toolbar.style.cssText = [
      "position:fixed",
      "right:16px",
      "top:88px",
      "z-index:2147483647",
      "display:flex",
      "gap:8px",
      "align-items:center",
      "padding:8px",
      "border:1px solid #d7dde8",
      "border-radius:6px",
      "background:#fff",
      "box-shadow:0 8px 24px rgba(0,0,0,.14)"
    ].join(";");

    const label = document.createElement("span");
    label.textContent = getPageLabel();
    label.title = getJournalKey();
    label.style.cssText = "max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:12px Arial,sans-serif;color:#253047";

    toolbar.append(
      label,
      createButton("Fill", fillCredentials),
      createButton("Save", saveCredentials)
    );

    document.documentElement.appendChild(toolbar);
  }

  injectToolbar();
  window.setTimeout(injectToolbar, 500);
  window.setTimeout(injectToolbar, 1500);

  const observer = new MutationObserver(injectToolbar);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
