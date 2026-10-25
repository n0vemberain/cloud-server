# Mac Cloud Server — Personal Cloud Server for macOS

A modern, responsive personal cloud server application for your MacBook. Turn your Mac into a secure server accessible over local Wi-Fi or across the internet from any smartphone, tablet, or PC with zero router configuration.

---

## Features

1. **Dual Network Access (Local & Remote)**:
   - **Local Wi-Fi Access**: Connect directly via your Mac's LAN IP (e.g. `http://192.168.x.x:7890`).
   - **Remote Internet Access**: Connect from anywhere across cellular data (4G/5G) or remote networks via an encrypted Cloudflare Quick Tunnel (`https://....trycloudflare.com`) without public IPs or port forwarding.
   - **QR Code Pairing**: Instant connection for phones and tablets by scanning the terminal or web dashboard QR code.

2. **File Explorer & Management**:
   - **File Browsing**: Full access to your Home directory, Desktop, Documents, Downloads, or entire drive.
   - **Code & Text Editor**: In-browser text/code editor with line numbers and `Cmd + S` keyboard shortcut for `.txt`, `.md`, `.js`, `.py`, `.json`, `.sh`, `.env`, and config files.
   - **Media Streaming**: High-speed video streaming with HTTP 206 Partial Content range requests, audio player, image lightbox, and PDF viewer.
   - **File Uploads**: Drag-and-drop multi-file uploads with real-time percentage progress bar.
   - **Instant Downloads**: Single file download or one-click folder download as a ZIP archive.
   - **File Operations**: Create files/folders, rename, and safely move deleted items to macOS Trash (`~/.Trash`).

3. **Mobile & Tablet Optimized**:
   - Touch-friendly layout with fluid responsive grid.
   - Mobile bottom action bar for one-thumb access (Upload, Folder, File, Remote QR).
   - Bottom action sheets for easy file options on touchscreen devices.
   - Responsive off-canvas navigation drawer.

4. **Security & System Monitoring**:
   - Password protection with session HMAC tokens (default: `mac1234`).
   - Rate limiting to block brute-force attempts.
   - Live hardware stats: battery percentage, storage capacity, and memory utilization.

---

## Quick Start

### 1. Launch the Server:
Run either of the following commands in the project folder:

```bash
./start.sh
```
or
```bash
npm start
```

### 2. Accessing the Server:
When launched, the terminal will display:
- **Local Access URL**: `http://192.168.x.x:7890` (for devices on the same Wi-Fi)
- **Remote Access URL**: `https://xxxx.trycloudflare.com` (for remote networks / cellular data)
- **Initial Password**: `mac1234` (can be changed from Settings)
- **ASCII QR Code**: for instant mobile camera scanning

---

## Settings & Configuration

- **Change Password**: Log into the web interface and click the Gear icon in the top header.
- Persistent configuration is stored in `data/config.json`.
- To change the listening port, set the `PORT` environment variable: `PORT=8000 ./start.sh`.
