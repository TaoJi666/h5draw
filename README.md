# 抽签组队 H5

一个移动端优先的随机抽签组队页面：16 人随机分成 8 组，每组 2 人。名单和最近一次结果会保存在浏览器本地，结果可一键复制分享。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## Vercel 部署

推荐在 Vercel 导入仓库时这样配置：

- Root Directory: `team-draw-h5`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

项目已包含 `vercel.json`，Vercel 会按 `dist` 目录发布静态产物。

也可以使用 CLI：

```bash
cd team-draw-h5
vercel
vercel --prod
```

## 使用方式

1. 在左侧名单框中输入 16 个名字，每行一个，也支持用中文逗号、顿号、分号分隔。
2. 点击「开始抽签」生成 8 组结果。
3. 点击「重新抽一次」会基于当前名单再次随机分组。
4. 点击「复制结果」可把分组文本发到群聊。
