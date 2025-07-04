import './style.css';
import { SceneManager } from './core/SceneManager';
import { ProtocolStack } from './models/ProtocolStack';
import { NetworkTopology } from './models/NetworkTopology';
import { StatusDisplay } from './components/StatusDisplay';
import { PerformanceMonitor } from './utils/PerformanceMonitor';
import './tests/basic-tests';

class VisualNetworkExplorer {
  private sceneManager!: SceneManager;
  private protocolStack!: ProtocolStack;
  private networkTopology!: NetworkTopology;
  private statusDisplay!: StatusDisplay;
  private performanceMonitor!: PerformanceMonitor;
  private currentMode: 'protocol' | 'network' = 'protocol';

  constructor() {
    this.initializeScene();
    this.initializeModels();
    this.initializeStatusDisplay();
    this.initializePerformanceMonitor();
    this.setupEventListeners();
    this.showProtocolStack();
  }

  private initializeScene(): void {
    const container = document.getElementById('canvas-container');
    if (!container) {
      throw new Error('Canvas container not found');
    }
    this.sceneManager = new SceneManager(container);
  }

  private initializeModels(): void {
    this.protocolStack = new ProtocolStack();
    this.networkTopology = new NetworkTopology();
  }

  private initializeStatusDisplay(): void {
    this.statusDisplay = new StatusDisplay();
    this.statusDisplay.addLog('网络可视化探秘应用已启动', 'success');
  }

  private initializePerformanceMonitor(): void {
    this.performanceMonitor = new PerformanceMonitor();
    // 默认不显示性能监控，用户可以通过快捷键开启
  }

  private setupEventListeners(): void {
    // 协议栈模型按钮
    const tcpipBtn = document.getElementById('show-tcp-ip');
    const osiBtn = document.getElementById('show-osi');
    const simulateBtn = document.getElementById('simulate-data');

    // 网络路由按钮
    const routingBtn = document.getElementById('start-routing');
    const urlInput = document.getElementById('target-url') as HTMLInputElement;

    // 视图控制按钮
    const resetCameraBtn = document.getElementById('reset-camera');
    const toggleHelpBtn = document.getElementById('toggle-help');

    if (tcpipBtn) {
      tcpipBtn.addEventListener('click', () => this.showTCPIPModel());
    }

    if (osiBtn) {
      osiBtn.addEventListener('click', () => this.showOSIModel());
    }

    if (simulateBtn) {
      simulateBtn.addEventListener('click', () => this.simulateDataTransmission());
    }

    if (routingBtn && urlInput) {
      routingBtn.addEventListener('click', () => {
        const url = urlInput.value.trim() || 'www.example.com';
        this.simulateNetworkRouting(url);
      });
    }

    if (resetCameraBtn) {
      resetCameraBtn.addEventListener('click', () => this.resetCamera());
    }

    if (toggleHelpBtn) {
      toggleHelpBtn.addEventListener('click', () => this.toggleHelp());
    }

    // 键盘快捷键
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case '1':
          this.showTCPIPModel();
          break;
        case '2':
          this.showOSIModel();
          break;
        case ' ':
          event.preventDefault();
          this.simulateDataTransmission();
          break;
        case 'r':
        case 'R':
          this.resetCamera();
          break;
        case 'h':
        case 'H':
          this.toggleHelp();
          break;
        case 'p':
        case 'P':
          this.performanceMonitor.toggle();
          this.statusDisplay.addLog('性能监控已切换', 'info');
          break;
      }
    });
  }

  private showProtocolStack(): void {
    this.currentMode = 'protocol';
    this.sceneManager.clearScene();

    const tcpipModel = this.protocolStack.createTCPIPModel();
    this.sceneManager.addToScene(tcpipModel);

    // 调整相机位置以适合协议栈视图
    const camera = this.sceneManager.getCamera();
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
  }

  private showTCPIPModel(): void {
    if (this.currentMode !== 'protocol') {
      this.showProtocolStack();
    } else {
      this.sceneManager.clearScene();
      const tcpipModel = this.protocolStack.createTCPIPModel();
      this.sceneManager.addToScene(tcpipModel);
      this.statusDisplay.addLog('已切换到TCP/IP协议栈模型', 'info');
    }
  }

  private showOSIModel(): void {
    if (this.currentMode !== 'protocol') {
      this.showProtocolStack();
    } else {
      this.sceneManager.clearScene();
      const osiModel = this.protocolStack.createOSIModel();
      this.sceneManager.addToScene(osiModel);
      this.statusDisplay.addLog('已切换到OSI协议栈模型', 'info');
    }
  }

  private simulateDataTransmission(): void {
    if (this.currentMode === 'protocol') {
      this.statusDisplay.addLog('开始模拟数据传输过程', 'info');
      this.protocolStack.simulateDataTransmission();
    } else {
      this.statusDisplay.addLog('请先切换到协议栈模式', 'warning');
    }
  }

  private async simulateNetworkRouting(url: string): Promise<void> {
    // 切换到网络拓扑视图
    this.currentMode = 'network';
    this.sceneManager.clearScene();

    const topology = this.networkTopology.getGroup();
    this.sceneManager.addToScene(topology);

    // 调整相机位置以适合网络拓扑视图
    const camera = this.sceneManager.getCamera();
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    this.statusDisplay.addLog(`开始网络路由模拟: ${url}`, 'info');

    try {
      // 首先模拟DNS查询
      this.statusDisplay.addLog('正在进行DNS查询...', 'info');
      await this.networkTopology.simulateDNSQuery(url);

      // 等待一下然后模拟数据路由
      setTimeout(async () => {
        this.statusDisplay.addLog('开始数据包路由传输...', 'info');
        await this.networkTopology.simulateDataRouting(url);
        this.statusDisplay.addLog('网络路由模拟完成', 'success');
      }, 1000);

    } catch (error) {
      console.error('网络路由模拟失败:', error);
      this.statusDisplay.addLog(`网络路由模拟失败: ${error}`, 'error');
    }
  }

  private resetCamera(): void {
    const camera = this.sceneManager.getCamera();

    if (this.currentMode === 'protocol') {
      camera.position.set(0, 5, 15);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 8, 12);
      camera.lookAt(0, 0, 0);
    }

    this.statusDisplay.addLog('视角已重置', 'info');
  }

  private toggleHelp(): void {
    const helpPanel = document.getElementById('help-panel');
    const toggleBtn = document.getElementById('toggle-help');

    if (helpPanel && toggleBtn) {
      const isVisible = helpPanel.style.display !== 'none';
      helpPanel.style.display = isVisible ? 'none' : 'block';
      toggleBtn.textContent = isVisible ? '显示帮助' : '隐藏帮助';

      this.statusDisplay.addLog(isVisible ? '帮助面板已隐藏' : '帮助面板已显示', 'info');
    }
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  try {
    new VisualNetworkExplorer();
    console.log('网络可视化探秘应用已启动');
  } catch (error) {
    console.error('应用启动失败:', error);

    // 显示错误信息
    const container = document.getElementById('canvas-container');
    if (container) {
      container.innerHTML = `
        <div class="loading">
          <h2>应用启动失败</h2>
          <p>请检查浏览器是否支持WebGL</p>
          <p>错误信息: ${error}</p>
        </div>
      `;
    }
  }
});
