import React from 'react';
import { Navigate } from 'react-router-dom';
import ControlError from '../helpers/ControlError';
import WebSettings from '../../classes/WebSettings';
import Message from '../helpers/Message';
import { Modal, Card, Form } from 'react-bulma-components';
import axios from 'axios';
const { Control, Input } = Form;

class IngredientAddModal extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               name: '',
               image: '',
               calories: '',
               validity: {
                    name: {
                         state: false,
                         status: [],
                         rules: {
                              minLength: 3,
                              maxLength: 15
                         }
                    },
                    image: {
                         state: false,
                         status: [],
                         rules: {
                              minLength: 10,
                              maxLength: 255
                         }
                    },
                    calories: {
                         state: false,
                         status: [],
                         rules: {
                              isNumber: true,
                              minNumber: 0,
                              maxNumber: 5000
                         }
                    }
               },
               post: {
                    ingredient: {
                         request: {
                              sent: false,
                              response: false,
                              reach: false,
                              status: false,
                              statusSave: false,
                              errorSave: false,
                              errors: {},
                              values: {}
                         }
                    },
               },
               close: false
          };
     }

     //post
     create() {
          this.checkValidity(["name", "image", "calories"]);
          if (this.isNotValid()) {
               return;
          }
          this.setState({
               post: {
                    ingredient: {
                         request: {
                              ...this.state.post.ingredient.request,
                              sent: true
                         }
                    }
               }
          });

          const fd = new FormData();
          fd.append('name', this.state.name);
          fd.append('image', this.state.image);
          fd.append('calories', this.state.calories);
          axios.post(WebSettings.url + '/api/ingredients', fd)
          .then(res => {
               let request = {
                    sent: true,
                    response: true,
                    reach: false,
                    status: false,
                    statusSave: false,
                    errorSave: false,
                    errors: {},
                    values: {}
               }
               if (res.data && res.data.reach) {
                    const data = res.data;
                    request.reach = true;
                    request.status = data.status;
                    request.statusSave = data.statusSave;
                    request.errorSave = data.errorSave;
                    request.errors = data.errors;
                    request.values = data.values;
               }
               this.setState({
                    post: {
                         ingredient: {
                              request: request
                         }
                    }
               });
          })
          .catch(e => {
               this.setState({
                    post: {
                         ingredient: {
                              request: {
                                   ...this.state.post.ingredient.request,
                                   sent: true,
                                   response: true,
                                   reach: false
                              }
                         }
                    }
               });
          });
     }

     close() {
          this.setState({close: true});
     }

     isNotValid() {
          if (!this.state.validity.calories.state || 
               !this.state.validity.image.state || 
               !this.state.validity.name.state) {
                    return true;
          }
          return false
     }

     checkValidity(keys) {
          let validity = {...this.state.validity};
          for (let key of keys) {
               let notValid = [];
               let state = true;
               const value = this.state[key];
               for (let ruleKey in this.state.validity[key].rules) {
                    const rule = this.state.validity[key].rules[ruleKey];
                    if (ruleKey === "minLength" && String(value).length < rule) {
                         notValid.push("Minimum length is " + rule);
                         state = false;
                    }
                    if (ruleKey === "maxLength" && String(value).length > rule) {
                         notValid.push("Maximum length is " + rule);
                         state = false;
                    }
                    if (ruleKey === "isNumber" && isNaN(value)) {
                         notValid.push("The value must be a number");
                         state = false;
                    }
                    if (ruleKey === "minNumber" && (value < rule || String(value).trim().length === 0)) {
                         notValid.push("Minimum number is " + rule);
                         state = false;
                    }
                    if (ruleKey === "maxNumber" && value > rule) {
                         notValid.push("Maximum number is " + rule);
                         state = false;
                    }
               }
               validity[key] = {
                    state: state,
                    status: notValid,
                    rules: this.state.validity[key].rules
               }
          }
          this.setState({validity: validity});
     }

     handleInput(e, key) {
          this.setState({[key]: e.target.value}, () => this.checkValidity([key]));
     }

     render() {
          if (this.state.close) {
               return <Navigate to="/" />
          }

          let message = '';
          let post_save = false;
          if (this.state.post.ingredient.request.sent && !this.state.post.ingredient.request.response) {
               message = <Message type="loading" text="Try to save changes, please wait..." />;
          } 
          else if (this.state.post.ingredient.request.sent && this.state.post.ingredient.request.response && this.state.post.ingredient.request.reach) {
               if (!this.state.post.ingredient.request.status) {
                    message = <Message type="error" text={this.state.post.ingredient.request.errors} />;
               }
               else if (!this.state.post.ingredient.request.statusSave) {
                    message = <Message type="error" text={this.state.post.ingredient.request.errorSave} />;
               }
               else {
                    message = <Message type="success" text="A new ingredient just added!" />;
                    post_save = true;
               }
          }
          else if (this.state.post.ingredient.request.sent && this.state.post.ingredient.request.response && !this.state.post.ingredient.request.reach) {
               message = <Message type="error" text="Error: cannot communicate with database." />;
          }

          return <Modal show className="custom-modal" onClose={() => this.close()}>
          <Modal.Content>
               <Card mx="3" className="h100p">
                    <Card.Header>
                         <Card.Header.Title>Create a New Ingredient</Card.Header.Title>
                         <Card.Header.Icon textWeight="bold" textSize="4" onClick={() => this.close()}>&times;</Card.Header.Icon>
                    </Card.Header>
                    <Card.Content className="calculated">
                         {message}
                         {
                              !post_save 
                              ? <>
                                   <Control><Input onKeyUp={(e) => this.handleInput(e, "name")} type="text" placeholder="Name..." /></Control>
                                   <ControlError status={this.state.validity.name.status} />
                                   <Control mt="3"><Input onKeyUp={(e) => this.handleInput(e, "image")} type="text" placeholder="Image Url..." /></Control>
                                   <ControlError status={this.state.validity.image.status} />
                                   <Control mt="3"><Input onKeyUp={(e) => this.handleInput(e, "calories")} type="text" placeholder="Calories..." /></Control>
                                   <ControlError status={this.state.validity.calories.status} />
                              </>
                              : ''
                         }
                    </Card.Content>
                    <Card.Footer>
                         { !post_save ? <Card.Footer.Item backgroundColor="primary" textColor="white" onClick={() => this.create()}>Create</Card.Footer.Item> : '' }
                         <Card.Footer.Item onClick={() => this.close()}>{ !post_save ? 'Cancel' : 'Close' }</Card.Footer.Item>
                    </Card.Footer>
               </Card>
          </Modal.Content>
     </Modal>;
     }
}

export default IngredientAddModal;
