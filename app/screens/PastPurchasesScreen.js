import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

// galio component
import { Block, Text } from 'galio-framework';
import { Accordion } from 'galio-framework';

import axios from '../api/axios';

//Custom components
import theme from '../constants/Theme';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import Loader from '../components/Loader';
import ErrorView from '../components/ErrorView';

const Card = ({
  orderId,
  paymentMethod,
  totalAmount,
  orderStatus,
  createdAt,
  lineItems,
}) => (
  <Block
    style={{
      marginVertical: 4,
      backgroundColor: 'rgb(247,247,247)',
      borderRadius: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
    }}
  >
    <Block row space='between'>
      <Block style={{ width: '60%' }}>
        <Text>Order Id</Text>
        <Text bold size={12}>
          {orderId}
        </Text>
      </Block>
      <Block style={{ width: '30%' }}>
        <Text>Payment Method</Text>
        <Text bold size={12}>
          {paymentMethod}
        </Text>
      </Block>
    </Block>

    <Block row space='between' style={{ marginTop: 8 }}>
      <Block style={{ width: '60%' }}>
        <Text>Date</Text>
        <Text bold size={12}>
          {createdAt}
        </Text>
      </Block>
      <Block style={{ width: '30%' }}>
        <Text>Status</Text>
        <Text bold size={12}>
          {orderStatus}
        </Text>
      </Block>
    </Block>

    <Block style={{ marginTop: 16 }}>
      <Text>Details</Text>
    </Block>
    <Block style={{ marginTop: 4 }}>
      {lineItems.map((item) => (
        <Block row space='between' style={{ marginVertical: 4 }} key={item.id}>
          <Block row style={{ width: '60%' }}>
            <Text size={10}>{`${item.quantity}x `}</Text>
            <Text size={10} numberOfLines={2}>
              {item.name}
            </Text>
          </Block>
          <Block style={{ width: '30%' }}>
            <Text size={10}>{`$${item.total}`}</Text>
          </Block>
        </Block>
      ))}
      <Block style={styles.seperator} />
      <Block row space='between'>
        <Text>Total: </Text>
        <Text bold style={{ width: '30%' }}>{`$${totalAmount}`}</Text>
      </Block>
    </Block>
  </Block>
);

const PastPurchasesScreen = ({ navigation }) => {
  const authToken = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.details.id);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`orders`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { customer: userId },
      })
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
        setError(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
      });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    axios
      .get(`orders`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { customer: userId },
      })
      .then((response) => {
        setOrders(response.data);
        setRefreshing(false);
        setError(false);
      })
      .catch(() => {
        setRefreshing(false);
        setError(true);
      });
  };
  const renderLoading = () => (
    <Block middle>
      <Loader style={{ height: 40 }} />
    </Block>
  );

  if (error) {
    return (
      <ErrorView
        onErrorFallback={handleRefresh}
        isLoading={refreshing}
        style={{ backgroundColor: '#FFFFFF' }}
      />
    );
  }

  return (
    <Block flex style={{ backgroundColor: theme.COLORS.WHITE }}>
      {isLoading && renderLoading()}
      <FlatList
        data={orders}
        style={{ flex: 1 }}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <Card
            key={item.id}
            orderId={item.id}
            paymentMethod={item.payment_method_title}
            totalAmount={item.total}
            orderStatus={item.status}
            createdAt={moment(item.date_created).format('llll')}
            lineItems={item.line_items}
          />
        )}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  seperator: {
    marginVertical: 6,
    borderWidth: 0.5,
    borderColor: 'rgb(221, 221, 221)',
  },
  shadow: {
    shadowColor: theme.COLORS.BLOCK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: theme.SIZES.BLOCK_SHADOW_OPACITY,
    shadowRadius: theme.SIZES.BLOCK_SHADOW_RADIUS,
    elevation: theme.SIZES.ANDROID_ELEVATION,
  },
});

export default PastPurchasesScreen;
