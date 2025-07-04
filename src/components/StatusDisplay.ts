export class StatusDisplay {
  private container!: HTMLElement;
  private statusElement!: HTMLElement;
  private logElement!: HTMLElement;
  private logs: string[] = [];
  private maxLogs = 10;

  constructor() {
    this.createStatusDisplay();
  }

  private createStatusDisplay(): void {
    // 创建状态显示容器
    this.container = document.createElement('div');
    this.container.id = 'status-display';
    this.container.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 15px;
      color: #ffffff;
      font-family: 'Microsoft YaHei', monospace;
      font-size: 12px;
      z-index: 1001;
      max-height: 200px;
      overflow-y: auto;
    `;

    // 创建状态标题
    const title = document.createElement('h4');
    title.textContent = '系统状态';
    title.style.cssText = `
      margin: 0 0 10px 0;
      color: #64ffda;
      font-size: 14px;
      border-bottom: 1px solid #64ffda;
      padding-bottom: 5px;
    `;

    // 创建当前状态显示
    this.statusElement = document.createElement('div');
    this.statusElement.style.cssText = `
      margin-bottom: 10px;
      padding: 5px;
      background: rgba(100, 255, 218, 0.1);
      border-radius: 5px;
      border-left: 3px solid #64ffda;
    `;
    this.statusElement.textContent = '就绪';

    // 创建日志显示
    const logTitle = document.createElement('div');
    logTitle.textContent = '操作日志:';
    logTitle.style.cssText = `
      margin: 10px 0 5px 0;
      font-weight: bold;
      color: #ffffff;
    `;

    this.logElement = document.createElement('div');
    this.logElement.style.cssText = `
      font-size: 11px;
      line-height: 1.4;
    `;

    // 组装元素
    this.container.appendChild(title);
    this.container.appendChild(this.statusElement);
    this.container.appendChild(logTitle);
    this.container.appendChild(this.logElement);

    // 添加到页面
    document.body.appendChild(this.container);
  }

  public setStatus(status: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    this.statusElement.textContent = status;
    
    // 根据类型设置颜色
    let color: string;
    let bgColor: string;
    
    switch (type) {
      case 'success':
        color = '#4caf50';
        bgColor = 'rgba(76, 175, 80, 0.1)';
        break;
      case 'warning':
        color = '#ff9800';
        bgColor = 'rgba(255, 152, 0, 0.1)';
        break;
      case 'error':
        color = '#f44336';
        bgColor = 'rgba(244, 67, 54, 0.1)';
        break;
      default:
        color = '#64ffda';
        bgColor = 'rgba(100, 255, 218, 0.1)';
    }
    
    this.statusElement.style.background = bgColor;
    this.statusElement.style.borderLeftColor = color;
  }

  public addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    this.logs.unshift(logEntry);
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // 更新显示
    this.updateLogDisplay();
    
    // 同时更新状态
    this.setStatus(message, type);
  }

  private updateLogDisplay(): void {
    this.logElement.innerHTML = '';
    
    this.logs.forEach((log, index) => {
      const logItem = document.createElement('div');
      logItem.textContent = log;
      logItem.style.cssText = `
        margin: 2px 0;
        opacity: ${1 - (index * 0.1)};
        color: ${index === 0 ? '#64ffda' : '#ffffff'};
      `;
      this.logElement.appendChild(logItem);
    });
  }

  public show(): void {
    this.container.style.display = 'block';
  }

  public hide(): void {
    this.container.style.display = 'none';
  }

  public clear(): void {
    this.logs = [];
    this.updateLogDisplay();
    this.setStatus('就绪');
  }

  public dispose(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
