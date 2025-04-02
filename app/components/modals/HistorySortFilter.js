import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import RadioButton from '../general/RadioButton';
import RoundedButton from '../cores/RoundedButton';
import RoundedInput from '../cores/RoundedInput';
import Icon from 'react-native-vector-icons/Feather';
import useDateFormat from '../../hooks/useDateFormat';
import DateTimePicker from '@react-native-community/datetimepicker';

const HistorySortFilter = ({
  showModal,
  closeModal,
  onConfirmApply,
  selectedFilter,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const {formattedDate: dateString} = useDateFormat(selectedDate);
  const {formattedDate: dateString1} = useDateFormat(selectedDate1);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showInputDate, setShowInputDate] = useState(false);

  const data = [
    {
      label: 'Today',
    },
    {
      label: 'Yesterday',
    },
    {
      label: 'Last Week',
    },
    {
      label: 'Last Month',
    },
    {
      label: 'Custom Date',
    },
  ];

  const showDatepicker = () => {
    setShow(!show ? true : false);
  };

  const showDatepicker1 = () => {
    setShow1(!show1 ? true : false);
  };

  const onChange = (event, date) => {
    setSelectedDate(date);
    setShow(false);
  };

  const onChange1 = (event, date) => {
    setSelectedDate1(date);
    setShow1(false);
  };

  const onClickDate = e => {
    selectedFilter(e);
    e.label === 'Custom Date'
      ? setShowInputDate(true)
      : setShowInputDate(false);
  };
  return (
    <Modal
      style={styles.modalStyle}
      isVisible={showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      coverScreen={false}
      onBackdropPress={closeModal}>
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.backContainer}>
            <TouchableOpacity style={styles.viewLeft} onPress={closeModal}>
              <Icon
                name="chevron-left"
                size={SIZES.iconSize.medium}
                color={COLORS.darkGreen}
              />
            </TouchableOpacity>
            <View style={styles.viewCenter}>
              <Text style={[styles.sectionLabel, {fontSize: SIZES._16px}]}>
                Sort by Date
              </Text>
            </View>
          </View>
          <RadioButton
            data={data}
            selectedBtn={e => onClickDate(e)}
            boxStyle={{marginTop: SPACING.medium}}
            style={styles.radioBtnStyle}
            textStyle={styles.textStyle}
          />
          {showInputDate ? (
            <>
              <View style={styles.dateContainer}>
                <RoundedInput
                  editable={false}
                  placeholder="Choose a Starting Date"
                  value={dateString}
                  inputStyle={styles.inputStyle}
                />
                <TouchableOpacity onPress={showDatepicker}>
                  <Icon
                    name="calendar"
                    size={SIZES.iconSize.small}
                    color={COLORS.darkGreen}
                    style={styles.icon}
                  />
                </TouchableOpacity>

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange}
                  />
                )}
              </View>
              <View
                style={[styles.dateContainer, {marginBottom: SPACING.medium}]}>
                <RoundedInput
                  editable={false}
                  placeholder="Choose an End Date"
                  value={dateString1}
                  inputStyle={styles.inputStyle}
                />
                <TouchableOpacity onPress={showDatepicker1}>
                  <Icon
                    name="calendar"
                    size={SIZES.iconSize.small}
                    color={COLORS.darkGreen}
                    style={styles.icon}
                  />
                </TouchableOpacity>

                {show1 && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate1}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange1}
                  />
                )}
              </View>
            </>
          ) : null}

          <RoundedButton
            text="Apply"
            onPress={() => onConfirmApply(selectedDate, selectedDate1)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    width: '100%',
    alignSelf: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: -SPACING.large,
  },
  container: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.large,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER.roundedCornerPopupCard,
    borderTopRightRadius: BORDER.roundedCornerPopupCard,
    width: windowWidth,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
  },
  viewCenter: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -SPACING.large,
    zIndex: -1,
  },
  radioBtnStyle: {
    marginBottom: SPACING.medium,
    marginLeft: windowWidth * 0.82,
  },
  textStyle: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: -windowWidth * 0.82,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.small,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.medium,
    marginVertical: 0,
  },
  icon: {
    marginHorizontal: SPACING.small,
  },
});
export default HistorySortFilter;
