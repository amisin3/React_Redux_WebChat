import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import "./App.css";

import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

const App = ({
  currentUser,
  currentChannel,
  isPrivateChannel,
  userPosts,
  primaryColor,
  secondaryColor,
}) => (
  <Grid columns="equal" className="app" style={{ background: secondaryColor }}>
    <ColorPanel
      key={currentUser && currentUser.name}
      currentUser={currentUser}
    />
    <SidePanel
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
      primaryColor={primaryColor}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>
    <GridColumn width={4}>
      <MetaPanel
        key={currentChannel && currentChannel.name}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        userPosts={userPosts}
      />
    </GridColumn>
  </Grid>
);

App.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentChannel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor,
});

export default connect(mapStateToProps)(App);
