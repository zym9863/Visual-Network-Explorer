export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private displayElement: HTMLElement | null = null;
  private isEnabled = false;

  constructor() {
    this.createDisplay();
  }

  private createDisplay(): void {
    this.displayElement = document.createElement('div');
    this.displayElement.id = 'performance-monitor';
    this.displayElement.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #64ffda;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 1002;
      display: none;
      min-width: 120px;
    `;
    document.body.appendChild(this.displayElement);
  }

  public enable(): void {
    this.isEnabled = true;
    if (this.displayElement) {
      this.displayElement.style.display = 'block';
    }
    this.startMonitoring();
  }

  public disable(): void {
    this.isEnabled = false;
    if (this.displayElement) {
      this.displayElement.style.display = 'none';
    }
  }

  public toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  private startMonitoring(): void {
    const monitor = (currentTime: number) => {
      if (!this.isEnabled) return;

      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        this.updateDisplay();
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  private updateDisplay(): void {
    if (!this.displayElement) return;

    const memoryInfo = this.getMemoryInfo();
    
    this.displayElement.innerHTML = `
      <div>FPS: ${this.fps}</div>
      <div>内存: ${memoryInfo.used}MB</div>
      <div>几何体: ${this.getGeometryCount()}</div>
      <div>材质: ${this.getMaterialCount()}</div>
    `;

    // 根据性能设置颜色
    const color = this.fps >= 50 ? '#4caf50' : this.fps >= 30 ? '#ff9800' : '#f44336';
    this.displayElement.style.color = color;
  }

  private getMemoryInfo(): { used: number; total: number } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576)
      };
    }
    return { used: 0, total: 0 };
  }

  private getGeometryCount(): number {
    // 这里可以添加实际的几何体计数逻辑
    return 0;
  }

  private getMaterialCount(): number {
    // 这里可以添加实际的材质计数逻辑
    return 0;
  }

  public logPerformanceWarning(message: string): void {
    if (this.fps < 30) {
      console.warn(`性能警告 (FPS: ${this.fps}): ${message}`);
    }
  }

  public dispose(): void {
    this.disable();
    if (this.displayElement && this.displayElement.parentNode) {
      this.displayElement.parentNode.removeChild(this.displayElement);
    }
  }
}
