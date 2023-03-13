import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View } from "react-native";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      shoppingListData: [],
    };
  }

  getData() {
    return fetch("http://localhost:3333/list")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          shoppingListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <FlatList
          data={this.state.shoppingListData}
          renderItem={({ item }) => <Text>{item.item_name}</Text>}
          keyExtractor={({ id }, index) => id}
        />
      </View>
    );
  }
}

export default List;
