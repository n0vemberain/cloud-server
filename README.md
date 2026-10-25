# Personal Cloud Server

A modern, responsive personal cloud server application. Turn your computer into a secure, private cloud server accessible over local Wi-Fi or across the internet from any smartphone, tablet, or PC with zero router configuration.

---

## Table of Contents

- Overview
- Key Features
- Technology Stack
- Step-by-Step Installation & Quick Start
- Cross-Platform Compatibility Analysis (macOS vs Windows vs Linux)
- Configuration & Customization
- API Endpoints Reference
- Security Architecture

---

## Overview

Personal Cloud Server is a lightweight, self-hosted cloud platform built on Node.js and Express. It enables users to browse, stream, edit, upload, and download files from their computer remotely from any mobile or desktop web browser. It features dual network access (LAN direct access and encrypted Cloudflare Quick Tunnels), role-based multi-user support (Admin and Guest accounts), real-time notifications with download auditing, live direct messaging, and active session management with one-click revocation.

---

## Key Features

### 1. Dual Network Access
- **Local Wi-Fi Access**: Connect directly via your machine's local IP address (e.g., `http://192.168.x.x:7890`) for maximum local transfer speeds.
- **Remote Internet Access**: Access your files from anywhere in the world over cellular data (4G/5G) or outside Wi-Fi via an encrypted Cloudflare Quick Tunnel (`https://xxxx.trycloudflare.com`) without opening router ports or exposing public IP addresses.
- **QR Code Pairing**: Instant pairing for smartphones and tablets by scanning the QR code in the terminal or web dashboard.

### 2. Multi-User & Access Control
- **Administrator Account**: Full unrestricted access to the filesystem, user management, connection history, permission requests, and server configuration.
- **Guest Accounts**: Dedicated guest logins with granular permissions:
  - Custom folder scoping (restrict access to specific folder paths).
  - Toggles for file download, upload, write/edit, and delete permissions.
  - Permission requests: Guests can request additional folder or feature permissions directly from the interface.

### 3. Real-Time Notifications & Download Activity Feed
- **Download Tracking**: Real-time auditing of downloaded files and folders (shows file name, path, file size, timestamp, downloader username, and role).
- **Unified Notification Feed**: Single unified panel presenting download events, pending permission requests, and security audit logs in chronological order.
- **Filter Tabs**: Quickly toggle between "All Activity", "Downloads", and "Requests".
- **Permission Workflows**: One-click approval or rejection of guest permission requests by the administrator.

### 4. Interactive Messaging & Server Chat
- **Direct Messaging**: Private communication channel between Administrator and Guest users.
- **Server Chat Room**: Public announcement and discussion channel accessible to all connected users.
- **Unread Counters**: Real-time unread badges on the chat bubble icon in the top header.

### 5. File Operations & Media Management
- **File Explorer**: Fast directory navigation with breadcrumbs, grid/list view toggles, hidden files toggle, and instant search.
- **Code & Text Editor**: In-browser editor with line numbers, monospace font, and keyboard shortcut (`Cmd + S` or `Ctrl + S`) for editing `.txt`, `.md`, `.js`, `.py`, `.json`, `.sh`, `.env`, and other plain text formats.
- **Media Streaming**: High-performance video streaming supporting HTTP 206 Partial Content range requests, audio player, image lightbox viewer, and document viewer.
- **Drag-and-Drop Uploads**: Multi-file uploads with real-time percentage progress bar.
- **Instant Downloads**: Single file downloads or entire folder downloads packaged as ZIP archives on the fly.
- **Trash Safety**: File deletions safely route to the operating system trash bin rather than executing permanent destructive unlinks.

### 6. Session Management & Disconnect Control
- **Active Connections Monitor**: Live list of currently connected devices displaying device type, browser, IP address, connection medium (LAN vs Remote Tunnel), and last active timestamp.
- **One-Click Disconnect**: Administrators can immediately disconnect any active connection.
- **Session Revocation**: Disconnecting a session immediately blacklists the session token, persists the revocation to disk, rejects subsequent API calls with HTTP 401 Unauthorized, clears auth cookies, and forces an immediate client-side redirect to the login screen.
- **Connection History**: Persistent log of the last 50 connections with device and timestamp details.

