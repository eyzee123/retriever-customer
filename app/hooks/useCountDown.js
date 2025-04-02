import {useEffect, useState} from 'react';

const useCountDown = start => {
  const [counter, setCounter] = useState(start);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (counter < 0 || counter === start) {
      setCounter(start);
      setIsCounting(false);
      clearTimeout();
      return;
    }
    setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
  }, [counter]);
  return {counter, setCounter, isCounting, setIsCounting};
};
export default useCountDown;
