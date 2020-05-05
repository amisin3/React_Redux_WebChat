import React, { Component } from "react";
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessageHeader extends Component {
  render() {
    const {
      channelName,
      numOfUniqueUser,
      handleSearchChange,
      searchLoading,
      isPrivateChannel,
      isChannelStarred,
      handleStar,
    } = this.props;

    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && (
              <Icon
                onClick={handleStar}
                name={isChannelStarred ? "star" : "star outline"}
                color={isChannelStarred ? "yellow" : "black"}
              />
            )}
          </span>
          <Header.Subheader>{numOfUniqueUser}</Header.Subheader>
        </Header>

        <Header floated="right">
          <Input
            size="mini"
            loading={searchLoading}
            icon="search"
            name="searchText"
            onChange={handleSearchChange}
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessageHeader;
