English | [简体中文](./README.md)

# Visual Network Explorer

An interactive 3D network protocol stack and data transmission visualization application based on Three.js.

## 🌟 Core Features

### 1. Interactive 3D Protocol Stack Model
- **TCP/IP Model**: 3D visualization of the 4-layer protocol stack.
- **OSI Model**: 3D visualization of the 7-layer protocol stack.
- **Data Encapsulation Animation**: Simulates the dynamic encapsulation process as data descends from the application layer.
- **Interactive Controls**: Rotate and zoom with the mouse to view detailed information for each layer.

### 2. Dynamic Packet Routing & Transmission Simulation
- **3D Network Topology**: Visual layout of network devices (client, router, server, DNS).
- **DNS Query Simulation**: Animated demonstration of the complete DNS query process.
- **Packet Routing**: Simulates the path of data packets hopping between network nodes.
- **Real-time Status Display**: Shows the current operational status and log information.

## 🚀 Tech Stack

- **Frontend Framework**: Vite + TypeScript
- **3D Rendering**: Three.js
- **Package Manager**: pnpm
- **Styling**: Native CSS3

## 📦 Installation & Usage

### Prerequisites
- Node.js 16+
- pnpm
- A modern browser with WebGL support

### Install Dependencies
```bash
pnpm install
```

### Development Mode
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 🎮 User Guide

### Mouse Controls
- **Drag**: Rotate the 3D view.
- **Scroll**: Zoom the view in or out.

### Button Controls
- **TCP/IP Model**: Switch to the 4-layer protocol stack view.
- **OSI Model**: Switch to the 7-layer protocol stack view.
- **Simulate Data Transmission**: Start the data encapsulation animation.
- **Start Routing Simulation**: Simulate the network data transmission process.
- **Reset View**: Restore the default camera view.
- **Show Help**: Toggle the help panel.

### Keyboard Shortcuts
- **1**: Switch to TCP/IP Model.
- **2**: Switch to OSI Model.
- **Space**: Start data transmission simulation.
- **R**: Reset view.
- **H**: Show/hide help panel.
- **P**: Show/hide performance monitor.

## 🏗️ Project Structure

```
src/
├── core/
│   └── SceneManager.ts          # 3D Scene Manager
├── models/
│   ├── ProtocolStack.ts         # Protocol Stack Model
│   └── NetworkTopology.ts       # Network Topology Model
├── components/
│   └── StatusDisplay.ts         # Status Display Component
├── utils/
│   └── PerformanceMonitor.ts    # Performance Monitoring Tool
├── tests/
│   └── basic-tests.ts           # Basic Functional Tests
├── main.ts                      # Main Application Entry Point
└── style.css                    # Stylesheet
```

## 🎯 Features

### Protocol Stack Visualization
- Each layer has a unique color and identifier.
- Displays the main protocols for each layer.
- Dynamic data encapsulation process demonstration.
- Supports both TCP/IP and OSI models.

### Network Routing Simulation
- Realistic network topology structure.
- Visualization of the DNS query process.
- Animated data packet routing paths.
- Network node status indicators.

### User Experience
- Smooth 3D animation effects.
- Real-time status feedback.
- Performance monitoring display.
- Responsive design.

## 🔧 Development Notes

### Adding New Features
1. Add the feature in the corresponding module file.
2. Integrate the new feature in `main.ts`.
3. Update UI controls and event listeners.
4. Add corresponding test cases.

### Performance Optimization
- Use `PerformanceMonitor` to track FPS and memory usage.
- Make efficient use of Three.js geometry and material caching.
- Avoid creating new objects within the animation loop.

### Browser Compatibility
- Requires a browser that supports WebGL.
- Recommended to use the latest versions of Chrome, Firefox, Safari, or Edge.

## 📝 Changelog

### v1.0.0
- ✅ Implemented 3D visualization for TCP/IP and OSI protocol stacks.
- ✅ Implemented data encapsulation animation effects.
- ✅ Implemented network topology and routing simulation.
- ✅ Implemented DNS query process animation.
- ✅ Added user interface and control system.
- ✅ Added performance monitoring and status display.
- ✅ Added basic functional tests.

## 🤝 Contribution Guide

Feel free to submit Issues and Pull Requests to improve this project!

## 📄 License

MIT License