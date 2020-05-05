import React, { Component } from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"]
  };

  addFile = event => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      this.setState({ file });
    }
  };

  clearFile = () => this.setState({ file: null });

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        // console.log(file.name);
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  isAuthorized = filename => {
    return this.state.authorized.includes(mime.lookup(filename));
  };

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image Field</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
