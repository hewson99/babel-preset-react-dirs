## Basic Example




```js
presets: [
  [
    require.resolve('babel-preset-react-dirs'),
    {
      // optional
      alias: {
        for: 'new-name', // if needed 
        'if': 'new-name' // if needed
        'else-if': 'new-name' // if needed
      }
    }
  ]
]

function App() {
  const [ls, setLs] = useState([2,4,5])
  const [obj, setObj] = useState({name: 'Tom', age: 28})
  const [flag, setFlag] = useState({f: false, t: true})
  return  <>
      <p for={ (val, key, idx) in ls } key={key} b={key}>{val}--{key}---{idx}</p>
      // 2--0---0
      // 4--1---1
      // 5--2---2

      <p for={ (val, key, idx) in obj } key={key} b={key}>{val}--{key}---{idx}</p>
      // Tom--name---0
      // 28--age---1

      <h1 if={flag.f}>h1</h1>

      <h2 else-if={flag.t}>h2</h2>

      <h3 else>h3</h3>
      // h2
    </>
}


```