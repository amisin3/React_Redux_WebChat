import React, { Component } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

class Message extends Component {
  state = {
    message: this.props.message,
    user: this.props.user,
  };

  isOwnMessage = (message, user) => {
    return message.user.id === user.id ? "message__self" : "";
  };

  timeFromNow = (timestamp) => moment(timestamp).fromNow();

  LogMessage = (message) => console.log(message.user.name);

  isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  render() {
    const { message, user } = this.state;

    return (
      <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={this.isOwnMessage(message, user)}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>
            {this.timeFromNow(message.timestamp)}
          </Comment.Metadata>

          {this.isImage(message) ? (
            <Image src={message.image} className="message__image" />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    );
  }
}

export default Message;
