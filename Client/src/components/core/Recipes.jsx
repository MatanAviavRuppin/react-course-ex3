import React from 'react';
import Recipe from './Recipe';
import { Columns } from 'react-bulma-components';

class Recipes extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               recipesToEat: []
          };
     }

     prepareRecipe(id) {
          this.setState({recipesToEat: [...this.state.recipesToEat, id]});
     }

     eatRecipe(id) {
          const index = this.state.recipesToEat.indexOf(id);
          let temp = this.state.recipesToEat;
          temp.splice(index, 1);
          this.setState({recipesToEat: temp});
     }

     render() {
          let toPrepare = [];
          let toEat = [];
          for (let rec of this.props.recipes) {
               const isToEat = this.state.recipesToEat.indexOf(rec.id) === -1 ? false : true;
               let temp = <Recipe 
                         key={'recipe' + rec.id}
                         name={rec.name} 
                         id={rec.id}
                         ingredients={rec.ingredients}
                         image={rec.image} 
                         cookingMethod={rec.cookingMethod}
                         calories={rec.getTotalCalories()}
                         time={rec.time} 
                         isPrepared={isToEat}
                         prepare={() => this.prepareRecipe(rec.id)}
                         eat={() => this.eatRecipe(rec.id)}
                         />;
               
               if (isToEat) {
                    toEat.push(temp);
               } else {
                    toPrepare.push(temp);
               }
          }
          return <>
               <div className="is-size-4">Dishs You Can Prepare ({toPrepare.length})</div>
               <Columns flexWrap="wrap" mt="3">{toPrepare}</Columns>
               <hr />
               <div className="is-size-4">Dishs You Can Eat ({toEat.length})</div>
               <Columns flexWrap="wrap" mt="3">{toEat}</Columns>
               <br /><br /><br />
          </>;
     }
}

export default Recipes;
