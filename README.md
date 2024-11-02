<div align="center">
  <img alt="StayReal, an open-source client application for BeReal" src=".github/assets/banner.svg" width="100%" />
  <br/>
  <p align="center">
      <picture>
          <source media="(prefers-color-scheme: dark)" srcset=".github/assets/description_dark.svg">
          <img alt="description" src=".github/assets/description_light.svg">
      </picture>
  </p>
</div>

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

Follow the instructions on the [Tauri documentation](https://tauri.app/start/prerequisites/) to setup your environment depending on your operating system and target platform.

### Installation

```bash
git clone https://github.com/Vexcited/StayReal && cd StayReal

# Install dependencies
pnpm install

# Start development on desktop
pnpm tauri dev

# Start development on Android
pnpm tauri android dev
```

### Build

```bash
# Build for desktop
pnpm tauri build

# Build for Android
pnpm tauri android build
```

## 🙏 Acknowledgments

This project would not have been possible without the significant contributions of the following projects :

- [BeUnblurred](https://github.com/macedonga/beunblurred) ;
- [TooFake](https://github.com/s-alad/toofake) ;
- [BeFake (Python API)](https://github.com/Smart123s/BeFake) ;
- [Fowled BeReal API Documentation](https://bereal.fowled.dev)
- [userbradley's researches on BeReal API](https://github.com/userbradley/BeReal)

## 📄 License

This project is under the GPL-3.0 license.
For more details, please refer to the [LICENSE.md](./LICENSE.md) file.
