
// This function takes a component...
function withSubscription(WrappedComponent) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: props.onGetRows.call(props.context, props)
      };
    }
    componentDidMount() {
      // ... that takes care of the subscription...
      this.props.onAddChangeListener.call(this.props.context, this.handleChange);
      console.log("Component started listening");
    }
    componentWillUnmount() {
      this.props.onRemoveChangeListener.call(this.props.context, this.handleChange);
      console.log("Component stopped listening");
    }
    handleChange() {
      this.setState({
        data: this.props.onGetRows.call(this.props.context, this.props)
      });
      console.log("Component updates data");
    }
    render() {
      // ... and renders the wrapped component with the fresh data!
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
// -------------------------------------------------------------------------------

let prompt = "tecmint@tecmint ~ "
let termOut = []
termOut[0] = { 
  cmd: "$ cal",
  out: [ "September 2015",
"Su Mo Tu We Th Fr Sa",
"1  2  3  4  5",
"6  7  8  9 10 11 12",
"13 14 15 16 17 18 19",
"20 21 22 23 24 25 26",
"27 28 29 30"]
}
termOut[1] = { 
  cmd: "w",
  out: [ "14:49:40 up  4:06,  2 users,  load average: 1.37, 1.56, 1.62",
"USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT",
"tecmint  tty8     :0               10:45    4:06m  7:40   0.36s x-session-manager",
"tecmint  pts/5    :0               13:42    4.00s  0.07s  0.00s script script.log"]
}
termOut[2] = { 
  cmd: "uptime",
  out: [ "14:49:43 up  4:06,  2 users,  load average: 1.37, 1.56, 1.62"]
}
termOut[3] = { 
  cmd: "whoami",
  out: [ "tecmint"]
}
termOut[4] = { 
  cmd: "echo 'using script",
  out: [ "using script"]
}
termOut[5] = { 
  cmd: "exit",
  out: [ "exit", "Script done, file is script.log"]
}
let DataSource = {
  cl: [],
  rows: [],
  getRows: function() {
    return this.rows
  },
  addChangeListener: function(handle) {
    this.cl.push(handle)
  },
  removeChangeListener: function(handle) {
    let foundIdx = this.cl.lastIndexOf(handle)
    this.cl = [ ...this.cl.slice(0,foundIdx), ...this.cl.slice(foundIdx+1, this.cl.length) ]
  },
  removeAllListeners: function() {
    this.cl = []
  },
  onChange: function() {
    this.cl.forEach(function(fn) {
      fn.apply(null,null)
    }, this);
  },
  addRow: function(text) {
    this.rows = [...this.rows, text]
    this.onChange()
  },
  start: function() {
    setInterval( ()=>{
      let idx = Math.floor(Math.random() * 5)
      this.addRow(prompt + " " + termOut[idx].cmd)
      setTimeout(
        () => {
          termOut[idx].out.forEach(function(el) {
            this.addRow(el)
          }, this);
        } , 200);        
    }, 1000)
  }
}
// ------------------------------------------------------------------------------
// The RowList is visual, presentational component
// All it has to know is that it receives update through 'data' prop
// It doesn't know how to get data and it is fine !!!!
const RowList = (props) => {
  let i=0;
  if (props.data instanceof Array) 
    return <div>{props.data.map((el)=>(<div className="" key={i++}>{el}</div>))}</div>
}

// Constructing the Terminal component which is kind of the glue between RowList (presentation) and DataSource (source of data)
const Terminal = withSubscription(RowList)

// We bind the Terminal component with DataSource methods
const App = () => (<div><span className="cursor">A</span>
  <Terminal 
    onGetRows={DataSource.getRows} 
    onAddChangeListener={DataSource.addChangeListener}
    onRemoveChangeListener={DataSource.removeChangeListener}
    context={DataSource}/>
</div>)

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)

// Start of generating data
DataSource.start()

// Stop emiting data
setTimeout(()=>{
  DataSource.addRow("enough..........removing all listeners")
  DataSource.removeAllListeners()
},10000)
