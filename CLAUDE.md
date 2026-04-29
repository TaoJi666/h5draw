# team-draw-h5 架构说明

## 目录结构

```text
team-draw-h5/
├── index.html          # Vite HTML 入口，定义移动端视口与页面元信息
├── vercel.json         # Vercel 静态部署配置，构建 dist 并回退到 index.html
├── package.json        # React + Vite + TypeScript 最小运行脚本
├── package-lock.json   # npm 依赖锁定文件，保障 Vercel 安装结果稳定
├── tsconfig.json       # TypeScript 严格类型检查配置
├── vite.config.ts      # Vite React 构建配置
├── .gitignore          # 忽略依赖、构建产物和本地环境文件
├── src/
│   ├── main.tsx        # React 根节点挂载
│   ├── App.tsx         # 页面编排、名单状态、抽签交互与本地持久化
│   ├── App.css         # H5 视觉系统、响应式布局与动效
│   ├── teamUtils.ts    # 名单解析、校验、随机洗牌、结果格式化纯函数
│   └── vite-env.d.ts   # Vite 与 CSS 模块导入类型声明
└── README.md           # 本地运行和 Vercel 部署说明
```

## 设计边界

- `App.tsx` 只负责页面状态与事件编排，不承载随机算法细节。
- `teamUtils.ts` 是可测试的纯逻辑层，抽签规则固定为 16 人、8 组、每组 2 人。
- `App.css` 独立承载视觉表达，移动端优先，不依赖外部 UI 库。
- 当前应用无后端、无接口、无登录态，Vercel 以纯静态产物部署。

## 变更记录

- 2026-04-29：新增抽签组队 H5 独立应用，补齐 Vercel 部署配置与目录说明。
