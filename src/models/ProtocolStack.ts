import * as THREE from 'three';

export interface LayerInfo {
  name: string;
  description: string;
  color: number;
  protocols: string[];
}

export class ProtocolStack {
  private group: THREE.Group;
  private layers: THREE.Mesh[] = [];
  private layerInfos: LayerInfo[] = [];
  private isAnimating = false;

  constructor() {
    this.group = new THREE.Group();
  }

  public createTCPIPModel(): THREE.Group {
    this.clearLayers();
    
    this.layerInfos = [
      {
        name: '应用层 (Application Layer)',
        description: '为应用程序提供网络服务',
        color: 0xff6b6b,
        protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS']
      },
      {
        name: '传输层 (Transport Layer)',
        description: '提供端到端的数据传输服务',
        color: 0x4ecdc4,
        protocols: ['TCP', 'UDP']
      },
      {
        name: '网络层 (Internet Layer)',
        description: '负责数据包的路由和转发',
        color: 0x45b7d1,
        protocols: ['IP', 'ICMP', 'ARP']
      },
      {
        name: '链路层 (Link Layer)',
        description: '处理物理网络连接',
        color: 0x96ceb4,
        protocols: ['Ethernet', 'WiFi', 'PPP']
      }
    ];

    this.createLayers();
    return this.group;
  }

  public createOSIModel(): THREE.Group {
    this.clearLayers();
    
    this.layerInfos = [
      {
        name: '应用层 (Application)',
        description: '网络服务与最终用户的接口',
        color: 0xff6b6b,
        protocols: ['HTTP', 'FTP', 'SMTP']
      },
      {
        name: '表示层 (Presentation)',
        description: '数据的表示、安全、压缩',
        color: 0xffa726,
        protocols: ['SSL', 'TLS', 'JPEG']
      },
      {
        name: '会话层 (Session)',
        description: '建立、管理、终止会话',
        color: 0xffee58,
        protocols: ['NetBIOS', 'RPC']
      },
      {
        name: '传输层 (Transport)',
        description: '提供端到端的数据传输',
        color: 0x4ecdc4,
        protocols: ['TCP', 'UDP']
      },
      {
        name: '网络层 (Network)',
        description: '路径选择、路由、逻辑寻址',
        color: 0x45b7d1,
        protocols: ['IP', 'ICMP']
      },
      {
        name: '数据链路层 (Data Link)',
        description: '物理寻址、错误检测',
        color: 0x96ceb4,
        protocols: ['Ethernet', 'PPP']
      },
      {
        name: '物理层 (Physical)',
        description: '比特流传输、物理连接',
        color: 0xd4a574,
        protocols: ['Cable', 'Fiber', 'Radio']
      }
    ];

    this.createLayers();
    return this.group;
  }

  private createLayers(): void {
    const layerHeight = 1;
    const layerWidth = 8;
    const layerDepth = 6;
    const spacing = 0.2;

    this.layerInfos.forEach((layerInfo, index) => {
      // 创建层的几何体
      const geometry = new THREE.BoxGeometry(layerWidth, layerHeight, layerDepth);
      
      // 创建材质
      const material = new THREE.MeshPhongMaterial({
        color: layerInfo.color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });

      // 创建网格
      const layer = new THREE.Mesh(geometry, material);
      layer.position.y = index * (layerHeight + spacing);
      layer.castShadow = true;
      layer.receiveShadow = true;

      // 添加边框
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        linewidth: 2 
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      layer.add(wireframe);

      // 添加文本标签
      this.addLayerLabel(layer, layerInfo, index);

      this.layers.push(layer);
      this.group.add(layer);
    });

    // 设置整个组的位置
    this.group.position.set(0, -this.layerInfos.length / 2, 0);
  }

  private addLayerLabel(layer: THREE.Mesh, layerInfo: LayerInfo, _index: number): void {
    // 创建文本纹理
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 256;

    // 设置文本样式
    context.fillStyle = '#ffffff';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 绘制层名称
    context.fillText(layerInfo.name, canvas.width / 2, canvas.height / 2 - 20);
    
    // 绘制协议信息
    context.font = '20px Arial';
    context.fillText(layerInfo.protocols.join(', '), canvas.width / 2, canvas.height / 2 + 20);

    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4, 2, 1);
    sprite.position.set(0, 0, 3.5);

    layer.add(sprite);
  }

  public simulateDataTransmission(): void {
    if (this.isAnimating) {
      console.log('数据传输动画正在进行中...');
      return;
    }

    if (this.layers.length === 0) {
      console.log('请先选择一个协议栈模型');
      return;
    }

    this.isAnimating = true;
    console.log('开始模拟数据传输...');

    // 创建数据包对象
    const dataPacket = this.createDataPacket();
    this.group.add(dataPacket);

    // 从顶层开始向下传输
    this.animateDataFlow(dataPacket, this.layers.length - 1, () => {
      this.group.remove(dataPacket);
      this.isAnimating = false;
      console.log('数据传输模拟完成');
    });
  }

  private createDataPacket(): THREE.Group {
    const packetGroup = new THREE.Group();

    // 核心数据
    const coreGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      emissive: 0x444400,
      shininess: 100
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.castShadow = true;
    packetGroup.add(core);

    // 添加发光效果
    const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    packetGroup.add(glow);

    // 添加旋转动画
    const animate = () => {
      if (packetGroup.parent) {
        core.rotation.y += 0.05;
        glow.rotation.x += 0.03;
        requestAnimationFrame(animate);
      }
    };
    animate();

    return packetGroup;
  }

  private animateDataFlow(dataPacket: THREE.Group, currentLayer: number, onComplete: () => void): void {
    if (currentLayer < 0) {
      onComplete();
      return;
    }

    const targetY = this.layers[currentLayer].position.y;
    // const startY = currentLayer === this.layers.length - 1 ? targetY + 3 : dataPacket.position.y;

    // 移动到当前层
    this.animateToPosition(dataPacket, { x: 0, y: targetY, z: 0 }, 1000, () => {
      // 添加封装效果
      this.addEncapsulation(dataPacket, this.layerInfos[currentLayer].color);
      
      // 等待一下然后继续到下一层
      setTimeout(() => {
        this.animateDataFlow(dataPacket, currentLayer - 1, onComplete);
      }, 500);
    });
  }

  private addEncapsulation(dataPacket: THREE.Group, color: number): void {
    const shellGeometry = new THREE.SphereGeometry(0.4 + dataPacket.children.length * 0.1, 16, 16);
    const shellMaterial = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    dataPacket.add(shell);
  }

  private animateToPosition(object: THREE.Object3D, target: {x: number, y: number, z: number}, duration: number, onComplete?: () => void): void {
    const start = { x: object.position.x, y: object.position.y, z: object.position.z };
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      object.position.x = start.x + (target.x - start.x) * easeProgress;
      object.position.y = start.y + (target.y - start.y) * easeProgress;
      object.position.z = start.z + (target.z - start.z) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    animate();
  }

  private clearLayers(): void {
    this.layers.forEach(layer => {
      this.group.remove(layer);
    });
    this.layers = [];
    this.layerInfos = [];
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public dispose(): void {
    this.clearLayers();
  }
}
