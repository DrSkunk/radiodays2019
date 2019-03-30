import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

const initialState = {
  open: false,
  loading: false,
  name: 'Untitled poll',
  choices: [
    {
      text: '',
      image: ''
    },
    {
      text: '',
      image: ''
    }
  ]
};

class AddPoll extends React.Component {
  state = initialState;
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState(initialState);
  };

  handleSubmit = () => {
    this.setState({ loading: true });
    const { choices, name } = this.state;
    const { currentStation } = this.props;
    const body = {
      station: currentStation,
      choices,
      name
    };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    console.log(body);
    fetch(
      'https://us-central1-test-rhe.cloudfunctions.net/addPoll',
      fetchOptions
    )
      .then(response => response.text())
      .then(x => {
        console.log(x);
        this.setState(initialState);
      })
      .catch(console.error);
  };

  //   addOption = () => {
  //     this.setState(state => {
  //       return { options: [...state.options, ''] };
  //     });
  //   };

  //   deleteOption = index => {
  //     this.setState(state => {
  //       const { options } = state;
  //       return {
  //         options: [
  //           ...options.slice(0, index),
  //           ...options.slice(index + 1, options.length)
  //         ]
  //       };
  //     });
  //   };

  handleNameChange = event => {
    const name = event.target.value;
    this.setState({ name });
  };

  handleOptionChange = (index, type) => event => {
    const value = event.target.value;
    this.setState(state => {
      state.choices[index][type] = value;
      return state;
    });
  };

  render() {
    const { name, loading, choices } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Add Poll
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add poll - {name}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              value={name}
              onChange={this.handleNameChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="option1"
              label="Option 1"
              type="text"
              value={choices[0].text}
              onChange={this.handleOptionChange(0, 'text')}
              fullWidth
            />
            <TextField
              margin="dense"
              id="option1-image"
              label="Option 1 Image"
              value={choices[0].image}
              onChange={this.handleOptionChange(0, 'image')}
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="option2"
              label="Option 2"
              type="text"
              value={choices[1].text}
              onChange={this.handleOptionChange(1, 'text')}
              fullWidth
            />
            <TextField
              margin="dense"
              id="option2-image"
              label="Option 2 Image"
              type="text"
              value={choices[1].image}
              onChange={this.handleOptionChange(1, 'image')}
              fullWidth
            />
            {loading ? <CircularProgress className={classes.progress} /> : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading}
            >
              Add Poll
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AddPoll.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(AddPoll);
