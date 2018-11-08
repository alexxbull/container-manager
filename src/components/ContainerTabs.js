import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ContainerForm from '../containers/ContainerForm'
import ContainerTable from './ContainerTable'
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class ContainerTabs extends React.Component {
  state = {
    value: 'View Containers',
    addLabel: 'Add New Container',
    viewLabel: 'View Containers',
  };

  handleChange = (event, value) => this.setState({ value: value })

  showViewTab = () => this.handleChange(null, this.state.viewLabel)

  render() {
    const { add, del, classes, containers } = this.props;
    const { addLabel, viewLabel, value } = this.state

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              fullWidth
            >
              <Tab
                label="Add New Container"
                value={addLabel}
                component={Link}
                to="/containers/add" />
              <Tab
                label="View Containers"
                value={viewLabel}
                component={Link}
                to="/containers/view" />
            </Tabs>
          </AppBar>

          <Switch>
            <Route
              path="/containers/add"
              render={props => {
                return <ContainerForm
                  add={add}
                  containers={containers}
                  showViewTab={this.showViewTab} />
              }} />
            <Route
              path="/containers/view"
              render={props => {
                return <ContainerTable
                  containers={containers}
                  del={del} />
              }} />
            <Route
              path="/"
              render={props => {
                return <ContainerTable
                  containers={containers}
                  del={del} />
              }} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

ContainerTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainerTabs)
