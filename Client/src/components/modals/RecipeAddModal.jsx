import React from 'react';
import Ingredient from '../core/Ingredient';
import ControlError from '../helpers/ControlError';
import Message from '../helpers/Message'
import { Navigate } from 'react-router-dom';
import IngredientClass from '../../classes/IngredientClass'
import WebSettings from '../../classes/WebSettings'
import axios from 'axios';
import { Columns, Card, Form, Modal } from 'react-bulma-components';
const { Control, Input } = Form;

class RecipeAddModal extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               name: '',
               cookingMethod: '',
               time: '',
               image: '',
               selectedIngredients: [],
               validity: {
                    name: {
                         state: false,
                         status: [],
                         rules: {
                              minLength: 3,
                              maxLength: 40
                         }
                    },
                    cookingMethod: {
                         state: false,
                         status: [],
                         rules: {
                              minLength: 3,
                              maxLength: 40
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
                    time: {
                         state: false,
                         status: [],
                         rules: {
                              isNumber: true,
                              minNumber: 1, //in minutes
                              maxNumber: 60 * 12 //12 hours
                         }
                    },
                    selectedIngredients: {
                         state: false,
                         status: [],
                         rules: {
                              array: true
                         }
                    },
               },
               close: false,
               get: {
                    ingredients: {
                         request: {
                              sent: false,
                              response: false,
                              reach: false,
                              status: false,
                              error: false,
                              values: {}
                         }
                    },
               },
               post: {
                    recipe: {
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
               ingredients: []
          };
     }

     //send requests
     getIngredients() {
          this.setState({
               get: {
                    ingredients: {
                         request: {
                              ...this.state.get.ingredients.request,
                              sent: true
                         }
                    }
               }
          });
          axios.get(WebSettings.url + '/api/ingredients')
          .then(res => {
               let request = {
                    sent: true,
                    response: true,
                    reach: false,
                    status: false,
                    error: false,
                    values: {}
               }
               if (res.data && res.data.reach) {
                    const data = res.data;
                    request.reach = true;
                    request.status = data.status;
                    request.values = data.values;
                    request.error = data.error;
               }
               this.setState({
                    get: {
                         ingredients: {
                              request: request
                         }
                    }
               }, () => request.reach && request.status && this.buildIngredients());
          })
          .catch(e => {
               this.setState({
                    get: {
                         ingredients: {
                              request: {
                                   ...this.state.get.ingredients.request,
                                   response: true,
                                   reach: false
                              }
                         }
                    }
               });
          });
     }

     buildIngredients() {
          let ingredientsTemp = [];
          for(let ing of this.state.get.ingredients.request.values.ingredients) {
               ingredientsTemp.push(new IngredientClass(ing.name, ing.image, ing.calories, ing.id));
          }
          this.setState({ingredients: ingredientsTemp});
     }

     componentDidMount() {
          this.getIngredients();
     }

     handleChecked(id, checked) {
          const idFound = this.state.selectedIngredients.indexOf(id) === -1 ? false : this.state.selectedIngredients.indexOf(id);
          if (idFound === false && checked) {
               this.setState({selectedIngredients: [...this.state.selectedIngredients, id]}, () => this.checkValidity(["selectedIngredients"]))
          } 
          else if(idFound !== false && !checked) {
               let temp = this.state.selectedIngredients;
               temp.splice(idFound, 1);
               this.setState({selectedIngredients: temp}, () => this.checkValidity(["selectedIngredients"]))
          }
     }

     create() {
          this.checkValidity(["name", "cookingMethod", "image", "time", "selectedIngredients"]);
          if (this.isNotValid()) {
               return;
          }
          this.setState({
               post: {
                    recipe: {
                         request: {
                              ...this.state.post.recipe.request,
                              sent: true
                         }
                    }
               }
          });

          const fd = new FormData();
          fd.append('name', this.state.name);
          fd.append('image', this.state.image);
          fd.append('cookingMethod', this.state.cookingMethod);
          fd.append('time', this.state.time);
          fd.append('ingredients', JSON.stringify(this.state.selectedIngredients));
          axios.post(WebSettings.url + '/api/recipes', fd)
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
                         recipe: {
                              request: request
                         }
                    }
               }, () => request.reach && request.status && request.statusSave && this.props.updateRecipes());
          })
          .catch(e => {
               this.setState({
                    post: {
                         recipe: {
                              request: {
                                   ...this.state.post.recipe.request,
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
          if (!this.state.validity.name.state || 
               !this.state.validity.image.state || 
               !this.state.validity.cookingMethod.state || 
               !this.state.validity.selectedIngredients.state || 
               !this.state.validity.time.state) {
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
                    if (ruleKey === "array" && value.length === 0) {
                         notValid.push("Select at least one item");
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

          let allIngredients = [];
          for (let ingredient of this.state.ingredients) {
               allIngredients.push(
                    <Ingredient 
                         key={'ingredientAdd' + ingredient.id}
                         id={ingredient.id}
                         name={ingredient.name}
                         image={ingredient.image}
                         calories={ingredient.calories}
                         addMode={true}
                         handleChecked={(checked) => this.handleChecked(ingredient.id, checked)}
                    />
               );
          }

          let messageGet = '';
          let isMessageGet = false;
          if (this.state.get.ingredients.request.sent && !this.state.get.ingredients.request.response) {
               messageGet = <Message type="loading" text="Loading ingredients, please wait..." />;
               isMessageGet = true;
          } 
          else if (this.state.get.ingredients.request.sent && this.state.get.ingredients.request.response && this.state.get.ingredients.request.reach) {
               if (!this.state.get.ingredients.request.status) {
                    messageGet = <Message type="error" text={"Error: " + this.state.get.ingredients.request.error} />;
                    isMessageGet = true;
               }
          }
          else if (this.state.get.ingredients.request.sent && this.state.get.ingredients.request.response && !this.state.get.ingredients.request.reach) {
               messageGet = <Message type="error" text="Error: cannot communicate with database." />;
               isMessageGet = true;
          }

          let messagePost = '';
          let isMessagePost = false;
          let postSave = false;
          if (this.state.post.recipe.request.sent && !this.state.post.recipe.request.response) {
               messagePost = <Message type="loading" text="Try to save changes, please wait..." />;
               isMessagePost = true;
          } 
          else if (this.state.post.recipe.request.sent && this.state.post.recipe.request.response && this.state.post.recipe.request.reach) {
               if (!this.state.post.recipe.request.status) {
                    messagePost = <Message type="error" text={this.state.post.recipe.request.errors} />;
                    isMessagePost = true;
               }
               else if (!this.state.post.recipe.request.statusSave) {
                    messagePost = <Message type="error" text={this.state.post.recipe.request.errorSave} />;
                    isMessagePost = true;
               }
               else {
                    messagePost = <Message type="success" text="A new recipe just added!" />;
                    isMessagePost = true;
                    postSave = true;
               }
          }
          else if (this.state.post.recipe.request.sent && this.state.post.recipe.request.response && !this.state.post.recipe.request.reach) {
               messagePost = <Message type="error" text="Error: cannot communicate with database." />;
          }

          return <Modal show className="custom-modal" onClose={() => this.close()}>
               <Modal.Content>
               <Card mx="3" className="h100p">
                    <Card.Header>
                         <Card.Header.Title>Create a New Recipe</Card.Header.Title>
                         <Card.Header.Icon textSize="4" textWeight="bold" onClick={() => this.close()}>&times;</Card.Header.Icon>
                    </Card.Header>
                    <Card.Content className="calculated">
                         {
                              isMessageGet
                              ? messageGet
                              : <>
                                   {messagePost}
                                   {
                                        postSave
                                        ? ''
                                        : <>
                                             <Control><Input onKeyUp={(e) => this.handleInput(e, "name")} type="text" placeholder="Name..." /></Control>
                                             <ControlError status={this.state.validity.name.status} />
                                             <Control mt="3"><Input onKeyUp={(e) => this.handleInput(e, "cookingMethod")} type="text" placeholder="Cooking Method..." /></Control>
                                             <ControlError status={this.state.validity.cookingMethod.status} />
                                             <Control mt="3"><Input onKeyUp={(e) => this.handleInput(e, "time")} type="text" placeholder="Cooking Time..." /></Control>
                                             <ControlError status={this.state.validity.time.status} />
                                             <Control mt="3"><Input onKeyUp={(e) => this.handleInput(e, "image")} type="text" placeholder="Image Url..." /></Control>
                                             <ControlError status={this.state.validity.image.status} />
                                             {allIngredients.length === 0 ? '' :
                                             <>
                                                  <div className="mt-5">
                                                       <div className="is-size-5">Choose Ingredients:</div>
                                                       <ControlError status={this.state.validity.selectedIngredients.status} />
                                                       <Columns flexWrap="wrap" mt="1" className="is-mobile">
                                                            {allIngredients}
                                                       </Columns>
                                                  </div>
                                             </>
                                             }
                                        </>
                                   }
                              </>
                         }
                    </Card.Content>
                    <Card.Footer>
                         { 
                              !isMessageGet && !postSave 
                              ? <Card.Footer.Item backgroundColor="primary" textColor="white" onClick={() => this.create()}>Create</Card.Footer.Item> 
                              : '' 
                         }
                         <Card.Footer.Item onClick={() => this.close()}>{ !isMessageGet && !postSave ? 'Cancel' : 'Close' }</Card.Footer.Item>
                    </Card.Footer>
               </Card>
          </Modal.Content>
     </Modal>;
     }
}

export default RecipeAddModal;
