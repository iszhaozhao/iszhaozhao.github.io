# 赵正的个人博客

这是从已经发布的 GitHub Pages 站点恢复出来的 Hexo 7.3.0 工程。主题用的是 [Academia](https://github.com/PhosphorW/hexo-theme-academia)，源码放在 `themes/Academia`（含原来的首页、归档、分类、标签和关于页定制）。

把 Markdown 推到 `main` 之后，GitHub Actions 会生成静态页面并发布。

## 写一篇新文章

在 `source/_posts/` 里新建一个 Markdown 文件，例如 `source/_posts/my-new-post.md`。文件名会变成网址的一部分：`/年/月/日/my-new-post/`。

```markdown
---
title: "文章标题"
date: 2026-11-12 12:00:00
tags:
  - "标签"
categories:
  - "分类"
---

正文从这里开始。
```

多级分类写成嵌套列表：

```yaml
categories:
  - ["编程语言", "Python"]
```

首页「最近更新」只展示 front-matter 里写了 `academia: true` 的文章。这是 Academia 主题原来的规则，所以现在首页只有 Hello World。没写这个字段的文章仍会出现在归档、分类和标签页。希望一篇新文章也出现在首页时，加上：

```yaml
academia: true
```

如果希望首页列出全部文章，把 `themes/Academia/_config.yml` 里的 `index_only_academia` 改成 `false`。

头像文件是 `source/img/avatar.png`，简历是 `source/attaches/CV.pdf`。

## 本地预览（可选）

需要 Node.js 20 或更新版本。

```bash
npm install
npx hexo server
```

浏览器打开 <http://localhost:4000>。只生成、不预览可以用 `npx hexo generate`，结果在 `public/` 目录。

## 部署是怎么发生的

推送到 `main` 后，`.github/workflows/pages.yml` 会：

1. 执行 `npm ci` 安装依赖
2. 执行 `npx hexo generate` 生成 `public/`
3. 用 `actions/upload-pages-artifact` 上传 `public/`
4. 用 `actions/deploy-pages` 发布到 GitHub Pages

不要再用 `hexo deploy` 把生成出来的 HTML 提交回仓库根目录。

## 合并之后要改的一项 Pages 设置

现在站点是从 `main` 分支的根目录发布的。这次改动**没有删掉**已经生成好的 HTML，所以先合并不会让线上站点挂掉。

请按下面的顺序操作：

1. 合并这个拉取请求。线上仍由 `main` 根目录里的旧静态文件提供，页面和现在一样。Actions 里「Deploy Hexo site to GitHub Pages」的部署步骤这时多半会失败，因为 Pages 的发布来源还不是 GitHub Actions。这是预期情况。
2. 打开仓库的 **Settings → Pages → Build and deployment**，把 **Source** 从 **Deploy from a branch**（分支 `main`，目录 `/ (root)`）改成 **GitHub Actions**。
3. 打开 **Actions**，找到刚才失败的那次运行，选择 **Re-run failed jobs**。也可以再往 `main` 推一次。工作流成功之后，线上会换成这次生成的 `public/`。
4. 打开 <https://iszhaozhao.github.io>，确认首页、归档、分类、标签、关于、文章和 `/attaches/CV.pdf` 都正常。
5. 第 3 步成功之后，可以再提交一次，删掉仓库根目录里旧的生成文件：`index.html`、`2023/`、`2026/`、`about/`、`archives/`、`categories/`、`tags/`、`css/`、`js/`、`img/`、`attaches/`。这些文件已经不再被 Pages 使用。**不要在第 2 步完成之前删除它们。** 来源仍是 `main` 分支时，下一次推送会把没有 `index.html` 的仓库发布出去，站点会打不开。
