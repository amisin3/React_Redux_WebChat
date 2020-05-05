import React, { Component } from "react";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  FormField,
  Button,
  Label,
} from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions/index";
import PropTypes from "prop-types";

class Channels extends Component {
  state = {
    channel: null,
    channels: [],
    channelName: "",
    channelDetail: "",
    modal: false,
    channelsRef: firebase.database().ref("channels"),
    messageRef: firebase.database().ref("message"),
    typingRef: firebase.database().ref("typing"),
    notifications: [],
    user: this.props.currentUser,
    firstLoad: true,
    activeChannel: "",
  };

  componentDidMount() {
    this.addListener();
  }

  componentWillUnmount() {
    this.removeListener();
  }

  addListener = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      console.log(loadedChannels);
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationsListener(snap.key);
    });
  };

  addNotificationsListener = (channelId) => {
    this.state.messageRef.child(channelId).on("value", (snap) => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    this.setState({ notifications: notifications });
  };

  removeListener = () => {
    this.state.channelsRef.off();
    this.state.channels.forEach((channel) => {
      this.state.messageRef.child(channel.id).off();
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
    this.setState({ channel: firstChannel });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetail, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      detail: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetail: "" });
        this.closemodal();
        console.log("Channel Added");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(this.state.user.uid)
      .remove();
    this.clearNotification();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel: channel });
  };

  clearNotification = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updateNotifications = [...this.state.notifications];
      updateNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updateNotifications[index].count = 0;
      this.setState({ notifications: updateNotifications });
    }
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  getNotificationCount = (channel) => {
    let count = 0;

    this.state.notifications.map((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) {
      return count;
    }
  };

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  openModal = () => {
    this.setState({ modal: true });
  };

  closemodal = () => {
    this.setState({ modal: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail;

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channels{" "}
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Add a channel */}
        <Modal basic open={modal} onClose={this.closemodal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <FormField>
                <Input
                  fluid
                  name="channelName"
                  label="Name of Channel"
                  onChange={this.handleChange}
                />
              </FormField>
              <FormField>
                <Input
                  fluid
                  name="channelDetail"
                  label="Detail of Channel"
                  onChange={this.handleChange}
                />
              </FormField>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closemodal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

Channels.prototypes = {
  setCurrentChannel: PropTypes.func.isRequired,
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
