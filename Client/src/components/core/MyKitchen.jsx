import React from 'react';
import Recipes from './Recipes';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container } from 'react-bulma-components';
import DishRecipeClass from '../../classes/DishRecipeClass';
import IngredientClass from '../../classes/IngredientClass';
import WebSettings from '../../classes/WebSettings';
import RecipeAddModal from '../modals/RecipeAddModal';
import IngredientAddModal from '../modals/IngredientAddModal'
import ShowIngredientsModal from '../modals/ShowIngredientsModal'
import Message from '../helpers/Message';
import axios from 'axios';

class MyKitchen extends React.Component {
     constructor() {
          super();
          this.state = {
               recipes: [],
               ingredients: [],
               get: {
                    recipes: {
                         request: {
                              sent: false,
                              response: false,
                              reach: false,
                              status: false,
                              values: {}
                         }
                    },
               }
          };
     }

     updateRecipes() {
          this.setState({
               get: {
                    recipes: {
                         request: {
                              sent: false,
                              response: false,
                              reach: false,
                              status: false,
                              values: {}
                         }
                    },
               }
          }, () => this.getRecipes());
     }

     getRecipes() {
          this.setState({
               get: {
                    recipes: {
                         request: {
                              ...this.state.get.recipes.request,
                              sent: true
                         }
                    }
               }
          });
          axios.get(WebSettings.url + '/api/recipes')
          .then(res => {
               let request = {
                    sent: true,
                    response: true,
                    reach: false,
                    status: false,
                    values: {}
               }
               if (res.data && res.data.reach) {
                    const data = res.data;
                    request.reach = true;
                    request.status = data.status;
                    request.values = data.values;
               }
               this.setState({
                    get: {
                         recipes: {
                              request: request
                         }
                    }
               }, () => request.reach && request.status && this.buildRecipes());
          })
          .catch(e => {
               this.setState({
                    get: {
                         recipes: {
                              request: {
                                   ...this.state.get.recipes.request,
                                   response: true,
                                   reach: false
                              }
                         }
                    }
               });
          });
     }

     buildRecipes() {
          let recipesTemp = [];
          for(let rec of this.state.get.recipes.request.values.recipes) {
               let ingredientsTemp = [];
               for(let ing of rec.ingredients) {
                    ingredientsTemp.push(new IngredientClass(ing.name, ing.image, ing.calories, ing.id));
               }
               recipesTemp.push(new DishRecipeClass(rec.name, ingredientsTemp, rec.time, rec.cookingMethod, rec.image, rec.id));
          }
          this.setState({recipes: recipesTemp});
     }

     componentDidMount() {
          this.getRecipes();
     }

     render() {
          let message = '';
          if (this.state.get.recipes.request.sent && !this.state.get.recipes.request.response) {
               message = <Message type="loading" text="Loading recipes, please wait..." />;
          } 
          else if (this.state.get.recipes.request.sent && this.state.get.recipes.request.response && this.state.get.recipes.request.reach) {
               if (!this.state.get.recipes.request.status) {
                    message = <Message type="error" text="Error: cannot communicate with database." />;
               }
          }
          else if (this.state.get.recipes.request.sent && this.state.get.recipes.request.response && !this.state.get.recipes.request.reach) {
               message = <Message type="error" text="Error: cannot communicate with database." />;
          }

          return <BrowserRouter>
                    <Routes>
                         <Route path="/ingredient/add" element={<IngredientAddModal />} />
                         <Route path="/recipe/add" element={<RecipeAddModal updateRecipes={() => this.updateRecipes()} />} />
                         <Route  path="/recipe/:rid/ingredients" element={<ShowIngredientsModal recipes={this.state.recipes} />} />
                         <Route path="/" element={<></>} />
                    </Routes>
               <Container mt="5">
                    <div className="has-text-centered">
                         <div className="is-size-3 pb-5">My Italian Kitchen 🍕</div>
                         <span className="is-size-4 mt-4 pb-2">Actions:</span>&nbsp;<div className="pt-2 is-hidden-desktop"></div>
                         <Link className="button is-info" to="/recipe/add">New Recipe</Link>&nbsp;
                         <Link className="button is-info" to="ingredient/add">New Ingredient</Link>
                    </div>
                    {
                         message !== "" ? 
                         <div className="mt-4">{message}</div>
                         : <Recipes recipes={this.state.recipes} />
                    }
               </Container>
          </BrowserRouter>;
     }
}

export default MyKitchen;
