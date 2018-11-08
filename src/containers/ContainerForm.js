import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  /* align in the center of the page */
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  /* align in the middle of the page*/
  middle: {
    display: 'flex',
    justifyContent: 'center',
  }
});

class ContainerForm extends Component {
  state = {
    id: {
      value: '',
      error: false,
      errorMessage: 'Format: 4 letters followed by 7 digits',
    },
    status: {
      value: '',
      error: false,
      errorMessage: '',
    },
    fees: {
      value: '',
      error: false,
      errorMessage: '',
    },
    terminal: {
      value: '',
      error: false,
      errorMessage: '',
    },
    location: {
      value: '',
      error: false,
      errorMessage: '',
    },
    type: {
      value: '',
      error: false,
      errorMessage: '',
    },
    time: {
      value: '00:00',
      error: false,
      errorMessage: '',
    },
    duration: {
      value: 30,
      error: false,
      errorMessage: 'Between 30 and 60 minutes',
    },
  };

  handleChange = name => event => {
    // create new object with updated values
    const newObject = {
      value: event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value, // if value is a number then parse it
      error: false,    // when input has changed, reset errors to false
      errorMessage: '' // when input has changed, reset error message to false
    }

    // uppercase any letters in id and reset message to show expected format
    if (name === 'id') {
      newObject.value = newObject.value.toUpperCase()
      newObject.errorMessage = 'Format: 4 letters followed by 7 digits'
    }

    // reset duration message to show expected format
    if (name === 'duration')
      newObject.errorMessage = 'Between 30 and 60 minutes'

    this.setState({ [name]: newObject });
  };

  handleSubmit = event => {
    // stop default form submission
    event.preventDefault()

    let allInputsValid = true

    // check if each this.state object has a valid value
    // if the value is invalid then show error
    for (let name in this.state) {
      const obj = this.state[name]
      const newObject = { ...obj }

      // check if fee value is 0 or greater
      if (name === 'fees' && obj.value < 0) {
        newObject.error = true
        newObject.errorMessage = 'Can not be negative'
        allInputsValid = false
      }
      // check if container id is in a valid format and unique
      // if valid then uppercase letters in id
      else if (name === 'id') {
        const isLetter = /^[A-Za-z]+$/
        const isDigit = /^[0-9]+$/
        const str = obj.value
        const idChars = str.substr(0, 4)
        const idDigits = str.substr(-7)
        const containers = this.props.containers

        // check if id is the correct length
        if (str.length !== 11) {
          newObject.error = true
          newObject.errorMessage = str.length > 11 ? 'Too long' : 'Too short'
          allInputsValid = false
        }
        // check if first 4 chars in id are letters
        else if (!idChars.split('').every(ch => ch.match(isLetter))) {
          newObject.error = true
          allInputsValid = false
        }
        // check if last 7 chars in id are numbers
        else if (!idDigits.split('').every(num => num.match(isDigit))) {
          newObject.error = true
          allInputsValid = false
        }
        // check if id to add is unique
        else if (containers.some(container => container.id === obj.value)) {
          newObject.error = true
          newObject.errorMessage = 'A container with the same ID already exists'
          allInputsValid = false
        }
      }
      // check if duration value is between 30 and 60 minutes
      else if (name === 'duration') {
        let duration = parseInt(obj.value)
        // check if input is a float
        if (duration !== parseFloat(obj.value)) {
          newObject.error = true
          newObject.errorMessage = 'No decimals allowed'
          allInputsValid = false
        }
        // check if input between 30 and 60 minutes
        else if (duration < 30 || duration > 60) {
          newObject.error = true
          newObject.errorMessage = duration > 60 ? 'Over an one hour' : 'Under 30 minutes'
          allInputsValid = false
        }
      }
      // show error if no input is given
      else if (!obj.value && obj.value !== 0) {
        newObject.error = true
        allInputsValid = false
      }

      // show error if input is invalid
      if (!allInputsValid)
        this.setState({ [name]: newObject })
    }

    // if all properties have valid values, then add container to local storage
    if (allInputsValid) {
      // populate a container with the values of this.state's objects
      const container = {}
      for (let name in this.state)
        container[name] = this.state[name].value

      this.props.add(container)
      this.props.showViewTab()
      this.props.history.push('/containers/view')
    }
  }

  render() {
    const { classes } = this.props;
    const { duration, fees, id, location, status, terminal, time, type } = this.state

    return (
      <div className={classes.center}>
        <Input
          value="Container Form"
          className={classes.input}
          disabled
        />

        <div className={classes.middle}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              error={id.error}
              helperText={id.errorMessage}
              id="Container ID"
              label="Container ID"
              className={classes.textField}
              onChange={this.handleChange("id")}
              margin="normal"
              placeholder="ABCD1234567"
              type="text"
              value={id.value}
              required
            />
            <TextField
              error={fees.error}
              helperText={fees.errorMessage}
              id="Fees"
              label="Fees"
              className={classes.textField}
              onChange={this.handleChange("fees")}
              margin="normal"
              placeholder="0.00"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
            <TextField
              error={terminal.error}
              helperText={terminal.errorMessage}
              id="Terminal"
              label="Terminal"
              className={classes.textField}
              onChange={this.handleChange("terminal")}
              margin="normal"
              placeholder="Terminal"
              required
            />
            <TextField
              error={location.error}
              helperText={location.errorMessage}
              id="Yard Location"
              label="Yard Location"
              className={classes.textField}
              onChange={this.handleChange("location")}
              margin="normal"
              placeholder="Yard location"
              required
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                error={status.error}
                value={status.value}
                onChange={this.handleChange("status")}
                required
                inputProps={{
                  name: "status",
                  id: "status"
                }}
              >
                <MenuItem value="hold">On Hold</MenuItem>
                <MenuItem value="waiting">Waiting for pickup</MenuItem>
                <MenuItem value="transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
              <FormHelperText>{status.errorMessage}</FormHelperText>
            </FormControl>
          </form>
        </div>

        <Input
          value="Appointment"
          className={classes.input}
          disabled
        />

        <div className={classes.middle}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              error={time.error}
              id="time"
              label="Time"
              type="time"
              defaultValue="00:00"
              className={classes.textField}
              onChange={this.handleChange("time")}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              error={duration.error}
              id="duration"
              label="Duration (mins)"
              type="number"
              value={duration.value}
              placeholder="Duration"
              helperText={duration.errorMessage}
              className={classes.textField}
              onChange={this.handleChange("duration")}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 30, max: 60 }}
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                error={type.error}
                value={type.value}
                onChange={this.handleChange("type")}
                required
                inputProps={{
                  name: "type",
                  id: "type"
                }}
              >
                <MenuItem value="import">Import</MenuItem>
                <MenuItem value="export">Export</MenuItem>
                <MenuItem value="dropoff">Empty Drop-off</MenuItem>
              </Select>
              <FormHelperText>{type.errorMessage}</FormHelperText>
            </FormControl>
          </form>
        </div>

        <div>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            type="submit"
            onClick={this.handleSubmit}>Submit</Button>
        </div>
      </div>
    )
  }
}

ContainerForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ContainerForm));