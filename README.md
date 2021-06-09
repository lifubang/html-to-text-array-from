## The purpose of this test
Yesterday, I hit a strange issue which caused an api 504.
Because there were no `try catch` when I call `htmlToText` method.

The error log:
```
/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/inline-text-builder.js:132
      .map(words => words.join(' '))
                          ^

TypeError: Cannot read property 'join' of undefined
    at /Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/inline-text-builder.js:132:27
    at Array.map (<anonymous>)
    at InlineTextBuilder.toString (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/inline-text-builder.js:132:8)
    at getText (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/block-text-builder.js:388:55)
    at addText (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/block-text-builder.js:398:22)
    at BlockTextBuilder._closeBlock (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/block-text-builder.js:228:5)
    at BlockTextBuilder.closeBlock (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/block-text-builder.js:216:12)
    at formatParagraph (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/formatter.js:75:11)
    at recursiveWalk (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/html-to-text.js:267:9)
    at f1 (/Users/lifubang/dev/htmltexttest/node_modules/html-to-text/lib/helper.js:58:44)
```

So, I wrote this test to explain how to reproduce this issue.
```
node index.js
```

## The reason of this issue
Because the package `collections` override the method `Array.from`.
If we use `collections` with the version less than `5.1.12`， we may hit this error. Please see https://github.com/montagejs/collections/commit/e29ddf969968e016c9bd3ace78a0fd598479f565#diff-82aa39162c608c5d6416344e4e265da949a6fdb0a5d841aadc052f6f3edcc3c7

## How to improve it?
If someone can't upgrade the version of the package `collections`, how to avoid hit this error? I think people who hit this error will spend too much time to find the reason, because it's very difficult to detect.

Though it's the fault of `collections` package, but I think we can change the way of producing repeated empty arrays in `html-to-text` package.
Please see https://github.com/html-to-text/node-html-to-text/blob/master/lib/inline-text-builder.js#L102 .

In `html-to-text`, the author used a graceful code to produce repeated empty arrays. In order to be compatible with the old versions of `collections` package, I think we can use a more generic way to do this. The another reason is the executing efficiency of the code, please see the benchmark result:
```
node benchmark.js
Array.From used 5884 ms
Array.Fill used 766 ms
Generic Array method used 472 ms
```