### 7. System Telemetry & Monitoring
- **Hardware Telemetry**: Displays battery percentage and charging state, memory utilization, and storage capacity.
- **Server Name & Branding**: Customizable server display name shown in header and browser tab.

---

## Technology Stack

- **Runtime**: Node.js (v18.0 or later, ES Modules)
- **Backend Framework**: Express.js
- **Tunneling**: Cloudflare Tunnel (`cloudflared`) binary runner
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 with responsive glassmorphism theme
- **Authentication**: Custom HMAC-SHA256 session token generation and verification
- **Persistence**: Atomic file storage with JSON files and automatic backups in `./data/`

---

## Step-by-Step Installation & Quick Start

### Prerequisites
- Node.js version 18.0.0 or higher
- npm (Node Package Manager)

### 1. Clone or Download the Repository
```bash
git clone https://github.com/fatinishraque/personal-cloud-server.git
cd "local server"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launching the Server

#### On macOS:
Run the startup script:
```bash
./start.sh
```
Or start via npm:
```bash
npm start
```

#### On Windows:
Double-click `start.bat` or run the following in Command Prompt or PowerShell:
```cmd
start.bat
```
The script will verify Node.js, download the Windows `cloudflared.exe` binary automatically if missing, install dependencies if needed, and start the server.

#### On Linux:
Make the startup script executable and run:
```bash
chmod +x start.sh
./start.sh
```

### 4. First-Time Setup
When the server starts, the console will output:
- **Local Access URL**: e.g., `http://192.168.1.100:7890`
- **Remote Access URL**: e.g., `https://xxxx.trycloudflare.com` (if tunnel is active)
- **Initial Admin Password**: `mac1234`
- **QR Code**: Scan with your mobile device camera to open the interface immediately.

Open the URL in any browser, log in with the administrator password, and configure your administrator profile and guests in **Settings & Administration**.

---

## Cross-Platform Compatibility Analysis (macOS vs Windows vs Linux)

The application was designed to provide cross-platform functionality with specialized platform optimizations:

| Feature / Subsystem | macOS | Windows | Linux | Notes |
|---|---|---|---|---|
| Node.js / Express Core | Full Support | Full Support | Full Support | Universal ECMAScript module codebase |
| File Browsing & Search | Full Support | Full Support | Full Support | Uses Node.js `fs` and `path.resolve` |
| In-Browser Code Editor | Full Support | Full Support | Full Support | Keyboard shortcuts adapt (`Cmd+S` / `Ctrl+S`) |
| Media Streaming (HTTP 206) | Full Support | Full Support | Full Support | Standard HTTP byte-range implementation |
| Drag-and-Drop File Upload | Full Support | Full Support | Full Support | Handles multipart streams via Busboy |
| ZIP Folder Packaging | Full Support | Full Support | Full Support | Built-in archiver module |
| Remote Cloudflare Tunnel | Native Binary | Windows Binary (`.exe`) | Linux Binary | Automatically resolved per platform |
| Session Disconnect / Revocation | Full Support | Full Support | Full Support | Centralized token blacklist in `data/` |
| Notifications & Chat | Full Support | Full Support | Full Support | Universal JSON and REST APIs |
| Battery Status Monitoring | Native (`pmset`) | OS Fallback | Native (`sysfs`) | macOS uses `pmset`; Windows uses battery APIs |
| System Sleep / Power Control | Native AppleScript | OS Command Fallback | `systemctl suspend` | macOS uses AppleScript/osascript |
| File Deletion / Trash | macOS `~/.Trash` | Windows Recycle / Fallback | FreeDesktop Trash / Fallback | Safe soft-deletion handling |

### Platform-Specific Details

#### macOS:
- Full out-of-the-box support for all features.
- Battery statistics are extracted via native `pmset -g batt` parsing.
- Deleted items are moved to the user's macOS `~/.Trash` folder to prevent accidental data loss.

