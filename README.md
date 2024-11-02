<div align="center">
  <img alt="StayReal, an open-source client application for BeReal" src=".github/assets/banner.svg" width="100%" />
  <br/>
  <h3>An open-source client application for BeReal, built with Tauri</h3>
</div>

## ✨ Features

These are the basic features that are also in the original application.

- [x] Authentication
  - [x] Send OTP
  - [x] Verify OTP
  - [x] Store tokens
  - [x] Refresh token when expired
- [ ] My Profile
  - [x] Informations
  - [x] Realmojis
  - [ ] Pinned
  - [ ] Memories
- [ ] (any) User Profile
- [ ] Feed
  - [x] My posts
  - [ ] Comments on my posts
  - [x] Swipper for my posts
  - [x] Users
  - [x] Posts
  - [x] Swipper for multiple posts
  - [ ] Comments
  - [ ] Reactions
- [x] Post
- [ ] Comment
- [ ] React with realmoji
- [ ] Add friend
- [ ] Friends
- [ ] Notifications
  - *Not sure if this is going to be implemented, because it looks hard to do within Tauri*

Here are more advanced features that are not in the original application.

- [ ] Light mode
- [ ] Upload from gallery (not only camera)
- [ ] Manual camera (there is no delay between primary image and secondary image)
- [ ] Cache data to device local database (for faster reloading and offline access)
- [ ] 

## Privacy

- [x] No tracking
- [x] No analytics
- [x] No ads

Only the necessary data is stored on the device, and the application does not collect any personal information.

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)
- [Tauri v2](https://v2.tauri.app/fr/start/prerequisites/)

### Installation

```bash
# Clone the project
git clone https://github.com/Vexcited/StayReal.git

# Install dependencies
cd stayreal
pnpm install

# Launch in development
pnpm run tauri dev
```

## 🙏 Acknowledgments
This project would not have been possible without the significant contributions of the following projects:
- [BeUnblurred](https://github.com/macedonga/beunblurred)
- [TooFake](https://github.com/s-alad/toofake)
- [BeFake](https://github.com/Smart123s/BeFake)
- [Fowled BeReal API Documentation](https://bereal.fowled.dev)

## 📄 License
This project is under the GPL-3.0 license. For more details, please refer to the [LICENSE.md](./LICENSE.md) file.

<br/>

<div align="center">
  <h3>Developed with Tauri & ❤️</h3>
</div>