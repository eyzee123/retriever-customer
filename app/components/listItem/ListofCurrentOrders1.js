import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BORDER, COLORS, FONTS, GlobalStyle, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../cores/RoundedButton';
import ConfirmationDialogue from '../modals/ConfirmationDialogue';
import ListSingleStoreStories from './ListSingleStoreStories';
import {formatThousands} from '../../utils/HelperFunctions';

const ListofCurrentOrders1 = props => {
  const [openModalDelete, setModalDelete] = useState(false);

  const confirmDeleteHandler = () => {
    props.onItemDelete(props.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.rowContainer}>
          <View style={styles.viewLeft}>
            <ListSingleStoreStories store={props.store} small />
          </View>
          <View style={styles.viewCenter}>
            <Text style={styles.sectionLabel}>{props.storeName}</Text>
            <Text style={styles.sectionSubLabel}>
              {props.order_count} {props.order_count > 1 ? 'Orders' : 'Order'}
            </Text>
          </View>
        </View>
        {/* <Text style={styles.textItemsUpdated}>Items in cart updated</Text> */}
      </View>

      <View style={[styles.rowContainer, styles.bottomWrapper]}>
        <View style={styles.viewSubLeft}>
          <Text style={styles.sectionSubLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>
            ₱{formatThousands(props.total_price)}
          </Text>
        </View>
        <View style={styles.viewSubRight}>
          <View style={styles.btnDeleteWrapper}>
            <RoundedButton
              text="  Delete  "
              onPress={() => setModalDelete(true)}
              iconStyle={styles.iconStyle}
              btnText={styles.btnTextDelete}
              btnStyle={styles.btnStyleDelete}
            />
          </View>
          <View>
            <RoundedButton
              text="  Order Details  "
              onPress={props.onPressDetails}
              iconStyle={styles.iconStyle}
              btnStyle={styles.btnStyleOrderDetails}
            />
          </View>
        </View>
      </View>

      <ConfirmationDialogue
        title="Delete Section ⁉️"
        body="Are you sure you want to delete this section? You can’t undo this action."
        onCancelButtonText="Cancel"
        confirmButtonText="Delete"
        onConfirm={confirmDeleteHandler}
        showModal={openModalDelete}
        onCancel={() => setModalDelete(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER.roundedCornerBox,
    padding: SPACING.small,
    backgroundColor: COLORS.white,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  divider: {
    borderBottomColor: COLORS.subTextColor,
    borderBottomWidth: 1,
    paddingBottom: SPACING.small,
  },
  viewLeft: {
    marginLeft: windowWidth * 0.015,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: windowWidth * 0.035,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
  },
  sectionSubLabel: {
    ...FONTS.regular,
    color: COLORS.subTextColor1,
  },
  textItemsUpdated: {
    ...FONTS.bold,
    color: COLORS.yellowFF9,
    alignSelf: 'flex-end',
    marginTop: SPACING.x_small,
  },
  bottomWrapper: {
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  viewSubLeft: {
    flex: 1,
  },
  totalPrice: {
    ...FONTS.bold,
    color: COLORS.orange,
  },
  viewSubRight: {
    flexDirection: 'row',
  },
  btnDeleteWrapper: {
    marginRight: SPACING.x_small,
  },
  iconStyle: {
    marginRight: 0,
  },
  btnTextDelete: {
    color: COLORS.subTextColor1,
  },
  btnStyleDelete: {
    backgroundColor: COLORS.subTextColor,
    marginVertical: 0,
  },
  btnStyleOrderDetails: {
    marginVertical: 0,
  },
});

export default ListofCurrentOrders1;
