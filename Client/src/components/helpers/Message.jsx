import React from 'react';

class Message extends React.Component {
     constructor(props) {
          super(props);
     }
     render() {
          let elem = '';
          if (typeof this.props.text == "string") {
               if (this.props.type === "loading") {
                    elem = <div className="is-flex is-justify-content-center is-align-items-center is-size-4 pb-4">
                    <button className="is-loading button is-medium py-0" style={{border: '0px solid white'}}></button>
                    <div>{ this.props.text }</div></div>;
               }
               else if (this.props.type === "error") {
                    elem = <div className="is-flex is-justify-content-center is-align-items-center is-size-4 pb-4">
                    <div className="has-text-danger">{ this.props.text }</div></div>;
               }
               else if (this.props.type === "success") {
                    elem = <div className="is-flex is-justify-content-center is-align-items-center is-size-4 pb-4">
                    <div className="has-text-success">{ this.props.text }</div></div>;
               }
          }
          else {
               let errors = [];
               for (let e in this.props.text) {
                    errors.push(<div key={'message_' + e} className="has-text-danger">{ this.props.text[e] }</div>);
               }
               elem = <div className="is-flex is-flex-direction-column is-size-6 pb-4">
                    {errors}
               </div>;
          }
          return elem;
     }
}

export default Message;