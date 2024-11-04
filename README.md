<p align="center">
  <img width="100%" src=".github/assets/banner.svg" alt="Banner">
</p>
<p align="center">
  <b>An open-source, lightweight and privacy-focused BeReal alternative client.</b>
</p>
<p align="center">
  <a href="https://github.com/Vexcited/StayReal/actions/workflows/build.yml">
    <img src="https://github.com/Vexcited/StayReal/actions/workflows/build.yml/badge.svg?branch=main" alt="Build Badge">
  </a>
  <a href="./LICENSE.md">
    <img src="https://img.shields.io/github/license/Vexcited/StayReal.svg?color=green" alt="License Badge">
  </a>
</p>

## ✨ Features

- [x] Authentication
  - Accounts with parental control are not supported, if you have one, please open an issue so we can work on it.
- [ ] My Profile
  - [x] Informations
  - [x] Realmojis
  - [ ] Memories
  - [ ] Pinned
- [ ] User Profile
- [ ] Feed
  - [x] My posts
  - [ ] Comments on my posts
  - [x] Swipper for my posts
  - [x] Users
  - [x] Posts
  - [x] Swipper for multiple posts
  - [ ] Comments
  - [ ] Reactions
- [x] Post a BeReal
- [ ] Comment under a post
- [ ] React to a post with your realmojis
- [ ] Accept a friend request
- [ ] Friends recommendations
- [ ] Listing of friends
- [ ] Notifications
  - [ ] Background fetch
  - Probably unknown if it's possible to do it with Tauri, if you have any idea, please open an issue or a PR.

### Advanced

Some advanced features that are not in the original application.

- [ ] Light mode
- [ ] Upload from gallery (not only camera)
- [ ] Manual camera (there is no delay between primary image and secondary image)
- [ ] Cache data to device local database (for faster reloading and offline access)

### Privacy

Only the necessary data is stored on the device, and the application does not collect any personal information.

- [x] No tracking
- [x] No analytics
- [x] No ads

## 🚀 Getting Started

There's currently no release available, but you can build the application yourself or find pre-built binaries in the actions tab.

## 📸 Screenshots

Coming soon, we're currently working on the UI so it's not ready yet.

## 🛠️ Development

### Prerequisites

Follow the instructions on the [&nearr;&nbsp;Tauri documentation](https://tauri.app/start/prerequisites/) to setup your environment depending on your operating system and target platform.

Also, make sure you have [&nearr;&nbsp;pnpm](https://pnpm.io) installed since it's the package manager used in this project.

### Quick start

```bash
git clone https://github.com/Vexcited/StayReal && cd StayReal

# Install dependencies
pnpm install

# Start development on desktop
pnpm tauri dev

# Start development on Android
pnpm tauri android dev
```

### Build for release

```bash
# Build for desktop
pnpm tauri build

# Build for Android
pnpm tauri android build
```

## 🙏 Acknowledgments

A lot of similar projects and researches have been made, and we would like to thank the authors for their work.

- [&nearr;&nbsp;BeFake, a BeReal Python API wrapper](https://github.com/Smart123s/BeFake)
- [&nearr;&nbsp;TooFake, an alternative web client](https://github.com/s-alad/toofake)
- [&nearr;&nbsp;BeUnblurred, an alternative web client](https://github.com/macedonga/beunblurred)
- [&nearr;&nbsp;Fowled's researches on the app](https://bereal.fowled.dev)
- [&nearr;&nbsp;userbradley's researches on the API](https://github.com/userbradley/BeReal)

## 📄 License

StayReal is licensed under the [&nearr;&nbsp;GNU General Public License v3.0 (GPL-3.0)](./LICENSE.md), a copyleft license that ensures users’ freedom to run, study, share, and modify the software. Licensed works, modifications, and larger works must also be distributed under GPL-3.0, and source code must be provided or made available.
