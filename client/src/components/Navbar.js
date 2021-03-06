import React, { Component } from 'react'
import { Input, Menu, Modal, Button, Header, Icon, Form } from 'semantic-ui-react'
import CheckboxInfo from './CheckBoxInfo'
import Chips, { Chip } from 'react-chips';
import * as api from '../util/api.js'

export default class MenuExampleSecondary extends Component {
  state = { activeItem: 'home', checkboxes: [], checkboxesValues: [],  chips: [], openModal: false }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleSubmit = async (e) => {
    this.setState({ openModal: false })
    console.log("checkboxes values", this.state.checkboxesValues)
    let categories = this.state.chips.map((chip) => this.state[chip]);
    await api.createProject(this.props.auth.getToken(), { name: this.state.name, description: this.state.description, type:1, links: this.state.links, categories: categories, tasks: this.state.checkboxesValues})
  }
  openModal = (e) => {
    console.log("oi")
    this.setState({ openModal: true });
  }
  
  closeModal = (e) => {
    this.setState({openModal: false});
  }
  
  handleFormChange = async(e) => {
    await this.setState({[e.target.name]: e.target.value});
  }
  
  handleCheckboxChange = async(e) => {
    let checkboxesValues = this.state.checkboxesValues;
    console.log("checkboxes values", checkboxesValues)
    checkboxesValues[e.target.dataset.id] = e.target.value;
    console.log("checkboxes values", checkboxesValues)
    await this.setState({checkboxesValues: checkboxesValues});
  }

  async componentDidMount() {
    let categories = await api.getCategories();
    categories = categories.data.map((category) => { 
      this.setState({[category.name]: category._id})
      return category.name 
    });
    this.setState({categories:categories})
  }

  onChange = chips => {
    console.log(chips);
    this.setState({chips});
  }

  addCheckboxItem = (e) => {
    this.setState({ checkboxes: [...this.state.checkboxes, <CheckboxInfo handleCheckboxChange={this.handleCheckboxChange} id={this.state.checkboxes.length} key={this.state.checkboxes.length + 1} />] })
  }
  
  render() {
    const { activeItem, checkboxes } = this.state
    return (

      <Menu secondary id="menu">

        <Menu.Item
          active={activeItem === 'home'}
          onClick={this.handleItemClick} href="/">
          <img id="logo" src="https://i.imgur.com/ysaO2wd.png" />
        </Menu.Item>

        <Menu.Menu id="bar" position='right'>

          <Menu.Item id="bar">
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu position='right'>

          <Modal open={this.state.openModal} trigger={<Menu.Item id="button"
            name='contribua!'
            onClick={this.openModal}
          />}>
            <Modal.Header>Criação de projeto</Modal.Header>

            <Modal.Content image>
              <Modal.Description>

                <Form>
                  <Form.Field>
                    <label>Nome do Projeto</label>
                    <input name="name" placeholder='Nome do Projeto' onChange={this.handleFormChange} />
                  </Form.Field>

                  <Form.Field>
                    <label>Descrição do Projeto</label>
                    <input onChange={this.handleFormChange} name="description" placeholder='Descrição do Projeto' />
                  </Form.Field>

                  <Button type = "button" secondary id="button-checkbox" onClick={this.addCheckboxItem}>
                    Adicionar Checkbox
                  </Button>

                  {checkboxes}

                  <Form.Field>
                    <label>Links Úteis</label>
                    <input name="links" onChange={this.handleFormChange} placeholder='Links Úteis' />
                  </Form.Field>

                    <label>Tags</label>
                    <Chips
                      value={this.state.chips}
                      onChange={this.onChange}
                      suggestions={this.state.categories}
                    />
                </Form>
              </Modal.Description>
            </Modal.Content>

            <Modal.Actions>
            <Button onClick={this.closeModal} color='red'>
              <Icon name='remove' /> Cancelar
            </Button>
              <Button secondary id="button-proceed" onClick={this.handleSubmit}>
                Proceder
              </Button>
            </Modal.Actions>
          </Modal>

          <Menu.Item id="button"
            name='logout'
            active={activeItem === 'logout'}
            onClick={this.props.auth.logout}
          />
        </Menu.Menu>
      </Menu>
    )
  }
}