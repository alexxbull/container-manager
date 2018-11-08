import React, { Component } from 'react';
import './App.css';
import ContainerTabs from '../components/ContainerTabs'
import { BrowserRouter } from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containers: this.loadContainers(),
    }
  }

  // load containers from local storage
  loadContainers() {
    let containers = [];

    if (localStorage.getItem('containers') !== null)
      containers = JSON.parse(localStorage.getItem('containers'))

    return containers
  }

  // add the container to data in local storage
  addContainer(container) {
    const { containers } = this.state
    containers.push(container)
    this.updateContainers(containers)
  }

  // delete container with the given ID
  deleteContainer(id) {
    const { containers } = this.state
    const containersList = containers.filter(c => c.id !== id)
    this.updateContainers(containersList)
  }

  updateContainers(containers) {
    localStorage.setItem('containers', JSON.stringify(containers))
    this.setState({ containers: containers })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ContainerTabs
            containers={this.state.containers}
            add={this.addContainer.bind(this)}
            del={this.deleteContainer.bind(this)} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
