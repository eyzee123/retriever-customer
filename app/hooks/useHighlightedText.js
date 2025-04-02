import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS} from '../styles/theme';

const getHighlightedText = (text, query) => {
  const value = query;
  const parts = text.split(new RegExp(`(${value})`, 'gi'));

  return parts.map(part =>
    part.toLowerCase() === value?.toLowerCase() ? (
      <Text style={styles.highlightedText}>{part}</Text>
    ) : (
      part
    ),
  );
};

const styles = StyleSheet.create({
  highlightedText: {
    color: COLORS.orange,
  },
});

export default getHighlightedText;
