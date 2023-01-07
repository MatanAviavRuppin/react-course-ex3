import React from 'react';
import Ingredient from '../core/Ingredient';
import { Navigate } from 'react-router-dom';
import { WithRouterComponent } from '../helpers/WithRouterComponent';
import { Modal, Card, Columns } from 'react-bulma-components';
import IngredientClass from '../../classes/IngredientClass';
import WebSettings from '../../classes/WebSettings';
import Message from '../helpers/Message'
import axios from 'axios';

class ShowIngredientsModal extends React.Component {
     constructor(props) {
          super(props);
          const param_rid = this.props.router.params && this.props.router.params.rid || 0;
          this.state = {
               close: false,
               ingredients: [],
               rid: +param_rid,
               get: {
                    recipe: {
                         request: {
                              sent: false,
                              response: false,
                              reach: false,
                              status: false,
                              error: false,
                              values: {}
                         }
                    },
               }
          };
     }

     getRecipe() {
          this.setState({
               get: {
                    recipe: {
                         request: {
                              ...this.state.get.recipe.request,
                              sent: true
                         }
                    }
               }
          });
          axios.get(WebSettings.url + '/api/recipes/' + this.state.rid)
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
                         recipe: {
                              request: request
                         }
                    }
               }, () => request.reach && request.status && this.buildIngredients());
          })
          .catch(e => {
               this.setState({
                    get: {
                         recipe: {
                              request: {
                                   ...this.state.get.recipe.request,
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
          for(let ing of this.state.get.recipe.request.values.recipe.ingredients) {
               ingredientsTemp.push(new IngredientClass(ing.name, ing.image, ing.calories, ing.id));
          }
          this.setState({ingredients: ingredientsTemp});
     }

     close() {
          this.setState({close: true});
     }

     componentDidMount() {
          this.getRecipe();
     }

     render() {
          if (this.state.close) {
               return <Navigate to="/" />
          }
          let allIngredients = [];
          for (let ingredient of this.state.ingredients) {
               allIngredients.push(
                    <Ingredient 
                         key={'ingredientShow' + ingredient.id}
                         id={ingredient.id}
                         name={ingredient.name}
                         image={ingredient.image}
                         calories={ingredient.calories}
                         addMode={false}
                    />
               );
          }

          let message = '';
          if (this.state.get.recipe.request.sent && !this.state.get.recipe.request.response) {
               message = <Message type="loading" text="Loading ingredients, please wait..." />;
          } 
          else if (this.state.get.recipe.request.sent && this.state.get.recipe.request.response && this.state.get.recipe.request.reach) {
               if (!this.state.get.recipe.request.status) {
                    message = <Message type="error" text={"Error: " + this.state.get.recipe.request.error} />;
               }
          }
          else if (this.state.get.recipe.request.sent && this.state.get.recipe.request.response && !this.state.get.recipe.request.reach) {
               message = <Message type="error" text="Error: cannot communicate with database." />;
          }

          return <Modal className="custom-modal" show onClose={() => this.close()}>
               <Modal.Content>
                    <Card mx="3" className="h100p">
                         <Card.Header>
                              <Card.Header.Title>Ingredients of This Recipe</Card.Header.Title>
                              <Card.Header.Icon textWeight="bold" textSize="4" onClick={() => this.close()}>&times;</Card.Header.Icon>
                         </Card.Header>
                         <Card.Content className="calculated">
                              {message}
                              <Columns flexWrap="wrap" mt="1" className="is-mobile">
                                   {allIngredients}
                              </Columns>
                         </Card.Content>
                         <Card.Footer>
                              <Card.Footer.Item onClick={() => this.close()}>Close</Card.Footer.Item>
                         </Card.Footer>
                    </Card>
               </Modal.Content>
          </Modal>;
     }
}

export default WithRouterComponent(ShowIngredientsModal);
