import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import Colors from '../utils/Colors';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const labels = ['Flight Details', 'Add Passenger', 'AddOn', 'Make Payment'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.gradientBlue,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor:"green",
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor:"green",
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Colors.gradientBlue,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: Colors.gradientBlue,
  labelColor: Colors.gradientBlue,
  labelSize: 12,
  currentStepLabelColor: Colors.gradientBlue,
};

const StepProgress = ({ currentPosition = 0 }) => {
  const renderStepIndicator = ({ position, stepStatus }) => {
    if (stepStatus === 'finished') {
      return (
        <View style={{
          width: 25,
          height: 25,
          borderRadius: 12.5,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      );
    } else {
      return (
        <View style={{
          width: 25,
          height: 25,
          borderRadius: 12.5,
          backgroundColor: '#ffffff',
          borderWidth: 2,
          borderColor: Colors.gradientBlue,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: Colors.gradientBlue, fontWeight: 'bold' }}>{position + 1}</Text>
        </View>
      );
    }
  };

  const renderLabel = ({ label, position, stepStatus }) => {
    return (
      <Text style={{
        color: stepStatus === 'finished' ? 'green' : Colors.gradientBlue,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        width: 70
      }}>
        {label}
      </Text>
    );
  };

  return (
    <StepIndicator
      customStyles={customStyles}
      currentPosition={currentPosition}
      labels={labels}
      stepCount={labels.length}
      renderStepIndicator={renderStepIndicator}
      renderLabel={renderLabel}
    />
  );
};

export default StepProgress;
