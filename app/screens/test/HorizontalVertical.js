import React, {useState, useEffect} from 'react';

import {FONTS} from '../../styles/theme';
import MainFrame from '../components/general/MainFrame';
import MainScreen from '../components/general/MainScreen';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  SectionList,
  Text,
} from 'react-native';

import Header from '../../components/headers/NavigationHeader';

const HorizontalVertical = ({props, navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState(true);

  const SECTIONS = [
    {
      title: 'Made for you',
      horizontal: true,
      data: [
        {
          key: '1',
          text: 'Item text 1',
          uri: 'https://picsum.photos/id/1/200',
        },
        {
          key: '2',
          text: 'Item text 2',
          uri: 'https://picsum.photos/id/10/200',
        },

        {
          key: '3',
          text: 'Item text 3',
          uri: 'https://picsum.photos/id/1002/200',
        },
        {
          key: '4',
          text: 'Item text 4',
          uri: 'https://picsum.photos/id/1006/200',
        },
        {
          key: '5',
          text: 'Item text 5',
          uri: 'https://picsum.photos/id/1008/200',
        },
      ],
    },
    {
      title: 'Punk ',
      horizontal: true,
      data: [
        {
          key: '1',
          text: 'Item text 1',
          uri: 'https://picsum.photos/id/1011/200',
        },
        {
          key: '2',
          text: 'Item text 2',
          uri: 'https://picsum.photos/id/1012/200',
        },

        {
          key: '3',
          text: 'Item text 3',
          uri: 'https://picsum.photos/id/1013/200',
        },
        {
          key: '4',
          text: 'Item text 4',
          uri: 'https://picsum.photos/id/1015/200',
        },
        {
          key: '5',
          text: 'Item text 5',
          uri: 'https://picsum.photos/id/1016/200',
        },
      ],
    },
    {
      title: 'Based on your recent listening',
      horizontal: false,
      data: [
        {
          key: '1',
          text: 'Item text 1',
          uri: 'https://picsum.photos/id/1020/200',
        },
        {
          key: '2',
          text: 'Item text 2',
          uri: 'https://picsum.photos/id/1024/200',
        },

        {
          key: '3',
          text: 'Item text 3',
          uri: 'https://picsum.photos/id/1027/200',
        },
        {
          key: '4',
          text: 'Item text 4',
          uri: 'https://picsum.photos/id/1035/200',
        },
        {
          key: '5',
          text: 'Item text 5',
          uri: 'https://picsum.photos/id/1038/200',
        },
      ],
    },
  ];

  useEffect(() => {
    getItemList();
    return () => {};
  }, []);

  const getItemList = () => {
    const apiURL =
      'https://jsonplaceholder.typicode.com/photos?_limit=20&_page=1';
    fetch(apiURL)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson);
      })
      .catch(error => {
        console.log('Error:', error);
      })
      .finally(() => setisLoading(false));
  };

  const renderTitle = ({item, index}) => {
    return <Text style={styles.sectionTitle}>{item.title}</Text>;
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.itemWrapper}>
        <Image
          style={styles.image}
          source={{uri: item.uri}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  const ListItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.itemWrapper}>
        <Image
          style={styles.image}
          source={{uri: item.uri}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <MainScreen>
      <Header onMenuIconPressed={() => navigation.openDrawer()} />
      <MainFrame>
        {/* <View style = {styles.horizontalSectionWrapper}>
            {isLoading ? <ActivityIndicator/>:(
                
                <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={item=>`key-${item.id}`}
                />
            )}
            </View> */}

        <View style={styles.verticalSectionWrapper}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <SectionList
              contentContainerStyle={{paddingHorizontal: 10}}
              stickySectionHeadersEnabled={false}
              sections={SECTIONS}
              renderSectionHeader={({section}) => (
                <>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  {section.horizontal && (
                    <FlatList
                      data={section.data}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderItem}
                    />
                  )}
                </>
              )}
              renderItem={({item, section}) => {
                if (section.horizontal) {
                  return null;
                }
                return <ListItem item={item} />;
              }}
            />
            // <FlatList
            // data={data}
            // showsHorizontalScrollIndicator={false}
            // renderItem={renderItem}
            // keyExtractor={item=>`key-${item.id}`}
            // />
          )}
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    marginVertical: 5,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
  },
  image: {
    height: 100,
    width: 100,
  },
  sectionHeader: {
    ...FONTS.pageTitle,
  },
});

export default HorizontalVertical;
