import React from 'react';
import { Link } from 'react-router-dom';
import { Columns, Card, Content, Button } from 'react-bulma-components';

class Recipe extends React.Component {
     constructor(props) {
          super(props);
          this.state = {};
     }
     
     render() {
          return <Columns.Column flexWrap="wrap" desktop={{size: '4'}} mobile={{size: '12'}}>
               <Card className='px-5 py-5'>
                    <Card.Content px="0" className='h100p'>
                         <Content className='h100p'>
                              <Card.Image src={this.props.image} size='4by3' alt="" />
                              <div className="has-text-weight-bold mt-3">{this.props.name}</div>
                              <div className="mt-2">Cooking Method: {this.props.cookingMethod}</div>
                              <div className="mt-2">Total Cooking Time: {this.props.time}</div>
                              <div className="mt-2">Total Calories: {this.props.calories}</div>
                              <div className="mt-2">
                                   <Link to={'/recipe/' + this.props.id + '/ingredients'} className="button is-info">Show Ingredients</Link>&nbsp;
                                   { this.props.isPrepared ? 
                                        <Button onClick={() => this.props.eat()} color="danger">Eat!</Button> : 
                                        <Button onClick={() => this.props.prepare()} color="primary">Prepare Dish</Button> 
                                   }
                              </div>
                         </Content>
                    </Card.Content>
               </Card>
          </Columns.Column>;
     }
}

export default Recipe;
