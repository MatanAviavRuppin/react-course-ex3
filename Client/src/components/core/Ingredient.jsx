import React from 'react';
import { Columns, Card, Content, Form } from 'react-bulma-components';
const { Control, Checkbox } = Form;

class Ingredient extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               checked: false
          };
     }

     handleChange(e) {
          this.setState({checked: e.target.checked});
          this.props.handleChecked(e.target.checked);
     }

     render() {
          const addMode = this.props.addMode ? true : false;
          return <Columns.Column desktop={{size: '4'}} mobile={{size: '12'}} >
               <Card px="5" py="5">
                    <Card.Content px="0" className="h100p">
                         <Content className="h100p">
                              <Card.Image size="3by2" src={this.props.image} alt="" />
                              <div className="has-text-weight-bold mt-3">{this.props.name}</div>
                              <div className="mt-2">Calories: {this.props.calories} </div>
                              { addMode ? 
                                   <Control mt="2">
                                        <Checkbox onChange={(e) => this.handleChange(e)} value={this.props.id}>Add</Checkbox>
                                   </Control>
                                    : '' }
                         </Content>
                    </Card.Content>
               </Card>
          </Columns.Column>;
     }
}

export default Ingredient;
