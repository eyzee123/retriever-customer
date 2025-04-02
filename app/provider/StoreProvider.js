import React, {createContext, useReducer, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  storeInitialState,
  storeReducer,
  productReducer,
  productInitialState,
  categoryReducer,
  categoryInitialState,
  scheduleReducer,
  scheduleInitialState,
} from '../reducers/StoreReducer';
import {showErrorMessage} from '../utils/FlashMessage';
import Labels from '../constants/Labels';
import {COLLECTION, SUB_COLLECTION} from '../constants/Collections';
import {
  getLocalDataObject,
  storeLocalDataObject,
} from '../services/Storage/LocalStorageService';
import {
  convertToFirestoreTimestamp,
  getHoursDifference2Dates,
} from '../utils/HelperFunctions';
import {LOCAL_STORAGE} from '../constants/ProjectConstants';
import {RoundOffDecimal} from '../utils/HelperFunctions';
import {firebase} from '@react-native-firebase/firestore';
import {RateReviewContext} from './RateReviewProvider';

const StoreContext = createContext();

const StoreProvider = props => {
  const storeCollection = firestore().collection(COLLECTION.STORES);
  const ratingContext = useContext(RateReviewContext);
  const [storeStories, setStoreStories] = useState([]);

  const [storeState, dispatchStoreList] = useReducer(
    storeReducer,
    storeInitialState,
  );
  const [scheduleState, dispatchScheduleList] = useReducer(
    scheduleReducer,
    scheduleInitialState,
  );

  const [searchStoreProducts, setSearchStoreProducts] = useState([]);

  const searchStores = async searchKey => {
    let searchStoreResult = [];
    let searchAllResult = [];
    if (searchKey !== '') {
      try {
        //Search by product

        //Query documents in the 'mainCollection'
        const store = await firestore()
          .collection('stores')
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(mainDoc => {
              // Get the subcollection reference
              const subCollectionRef = mainDoc.ref.collection('products');

              // Query documents in the 'subCollection'
              subCollectionRef
                .where('productName', '>=', searchKey)
                .where('productName', '<', searchKey + 'z')
                .get()
                .then(subQuerySnapshot => {
                  arrProducts = [];
                  subQuerySnapshot.forEach(subDoc => {
                    // Access the document data
                    const searchResultIndex = searchAllResult.findIndex(
                      data => data.id === mainDoc.id,
                    );
                    if (searchResultIndex < 0) {
                      searchAllResult.push({
                        ...mainDoc.data(),
                        id: mainDoc.id,
                        rating: 5,
                        products: [{...subDoc.data(), id: subDoc.id}],
                      });
                    } else {
                      searchAllResult[searchResultIndex].products.push({
                        ...subDoc.data(),
                        id: subDoc.id,
                      });
                    }
                  });
                  if (searchAllResult.length >= 4) {
                    searchAllResult.forEach(item => {});
                  }
                  // searchAllResult.push({
                  //   ...mainDoc.data(),
                  //   id: mainDoc.id,
                  //   products: [...arrProducts],
                  // });
                  // searchAllResult.forEach(item => {
                  //   console.log('item.id', item.id);
                  // });
                })
                .catch(error => {
                  console.error(
                    'Error getting subcollection documents: ',
                    error,
                  );
                });
            });
          })
          .catch(error => {
            console.error('Error getting main collection documents: ', error);
          });
        console.log('sdsdsd', searchAllResult);
        // const productNameFilter = await firestore()
        //   .collectionGroup('products')
        //   .where('productName', '>=', searchKey)
        //   .where('productName', '<', searchKey + 'z')
        //   .get();

        // if (!productNameFilter.empty) {
        //   arrProducts = [];
        //   productNameFilter.forEach(data => {
        //     console.log('data', data.ref.firestore.collection('stores'));
        //     const arr = data.ref.path.split('/');
        //     if (arr[0] === 'stores') {
        //     }
        //   });
        //   console.log('storeIds', storeIds);
        // }

        //Search by product

        // const storeNameFilter = await storeCollection
        //   .where('storeName', '>=', searchKey)
        //   .where('storeName', '<', searchKey + 'z')
        //   .get();

        // if (!storeNameFilter.empty) {
        //   searchStoreResult = [];
        //   storeNameFilter.forEach(async data => {
        //     // const ratingResponse = storeCollection
        //     //   .doc(data.data().storeId)
        //     //   .collection(SUB_COLLECTION.RATINGS)
        //     //   .get();

        //     let avgRating = 5;
        //     // if (!ratingResponse.empty) {
        //     //   ratingResponse.forEach(res => {
        //     //     const result = res.data();
        //     //     rating = rating + result.rating;
        //     //   });

        //     //   avgRating = rating / ratingResponse.size;
        //     // }

        //     searchStoreResult.push({
        //       ...data.data(),
        //       id: data.id,
        //       rating: RoundOffDecimal(avgRating, 1),
        //       products: [],
        //     });
        //   });
        // }

        return searchStoreResult;
      } catch (error) {
        console.log('search', error);
      }
    }
  };

  const searchByProduct = async searchKey => {
    let arrProducts = [];
    let storeId = [];
    try {
      const productNameFilter = await firestore()
        .collectionGroup('products')
        .where('productName', '>=', searchKey)
        .where('productName', '<', searchKey + 'z')
        .get();

      if (!productNameFilter.empty) {
        arrProducts = [];
        productNameFilter.forEach(data => {
          console.log('data', data);
          const arr = data.ref.path.split('/');
          storeId.push(arr[1]);
        });
      }

      return storeId;
    } catch (error) {
      console.log('search product error', error);
    }
  };

  const searchStoresProduct = async storeIds => {
    let searchAllResult = [];
    storeIds.forEach(async storeId => {
      const storeResponse = await storeCollection.doc(storeId).get();
      if (storeResponse.exists) {
        storeDetails = storeResponse.data();
        // arrProducts.push(data.data());
        searchAllResult.push(storeDetails.storeName);
      }
    });

    return searchAllResult;
  };

  const deleteStory = async (storeID, storyID) => {
    // dispatchStory({type: 'PROCESSING'});
    try {
      await storeCollection
        .doc(storeID)
        .collection(SUB_COLLECTION.STORIES)
        .doc(storyID)
        .delete();

      // dispatchStory({type: 'SUCCESS'});
      return {success: true};
    } catch (error) {
      console.log('error ' + error);
      dispatchStoreList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {success: false};
    }
  };

  const getStoreList = async () => {
    dispatchStoreList({type: 'PROCESSING'});
    try {
      let storeArray = [];
      let storeStories = [];

      await storeCollection
        .where('verified', '==', true)
        .orderBy('status', 'desc')
        .orderBy('storeName', 'asc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;

            //get store schedule
            const schedule = await getScheduleList(data.id);
            data.schedule = schedule.data;

            //get ratings from specific store
            const responseRating = await ratingContext.getRatings(data.storeID);
            data.storeRating = {
              ratings: responseRating.result.ratings,
              averageRatings: responseRating.result.averageRatings,
              totalRatingsCount: responseRating.result.totalRatingsCount,
            };

            const productResponse = await storeCollection
              .doc(data.id)
              .collection(SUB_COLLECTION.PRODUCTS)
              .where('status', '==', true)
              .get();

            let productsArray = [];
            if (!productResponse.empty) {
              productResponse.forEach(product => {
                let productData = product.data();
                let productObj = {
                  id: product.id,
                  ...productData,
                };
                productsArray.push(productObj);
              });
            }

            let storeDataObject = {
              ...data,
              products: productsArray,
            };

            //store all stores in array
            storeArray.push(storeDataObject);

            const response = await storeCollection
              .doc(data.id)
              .collection(SUB_COLLECTION.STORIES)
              .get();

            if (!response.empty) {
              let storyArray = [];
              response.forEach(storyData => {
                const timestamp = convertToFirestoreTimestamp(
                  storyData.data().createdAt,
                ).toDate();

                let storeStory = {
                  ...storyData.data(),
                  createdAt: timestamp,
                  isSeen: false,
                  progressIndex: 0,
                };

                if (
                  getHoursDifference2Dates(
                    timestamp,
                    firebase.firestore.Timestamp.now().seconds * 1000,
                  ) < 24
                ) {
                  storyArray.push(storeStory);
                } else {
                  deleteStory(data.id, storyData.data().storyId);
                }
              });

              // let localStories = await getLocalDataObject(
              //   LOCAL_STORAGE.STORIES,
              // );

              // let localStoryArrayFinal = storyArray;
              // if (localStories !== null) {
              //   localStoryArrayFinal = localStories
              //     .concat(storyArray)
              //     .reduce((accumulator, current) => {
              //       const existing = accumulator.find(
              //         obj => obj.storyId === current.storyId,
              //       );
              //       if (!existing) {
              //         accumulator.push(current);
              //       }
              //       return accumulator;
              //     }, []);
              // }

              let storyObject = {
                ...data,
                id: data.id,
                profile: data.storeProfilePhoto,
                title: data.type,
                username: data.storeName,
                stories: storyArray,
              };

              if (storyArray.length > 0) {
                storeStories.push(storyObject);
              }
            }
            await storeLocalDataObject(LOCAL_STORAGE.STORIES, storeStories);
            setStoreStories(storeStories);

            dispatchStoreList({
              type: 'SUCCESS',
              payload: {
                store: storeArray,
                storeStories: storeStories,
              },
            });
          });
        });

      return {data: storeArray};
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchStoreList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const getScheduleList = async storeID => {
    // dispatchScheduleList({type: 'PROCESSING'});
    try {
      let scheduleArray = [];
      await storeCollection
        .doc(storeID)
        .collection('schedule')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data = {
              ...snapshot.data(),
              id: snapshot.id.charAt(0).toUpperCase() + snapshot.id.slice(1),
            };

            if (data.id === 'Sunday') {
              scheduleArray[0] = data;
            }
            if (data.id === 'Monday') {
              scheduleArray[1] = data;
            }
            if (data.id === 'Tuesday') {
              scheduleArray[2] = data;
            }
            if (data.id === 'Wednesday') {
              scheduleArray[3] = data;
            }
            if (data.id === 'Thursday') {
              scheduleArray[4] = data;
            }
            if (data.id === 'Friday') {
              scheduleArray[5] = data;
            }
            if (data.id === 'Saturday') {
              scheduleArray[6] = data;
            }
          });

          dispatchScheduleList({
            type: 'SUCCESS',
            payload: {
              scheduleList: scheduleArray,
            },
          });
        });
      return {data: scheduleArray};
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchScheduleList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const storeContext = {
    storeList: storeState.storeList,
    // storiesList: storeState.storiesList,
    storiesList: storeStories,
    isLoading: storeState.isLoading,
    scheduleList: scheduleState.scheduleList,
    getStoreList,
    getScheduleList,
    setStoreStories,
    searchStores,
    searchStoresProduct,
    deleteStory,
  };

  return (
    <StoreContext.Provider value={storeContext}>
      {props.children}
    </StoreContext.Provider>
  );
};

export {StoreProvider, StoreContext};
