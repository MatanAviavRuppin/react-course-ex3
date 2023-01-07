import React from 'react';
import { Form } from 'react-bulma-components';
const { Control } = Form;

class ControlError extends React.Component {
     constructor(props) {
          super(props);
     }
     render() {
          if (this.props.status.length === 0) {
               return '';
          }
          return <Control><div className="mt-2 is-size-7 has-text-danger">{this.props.status.join(",")}</div></Control>
     }
}

export default ControlError;