#### Windows:
- Dedicated `start.bat` launcher provided in the repository root.
- Tunnel binary: `start.bat` automatically fetches `cloudflared-windows-amd64.exe` and saves it as `bin/cloudflared.exe`.
- Path handling: Paths are normalized across Windows drives (`C:\`, `D:\`) using Node.js `path` utilities.
- Keyboard shortcuts: Save shortcuts automatically map to `Ctrl + S`.

#### Linux:
- Headless servers: Can be configured as a `systemd` daemon unit for automatic startup on boot.
- Supports both x86_64 and arm64 architectures.
- Battery metrics read from `/sys/class/power_supply/` where available.

---

## Configuration & Customization

Server settings can be managed directly from the **Settings & Administration** web interface or by editing `./data/config.json`:

```json
{
  "port": 7890,
  "host": "0.0.0.0",
  "serverName": "Personal Cloud",
  "defaultRootDir": "/Users/username",
  "autoTunnel": true,
  "adminName": "Administrator"
}
```

### Environment Variables
- `PORT`: Set the HTTP port (default: `7890`).
- `HOST`: Set the network binding host (default: `0.0.0.0`).
- `DATA_DIR`: Override the storage folder for configuration and sessions (default: `./data`).

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Authenticate with username and password.
- `GET /api/auth/status` - Validate session token and check authorization status.
- `POST /api/auth/logout` - Clear auth cookies and invalidate session.

### Files & Media
- `GET /api/files/browse?path=...` - List directory items, sizes, and permissions.
- `GET /api/files/download?path=...` - Download individual file or folder as ZIP.
- `POST /api/files/upload` - Upload multiple files with progress tracking.
- `GET /api/files/content?path=...` - Retrieve raw text content for editing.
- `POST /api/files/save` - Save modified file contents.
- `POST /api/files/create` - Create a new file or directory.
- `POST /api/files/rename` - Rename an existing item.
- `POST /api/files/delete` - Safely move an item to trash.

### Notifications & Auditing
- `GET /api/notifications/summary` - Combined count of unread notifications and messages.
- `GET /api/notifications/downloads` - List recent file download logs (Admin only).
- `POST /api/notifications/downloads/read` - Mark download notifications as read.
- `GET /api/requests/pending` - List pending guest permission requests.
- `POST /api/requests/approve` - Approve a guest permission request.
- `POST /api/requests/decline` - Decline a guest permission request.

### Messaging & Chat
- `GET /api/messages` - Retrieve chat history for the authenticated user.
- `POST /api/messages/send` - Send a message to a specific user or server channel.
- `GET /api/messages/recipients` - List eligible message recipients.
- `POST /api/messages/read` - Mark messages as read.

### Session & Device Management
- `GET /api/activity/connections` - List active sessions and connection history (Admin only).
- `POST /api/activity/revoke` - Immediately revoke a session and disconnect user (Admin only).

### System & Tunnel
- `GET /api/system/metrics` - Hardware load, memory, storage, and battery statistics.
- `GET /api/system/tunnel` - Cloudflare tunnel status and public URLs.
- `POST /api/system/tunnel/start` - Manually trigger tunnel initialization.
- `POST /api/system/tunnel/stop` - Terminate tunnel process.

---

## Security Architecture

1. **HMAC-SHA256 Signed Tokens**: Session tokens are signed using a unique secret generated upon first launch. Tokens contain session IDs, timestamps, and role scopes.
2. **Persistent Blacklist / Instant Revocation**: Disconnected sessions are written to `revoked_sessions.json`. Middleware checks revocation status on every incoming request.
3. **Brute-Force Rate Limiting**: Automatic IP-based request throttling blocks repeated failed login attempts.
4. **Path Traversal Protection**: All file path parameters are strictly sanitized and resolved within configured directory boundaries. Guest accounts cannot traverse outside their permitted folders.
5. **Encrypted Remote Transport**: Remote traffic passes through Cloudflare's end-to-end TLS tunnels, preventing cleartext exposure over public networks.
