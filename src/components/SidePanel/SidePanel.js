import React, { Component } from "react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import Starred from "./Starred";
import DirectMessage from "./DirectMessage";

import { Menu } from "semantic-ui-react";

class SidePanel extends Component {
  render() {
    const { currentUser, primaryColor } = this.props;

    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: "1.2rem" }}
      >
        <UserPanel currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessage currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
