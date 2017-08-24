#### Example of React Higher Order Components

##### Motivation

The aim was to make React component which could listen to external events and print events to the browser pretending terminal. 
After a few events are sent component stops listening events.

:smile: Live demo: https://rhoc.amovile.com

##### Install

npm install gulp-cli -g
(if don't have yet)

npm install && gulp

open public/index.html in your browser

##### Design

The RowList is visual, presentational component which renders data on the screen.
All it has to know is that it receives update through 'data' prop
It doesn't know how to get data and it is fine !!!!

```JavaScript
const RowList = (props) => {
  let i=0;
  if (props.data instanceof Array) 
    return <div>{props.data.map((el)=>(<div className="" key={i++}>{el}</div>))}</div>
}
```

The Terminal component is kind of the glue between RowList (presentation) and DataSource (source of data)
```JavaScript
const Terminal = withSubscription(RowList)
```

We bind the Terminal component with DataSource methods
```JavaScript
const App = () => (<div><span className="cursor">A</span>
  <Terminal 
    onGetRows={DataSource.getRows} 
    onAddChangeListener={DataSource.addChangeListener}
    onRemoveChangeListener={DataSource.removeChangeListener}
    context={DataSource}/>
</div>)
```

DataSource is object which generates data, obviously it should be a real source like database, websocket, iot device, etc.
```JavaScript
DataSource.start()
```

We stop emiting data changes after a while
```JavaScript
setTimeout(()=>{
  DataSource.addRow("enough..........removing all listeners")
  DataSource.removeAllListeners()
},10000)
```



