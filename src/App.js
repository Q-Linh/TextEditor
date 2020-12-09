import React, { Component } from 'react';
import './App.css';
import PageContainer from './components/PageContainer'


class App extends Component {
  render() {
    return (
		<div className="App">
			<div className="AppTitle">
				<h1>Text Editor Demo</h1>
			</div>	
			<div className="AppEditor">
				<PageContainer />
			</div>
		</div>
    );
  }
}

export default App;
