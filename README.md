This is a simple plugin that allows you to mimic Vue's directives in React


## Installation

```
npm install babel-preset-react-dirs
```

## webpack-based project

create the __babel.config.js__ like this 

```js
// babel.config.js

module.exports = {
  presets: ['react-dirs']
}
```

## vite-based project

create the __vite.config.js__ like this 

```js
// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      presets: ['react-dirs']
    }
  })],
})

```


## Basic Example

```js
function App() {
  const [ls, setLs] = useState([2,4,5])
  const [obj, setObj] = useState({name: 'Tom', age: 28})
  const [flag, setFlag] = useState({f: false, t: true})
  return  <>
      <p for={ (fval, fkey, fidx) in ls } key={fkey}>{fval}--{fkey}---{fidx}</p>
      // 2--0---0
      // 4--1---1
      // 5--2---2

      <p for={ (fval, fkey, fidx) in obj } key={fkey}>{fval}--{fkey}---{fidx}</p>
      // Tom--name---0
      // 28--age---1

      <h1 if={flag.f}>h1</h1>

      <h2 else-if={flag.t}>h2</h2>

      <h3 else>h3</h3>
      // h2
    </>
}

```

## note 
if you are using ESlint, ESLint doesn't know you are doing a replacement in your plugin so you might want to instruct the tool that __fval, fkey and fidx__ will eventually be defined. see [more detail](https://eslint.org/docs/latest/use/configure/language-options#specifying-globals)


```
// .eslintrc.json

{
  "globals": {
    "fval": "readonly",
    "fkey": "readonly",
    "fidx": "readonly"
  }
}
```
