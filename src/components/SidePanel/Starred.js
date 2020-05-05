import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { setPrivateChannel, setCurrentChannel } from "../../actions/index";

class Starred extends React.Component {
  state = {
    starredChannels: [],
    activeChannel: "",
    user: this.props.currentUser,
    userRef: firebase.database().ref("users"),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.userRef.child(`${this.state.user.uid}/starred`).off();
  };

  addListeners = (userID) => {
    this.state.userRef
      .child(userID)
      .child("starred")
      .on("child_added", (snap) => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          starredChannels: [...this.state.starredChannels, starredChannel],
        });
      });

    this.state.userRef
      .child(userID)
      .child("starred")
      .on("child_removed", (snap) => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        const filteredChannels = this.state.starredChannels.filter(
          (channel) => {
            return channel.id !== channelToRemove.id;
          }
        );
        this.setState({ starredChannels: filteredChannels });
      });
  };

  displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> Starred{" "}
          </span>
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setPrivateChannel, setCurrentChannel })(Starred);
