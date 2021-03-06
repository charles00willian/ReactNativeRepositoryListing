import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

// import { Container } from './styles';
export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({loading: true});

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  handleNavigation = repo => {
    const {navigation} = this.props;

    navigation.navigate('Repo', {repo});
  };

  loadMore = async () => {
    const {navigation} = this.props;
    const {stars, page} = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`,
    );

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    });
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading} = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {/* TODO add a erase button */}
        {loading ? (
          <ActivityIndicator color="#999" />
        ) : (
          <Stars
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <TouchableWithoutFeedback
                onPress={() => this.handleNavigation(item)}>
                <Starred>
                  <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </TouchableWithoutFeedback>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

// return({navigation}) {
//   console.tron.log(navigation.getParam('user'));
