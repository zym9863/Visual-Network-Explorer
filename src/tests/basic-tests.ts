// 基础功能测试
export class BasicTests {
  private results: { test: string; passed: boolean; error?: string }[] = [];

  public async runAllTests(): Promise<void> {
    console.log('开始运行基础功能测试...');
    
    await this.testWebGLSupport();
    await this.testThreeJSInitialization();
    await this.testSceneManagerCreation();
    await this.testProtocolStackCreation();
    await this.testNetworkTopologyCreation();
    
    this.printResults();
  }

  private async testWebGLSupport(): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        this.addResult('WebGL支持检测', true);
      } else {
        this.addResult('WebGL支持检测', false, 'WebGL不受支持');
      }
    } catch (error) {
      this.addResult('WebGL支持检测', false, `错误: ${error}`);
    }
  }

  private async testThreeJSInitialization(): Promise<void> {
    try {
      const THREE = await import('three');
      
      if (THREE.Scene && THREE.WebGLRenderer && THREE.PerspectiveCamera) {
        this.addResult('Three.js初始化', true);
      } else {
        this.addResult('Three.js初始化', false, 'Three.js组件缺失');
      }
    } catch (error) {
      this.addResult('Three.js初始化', false, `错误: ${error}`);
    }
  }

  private async testSceneManagerCreation(): Promise<void> {
    try {
      const { SceneManager } = await import('../core/SceneManager');
      
      // 创建临时容器
      const testContainer = document.createElement('div');
      testContainer.style.width = '100px';
      testContainer.style.height = '100px';
      document.body.appendChild(testContainer);
      
      const sceneManager = new SceneManager(testContainer);
      
      if (sceneManager) {
        this.addResult('SceneManager创建', true);
        sceneManager.dispose();
      } else {
        this.addResult('SceneManager创建', false, 'SceneManager创建失败');
      }
      
      document.body.removeChild(testContainer);
    } catch (error) {
      this.addResult('SceneManager创建', false, `错误: ${error}`);
    }
  }

  private async testProtocolStackCreation(): Promise<void> {
    try {
      const { ProtocolStack } = await import('../models/ProtocolStack');
      
      const protocolStack = new ProtocolStack();
      const tcpipModel = protocolStack.createTCPIPModel();
      const osiModel = protocolStack.createOSIModel();
      
      if (tcpipModel && osiModel) {
        this.addResult('协议栈模型创建', true);
      } else {
        this.addResult('协议栈模型创建', false, '协议栈模型创建失败');
      }
      
      protocolStack.dispose();
    } catch (error) {
      this.addResult('协议栈模型创建', false, `错误: ${error}`);
    }
  }

  private async testNetworkTopologyCreation(): Promise<void> {
    try {
      const { NetworkTopology } = await import('../models/NetworkTopology');
      
      const networkTopology = new NetworkTopology();
      const topologyGroup = networkTopology.getGroup();
      
      if (topologyGroup && topologyGroup.children.length > 0) {
        this.addResult('网络拓扑创建', true);
      } else {
        this.addResult('网络拓扑创建', false, '网络拓扑创建失败');
      }
      
      networkTopology.dispose();
    } catch (error) {
      this.addResult('网络拓扑创建', false, `错误: ${error}`);
    }
  }

  private addResult(test: string, passed: boolean, error?: string): void {
    this.results.push({ test, passed, error });
  }

  private printResults(): void {
    console.log('\n=== 测试结果 ===');
    
    let passedCount = 0;
    let totalCount = this.results.length;
    
    this.results.forEach(result => {
      const status = result.passed ? '✅ 通过' : '❌ 失败';
      console.log(`${result.test}: ${status}`);
      
      if (!result.passed && result.error) {
        console.log(`   错误详情: ${result.error}`);
      }
      
      if (result.passed) passedCount++;
    });
    
    console.log(`\n总计: ${passedCount}/${totalCount} 测试通过`);
    
    if (passedCount === totalCount) {
      console.log('🎉 所有测试通过！应用可以正常运行。');
    } else {
      console.log('⚠️ 部分测试失败，应用可能无法正常运行。');
    }
  }

  public getResults(): { test: string; passed: boolean; error?: string }[] {
    return this.results;
  }
}

// 自动运行测试（仅在开发环境）
if (import.meta.env.DEV) {
  document.addEventListener('DOMContentLoaded', async () => {
    // 等待一下让应用初始化
    setTimeout(async () => {
      const tests = new BasicTests();
      await tests.runAllTests();
    }, 2000);
  });
}
