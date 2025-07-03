import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import { Text, View } from 'react-native';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const labels = ['Expense Reported', 'Under Review', 'Amount Reimbursed'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.gradientBlue,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: Colors.gradientBlue,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: Colors.gradientBlue,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.gradientBlue,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Colors.gradientBlue,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: Colors.gradientBlue,
  labelSize: 12,
  currentStepLabelColor: Colors.darkGray,
};

const StepProgress = ({ currentPosition = 0 }) => (
  <StepIndicator
    customStyles={customStyles}
    currentPosition={currentPosition}
    labels={labels}
    stepCount={labels.length}
    renderStepIndicator={({ position, stepStatus }) => {
      if (stepStatus === 'finished') {
        return (
          <Icon name="check" size={16} color="#fff" />
        );
      } else {
        return (
          <Text style={{
            color: stepStatus === 'current' ? Colors.gradientBlue : '#aaa',
            fontFamily: 'Inter-Bold',
          }}>
            {position + 1}
          </Text>
        );
      }
    }}
  />
);

export default StepProgress;
