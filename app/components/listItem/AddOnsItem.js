import {windowHeight} from '../../utils/Dimensions';
import CustomCheckbox from '../general/CustomCheckBox';

const AddOnsItem = props => {
  const item = props.item;
  const selected = props.selected;

  const itemSelectHandler = selectedItem => {
    props.onItemSelect(selectedItem);
  };

  return (
    <CustomCheckbox
      selected={selected}
      item={item}
      onItemSelect={itemSelectHandler}
      addOnStyle={{marginVertical: windowHeight * 0.014}}
    />
  );
};

export default AddOnsItem;
