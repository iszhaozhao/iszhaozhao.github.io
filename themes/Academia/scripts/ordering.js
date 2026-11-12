'use strict';

/**
 * 分类页、标签页上的卡片顺序，以及卡片里预览的前几篇文章，
 * 跟当初生成静态站时文章被读入的顺序一致，而不是单纯按日期。
 * 这个顺序是从线上 tags/index.html、categories/index.html 反推的。
 * 不在列表里的新文章排在这些历史文章之后（预览里则排在前面，方便看到新文章）。
 */
const HISTORICAL_SLUGS = [
  'hello-world',
  'cpp-class-and-object',
  'cpp-inheritance',
  'cpp-polymorphism',
  'cpp-operator-overloading',
  'database-index-optimization-and-query-performance',
  'deep-learning-hash-algorithms-and-network-security',
  'python-async-programming-and-high-performance-web',
  'cpp-smart-pointers-and-memory-management'
];

const { stripHTML, truncate } = require('hexo-util');

function toArray(col) {
  if (!col) return [];
  if (typeof col.toArray === 'function') return col.toArray();
  if (Array.isArray(col)) return col.slice();
  return [];
}

function timeOf(post) {
  return post.date && typeof post.date.valueOf === 'function' ? post.date.valueOf() : 0;
}

function seenRank(post) {
  const index = HISTORICAL_SLUGS.indexOf(post.slug);
  if (index >= 0) return index;
  return 100000 + timeOf(post) / 1000;
}

function previewRank(post) {
  const index = HISTORICAL_SLUGS.indexOf(post.slug);
  if (index < 0) return -timeOf(post);
  return index + 1;
}

function categoryDepth(cat) {
  const Category = hexo.model('Category');
  let depth = 0;
  let parentId = cat.parent;
  let guard = 0;
  while (parentId && guard++ < 12) {
    depth += 1;
    const parent = Category.findById(parentId);
    parentId = parent && parent.parent;
  }
  return depth;
}

function firstSeen(catOrTag) {
  const posts = toArray(catOrTag.posts);
  if (!posts.length) return 1e15;
  return Math.min(...posts.map(seenRank));
}

hexo.extend.helper.register('ordered_categories', function () {
  const cats = toArray(this.site.categories);
  return cats.slice().sort((a, b) => {
    const byDepth = categoryDepth(a) - categoryDepth(b);
    if (byDepth) return byDepth;
    const bySeen = firstSeen(a) - firstSeen(b);
    if (bySeen) return bySeen;
    return String(a.name).localeCompare(String(b.name), 'zh-CN');
  });
});

hexo.extend.helper.register('ordered_tags', function () {
  const tags = toArray(this.site.tags);
  function rank(tag) {
    let bestPost = 1e15;
    let bestIndex = 1e15;
    for (const post of toArray(tag.posts)) {
      const postRank = seenRank(post);
      const names = toArray(post.tags).map(item => item.name);
      const tagIndex = names.indexOf(tag.name);
      const order = tagIndex < 0 ? 999 : tagIndex;
      if (postRank < bestPost || (postRank === bestPost && order < bestIndex)) {
        bestPost = postRank;
        bestIndex = order;
      }
    }
    return [bestPost, bestIndex];
  }
  return tags.slice().sort((a, b) => {
    const left = rank(a);
    const right = rank(b);
    if (left[0] !== right[0]) return left[0] - right[0];
    if (left[1] !== right[1]) return left[1] - right[1];
    return String(a.name).localeCompare(String(b.name), 'zh-CN');
  });
});

hexo.extend.helper.register('preview_posts', function (posts, limit) {
  const list = toArray(posts).slice().sort((a, b) => previewRank(a) - previewRank(b));
  return list.slice(0, limit || 3);
});

hexo.extend.helper.register('post_categories', function (post) {
  return toArray(post.categories).slice().sort((a, b) => {
    const left = a.path || '';
    const right = b.path || '';
    return left.length - right.length || left.localeCompare(right);
  });
});

hexo.extend.helper.register('academia_excerpt', function (post, length) {
  return truncate(stripHTML(post.content || ''), { length, omission: '...' });
});

hexo.extend.helper.register('archive_groups', function () {
  const posts = this.site.posts.sort('date', -1).toArray();
  const years = [];
  const yearMap = new Map();
  for (const post of posts) {
    const yearKey = post.date.format('YYYY');
    const monthKey = post.date.format('YYYY年MM月');
    if (!yearMap.has(yearKey)) {
      const year = { year: yearKey, months: [] };
      yearMap.set(yearKey, year);
      years.push(year);
    }
    const year = yearMap.get(yearKey);
    let month = year.months.find(item => item.label === monthKey);
    if (!month) {
      month = { label: monthKey, posts: [] };
      year.months.push(month);
    }
    month.posts.push(post);
  }
  return years;
});
