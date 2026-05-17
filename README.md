# Editorial Manager Password Helper

[中文说明](#中文说明) | [English](#english)

## 中文说明

这是一个 Chrome / 360Chrome 扩展，用来为 `https://www.editorialmanager.com/` 下的不同期刊分别保存投稿系统账号密码。

它解决的问题是：很多期刊都在同一个域名 `www.editorialmanager.com` 下，普通浏览器密码保存功能可能只按域名识别，导致不同期刊的密码互相混淆。本扩展会按期刊路径分别保存。

例如，下面两个地址会保存成不同记录：

- `https://www.editorialmanager.com/journal-a/...`
- `https://www.editorialmanager.com/journal-b/...`

### 功能

- 按 Editorial Manager 的期刊路径分别保存账号密码
- 在登录页附近显示 `Fill` 和 `Save` 按钮
- 支持登录表单位于 iframe 内的页面结构
- 本地保存，不联网、不上传
- 可在扩展弹窗中查看和删除已保存记录

### 安装方法

1. 下载或克隆本仓库。
2. 打开浏览器扩展管理页面。
   - Chrome：`chrome://extensions`
   - 360Chrome：通常也可以打开 `chrome://extensions`，或从浏览器菜单进入扩展管理页面。
3. 开启“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择本仓库文件夹。

如果你已经加载过旧版本，修改文件后需要在扩展管理页面点击这个扩展的“重新加载”，然后刷新 Editorial Manager 页面。

### 使用方法

1. 打开某个期刊的 Editorial Manager 登录页面。
2. 手动输入用户名和密码。
3. 点击页面中的 `Save`。
4. 下次回到同一个期刊登录页面时，点击 `Fill` 自动填入。

点击浏览器工具栏里的扩展图标，可以查看已经保存的期刊记录，也可以删除不需要的记录。

### 保存规则

扩展会使用当前地址的“域名 + 期刊路径第一段”作为保存 key。

例如：

- `https://www.editorialmanager.com/abc/...` 会保存为 `https://www.editorialmanager.com/abc`
- `https://www.editorialmanager.com/xyz/...` 会保存为 `https://www.editorialmanager.com/xyz`

因此，即使这些期刊都在同一个域名下，也会分别保存。

### 安全说明

账号密码只保存在当前浏览器本地的 `chrome.storage.local` 中。本扩展不会把密码发送到任何服务器，也没有联网逻辑。

不过，它不是专业密码管理器，也不是独立加密保险箱。建议只在你信任的电脑、浏览器和用户配置中使用。不要在公用电脑或不受信任的浏览器配置里保存密码。

---

## English

This is a Chrome / 360Chrome extension that saves Editorial Manager credentials separately for different journal paths under `https://www.editorialmanager.com/`.

It addresses a common annoyance: many journals use the same `www.editorialmanager.com` domain, while built-in browser password managers may treat them as the same site. This extension separates saved credentials by journal path.

For example, these pages are stored as different entries:

- `https://www.editorialmanager.com/journal-a/...`
- `https://www.editorialmanager.com/journal-b/...`

### Features

- Saves credentials separately by Editorial Manager journal path
- Shows `Fill` and `Save` buttons near the login form
- Supports login forms embedded inside iframes
- Stores data locally only, with no network upload
- Provides a popup for reviewing and deleting saved entries

### Installation

1. Download or clone this repository.
2. Open the browser extensions page.
   - Chrome: `chrome://extensions`
   - 360Chrome usually supports `chrome://extensions`, or an extensions page from its browser menu.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this repository folder.

If you already loaded an older version, click Reload for this extension on the extensions page, then refresh the Editorial Manager page.

### Usage

1. Open an Editorial Manager login page for a journal.
2. Type your username and password manually.
3. Click `Save` on the page.
4. Next time you return to the same journal login page, click `Fill`.

Click the extension icon in the browser toolbar to review saved journal entries or delete old ones.

### Matching Rule

The extension uses the current page's origin plus the first journal path segment as the storage key.

Examples:

- `https://www.editorialmanager.com/abc/...` is saved as `https://www.editorialmanager.com/abc`
- `https://www.editorialmanager.com/xyz/...` is saved as `https://www.editorialmanager.com/xyz`

This keeps credentials separate even when journals share the same domain.

### Security Notes

Credentials are stored in the current browser profile through `chrome.storage.local`. This extension does not send passwords to any server and does not include network upload logic.

However, it is not a dedicated password manager or an encrypted vault. Use it only on a trusted computer and browser profile. Do not save passwords on shared or untrusted machines.
