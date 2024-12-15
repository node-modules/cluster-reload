# Changelog

## [2.0.0](https://github.com/node-modules/cluster-reload/compare/v1.1.0...v2.0.0) (2024-12-15)


### ⚠ BREAKING CHANGES

* drop Node.js < 18.19.0 support

part of https://github.com/eggjs/egg/issues/3644

https://github.com/eggjs/egg/issues/5257

### Features

* support cjs and esm both by tshy ([#8](https://github.com/node-modules/cluster-reload/issues/8)) ([a2981f8](https://github.com/node-modules/cluster-reload/commit/a2981f867398ad842216a42f05975bd87cb636c8))

1.1.0 / 2022-11-17
==================

**fixes**
  * [[`c9594bf`](http://github.com/node-modules/cluster-reload/commit/c9594bf5d66b6dbcb13c927d0d36888b1bf0b4ae)] - fix: 1.0.2 code (shaoshuai0102 <<shaoshuai0102@gmail.com>>)

**others**
  * [[`a27942f`](http://github.com/node-modules/cluster-reload/commit/a27942f8bd907abc66930c6bee62f6509b52f308)] - 🤖 TEST: Run test on GitHub Action (#7) (fengmk2 <<fengmk2@gmail.com>>)
  * [[`53acb67`](http://github.com/node-modules/cluster-reload/commit/53acb67a7356a642f6a9ea10a83ca134a630882a)] - chore: update https://registry.npm.taobao.org to https://registry.npmmirror.com (#4) (Non-Official NPM Mirror Bot <<99484857+npmmirror@users.noreply.github.com>>)

1.0.2 / 2015-12-23
==================

  * fix: Windows not support SIGQUIT, use SIGTERM instead

1.0.1 / 2015-06-30
==================

 * fix: make sure child worker kill itself

1.0.0 / 2015-06-03
==================

 * first commit
