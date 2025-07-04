import * as THREE from 'three';

export interface NetworkNode {
  id: string;
  type: 'client' | 'router' | 'server' | 'dns';
  name: string;
  position: THREE.Vector3;
  mesh?: THREE.Group;
}

export interface NetworkConnection {
  from: string;
  to: string;
  line?: THREE.Line;
}

export class NetworkTopology {
  private group: THREE.Group;
  private nodes: Map<string, NetworkNode> = new Map();
  private connections: NetworkConnection[] = [];
  private isAnimating = false;

  constructor() {
    this.group = new THREE.Group();
    this.createDefaultTopology();
  }

  private createDefaultTopology(): void {
    // 创建默认的网络拓扑结构
    const nodeConfigs: Omit<NetworkNode, 'mesh'>[] = [
      { id: 'client', type: 'client', name: '客户端', position: new THREE.Vector3(-8, 0, 0) },
      { id: 'router1', type: 'router', name: '路由器1', position: new THREE.Vector3(-4, 0, 0) },
      { id: 'router2', type: 'router', name: '路由器2', position: new THREE.Vector3(0, 2, 0) },
      { id: 'router3', type: 'router', name: '路由器3', position: new THREE.Vector3(0, -2, 0) },
      { id: 'router4', type: 'router', name: '路由器4', position: new THREE.Vector3(4, 0, 0) },
      { id: 'dns', type: 'dns', name: 'DNS服务器', position: new THREE.Vector3(2, 4, 0) },
      { id: 'server', type: 'server', name: '目标服务器', position: new THREE.Vector3(8, 0, 0) }
    ];

    // 创建节点
    nodeConfigs.forEach(config => {
      const node: NetworkNode = { ...config };
      node.mesh = this.createNodeMesh(node);
      this.nodes.set(node.id, node);
      this.group.add(node.mesh);
    });

    // 创建连接
    const connectionConfigs: Omit<NetworkConnection, 'line'>[] = [
      { from: 'client', to: 'router1' },
      { from: 'router1', to: 'router2' },
      { from: 'router1', to: 'router3' },
      { from: 'router2', to: 'router4' },
      { from: 'router3', to: 'router4' },
      { from: 'router2', to: 'dns' },
      { from: 'router4', to: 'server' }
    ];

    connectionConfigs.forEach(config => {
      const connection = this.createConnection(config.from, config.to);
      if (connection) {
        this.connections.push(connection);
        this.group.add(connection.line!);
      }
    });
  }

  private createNodeMesh(node: NetworkNode): THREE.Group {
    const nodeGroup = new THREE.Group();
    
    let geometry: THREE.BufferGeometry;
    let color: number;
    
    switch (node.type) {
      case 'client':
        geometry = new THREE.BoxGeometry(1, 0.6, 1);
        color = 0x4fc3f7;
        break;
      case 'router':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 8);
        color = 0xff9800;
        break;
      case 'server':
        geometry = new THREE.BoxGeometry(0.8, 1.5, 0.8);
        color = 0x4caf50;
        break;
      case 'dns':
        geometry = new THREE.OctahedronGeometry(0.6);
        color = 0x9c27b0;
        break;
      default:
        geometry = new THREE.SphereGeometry(0.5);
        color = 0x607d8b;
    }

    const material = new THREE.MeshPhongMaterial({ 
      color: color,
      shininess: 100
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    nodeGroup.add(mesh);

    // 添加发光效果
    const glowGeometry = geometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.multiplyScalar(1.2);
    nodeGroup.add(glow);

    // 添加标签
    this.addNodeLabel(nodeGroup, node.name);

    nodeGroup.position.copy(node.position);
    return nodeGroup;
  }

  private addNodeLabel(nodeGroup: THREE.Group, text: string): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = '#ffffff';
    context.font = 'bold 20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, 1.5, 0);

    nodeGroup.add(sprite);
  }

