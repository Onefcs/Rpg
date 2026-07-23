# Hero Runner — project instructions

## Git workflow
- After every commit, always push to **both** the feature branch and `main`:
  ```
  git push -u origin <branch> && git push origin <branch>:main
  ```
- Never ask for confirmation before pushing to main.
- Always set git identity before committing:
  ```
  git config user.email noreply@anthropic.com
  git config user.name Claude
  ```

## Stack
- Pure vanilla JS + HTML5 Canvas 2D, no framework
- Portrait canvas: VW=540, VH=960 (9:16)
- Entry: index.html → js/constants.js → js/state.js → js/utils.js → js/assets.js → js/select.js → js/game.js → js/bg.js → js/draw.js → js/input.js → js/main.js
