import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useCountDown from '../../hooks/useCountDown';
import {COLORS} from '../../styles/theme';

const Timer = () => {
  const {counter, setCounter, isCounting, setIsCounting} = useCountDown(10);
  // const [counter, setCounter] = useState(10);

  //   useEffect(() => {
  //     if (counter < 0 || counter === 10) {
  //       setCounter(10);
  //       clearTimeout();
  //       return;
  //     }
  //     setTimeout(() => {
  //       setCounter(counter - 1);
  //     }, 1000);

  //   }, [counter]);

  const resendErrorStyle = isCounting && {color: COLORS.disabled};

  const startTimer = () => {
    setIsCounting(true);
    setCounter(counter => counter - 1);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{counter}</Text>

      <TouchableOpacity onPress={startTimer} disabled={isCounting}>
        <Text style={[{color: COLORS.orange}, resendErrorStyle]}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Timer;
