const STORAGE_PREFIX = "emCredential:";

function formatDate(value) {
  if (!value) {
    return "unknown";
  }
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

async function getEntries() {
  const data = await chrome.storage.local.get(null);
  return Object.entries(data)
    .filter(([key]) => key.startsWith(STORAGE_PREFIX))
    .map(([storageKey, credential]) => ({ storageKey, ...credential }))
    .sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
}

async function deleteEntry(storageKey) {
  await chrome.storage.local.remove(storageKey);
  await render();
}

async function render() {
  const root = document.getElementById("entries");
  const entries = await getEntries();
  root.textContent = "";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No credentials saved yet.";
    root.appendChild(empty);
    return;
  }

  for (const entry of entries) {
    const item = document.createElement("section");
    item.className = "entry";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = entry.label || entry.key || "Editorial Manager";

    const username = document.createElement("div");
    username.className = "meta";
    username.textContent = `Username: ${entry.username || ""}`;

    const key = document.createElement("div");
    key.className = "meta";
    key.textContent = `Key: ${entry.key || ""}`;

    const savedAt = document.createElement("div");
    savedAt.className = "meta";
    savedAt.textContent = `Saved: ${formatDate(entry.savedAt)}`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteEntry(entry.storageKey));

    actions.append(remove);
    item.append(title, username, key, savedAt, actions);
    root.appendChild(item);
  }
}

document.getElementById("refresh").addEventListener("click", render);
render();
