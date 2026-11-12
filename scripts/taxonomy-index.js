'use strict';

// 官方 hexo-generator-category 不会生成 /categories/，
// hexo-generator-tag 只有打开 enable_index_page 才会生成 /tags/，
// 而且默认布局不是现在这套总览页。这里补上和线上一致的两个入口。

hexo.extend.generator.register('taxonomy-index', function () {
  return [
    {
      path: 'categories/index.html',
      layout: 'categories',
      data: { layout: 'categories' }
    },
    {
      path: 'tags/index.html',
      layout: 'tags',
      data: { layout: 'tags' }
    }
  ];
});