  private createConnection(fromId: string, toId: string): NetworkConnection | null {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    
    if (!fromNode || !toNode) return null;

    const points = [fromNode.position, toNode.position];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x64ffda,
      linewidth: 2
    });
    const line = new THREE.Line(geometry, material);

    return { from: fromId, to: toId, line };
  }

  public async simulateDNSQuery(targetUrl: string): Promise<void> {
    if (this.isAnimating) {
      console.log('网络模拟正在进行中...');
      return;
    }

    this.isAnimating = true;
    console.log(`开始DNS查询: ${targetUrl}`);

    // 创建DNS查询包
    const queryPacket = this.createPacket(0xffff00, 'DNS Query');
    this.group.add(queryPacket);

    // 路径: client -> router1 -> router2 -> dns
    const dnsPath = ['client', 'router1', 'router2', 'dns'];

    console.log('发送DNS查询请求...');
    await this.animatePacketAlongPath(queryPacket, dnsPath);

    // 等待DNS处理
    console.log('DNS服务器处理查询...');
    await this.highlightNode('dns', 1000);

    // 创建DNS响应包
    const responsePacket = this.createPacket(0x00ff00, 'DNS Response');
    this.group.add(responsePacket);
    responsePacket.position.copy(this.nodes.get('dns')!.position);

    // 响应路径: dns -> router2 -> router1 -> client
    const responsePath = ['dns', 'router2', 'router1', 'client'];

    console.log('返回DNS查询结果...');
    await this.animatePacketAlongPath(responsePacket, responsePath);

    // 清理
    this.group.remove(queryPacket);
    this.group.remove(responsePacket);

    console.log(`DNS查询完成: ${targetUrl} -> 192.168.1.100`);
    this.isAnimating = false;
  }

  public async simulateDataRouting(_targetUrl: string): Promise<void> {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // 创建数据包
    const dataPacket = this.createPacket(0xff6b6b, 'Data Packet');
    this.group.add(dataPacket);

    // 模拟路由决策 - 选择不同路径
    const paths = [
      ['client', 'router1', 'router2', 'router4', 'server'],
      ['client', 'router1', 'router3', 'router4', 'server']
    ];
    
    const selectedPath = paths[Math.floor(Math.random() * paths.length)];
    
    await this.animatePacketAlongPath(dataPacket, selectedPath);
    
    // 服务器处理
    await this.highlightNode('server', 1000);
    
    // 清理
    this.group.remove(dataPacket);
    
    this.isAnimating = false;
  }

  private createPacket(color: number, _label: string): THREE.Group {
    const packetGroup = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    
    const packet = new THREE.Mesh(geometry, material);
    packetGroup.add(packet);
    
    // 添加拖尾效果
    const trailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    packetGroup.add(trail);
    
    return packetGroup;
  }

  private async animatePacketAlongPath(packet: THREE.Group, path: string[]): Promise<void> {
    for (let i = 0; i < path.length; i++) {
      const nodeId = path[i];
      const node = this.nodes.get(nodeId);
      if (!node) continue;

      if (i === 0) {
        packet.position.copy(node.position);
      } else {
        await this.animateToPosition(packet, node.position, 1000);
        await this.highlightNode(nodeId, 300);
      }
    }
  }

  private async animateToPosition(object: THREE.Object3D, target: THREE.Vector3, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const start = object.position.clone();
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        object.position.lerpVectors(start, target, easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  private async highlightNode(nodeId: string, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const node = this.nodes.get(nodeId);
      if (!node || !node.mesh) {
        resolve();
        return;
      }

      const originalScale = node.mesh.scale.clone();
      const targetScale = originalScale.clone().multiplyScalar(1.3);
      
      // 放大动画
      this.animateScale(node.mesh, targetScale, duration / 2).then(() => {
        // 缩小动画
        this.animateScale(node.mesh!, originalScale, duration / 2).then(resolve);
      });
    });
  }

  private async animateScale(object: THREE.Object3D, targetScale: THREE.Vector3, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startScale = object.scale.clone();
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        object.scale.lerpVectors(startScale, targetScale, progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public dispose(): void {
    this.nodes.clear();
    this.connections = [];
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
  }
}
