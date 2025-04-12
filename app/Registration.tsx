import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from './contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { studentService } from './services/studentService';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface RegistrationProps {
  navigation: RegistrationScreenNavigationProp;
}

const Registration: React.FC<RegistrationProps> = ({ navigation }) => {
  const { signup, isFirstTime } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNo: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    enrollmentNo: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
  }>({ score: 0, message: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Enrollment number validation
    if (!formData.enrollmentNo.trim()) {
      newErrors.enrollmentNo = 'Enrollment number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.enrollmentNo)) {
      newErrors.enrollmentNo = 'Enrollment number must be 10 digits';
      isValid = false;
    }

    // Mobile number validation
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
        message = 'Very Weak';
        break;
      case 1:
        message = 'Weak';
        break;
      case 2:
        message = 'Medium';
        break;
      case 3:
        message = 'Strong';
        break;
      case 4:
        message = 'Very Strong';
        break;
    }

    setPasswordStrength({ score, message });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === 'password') {
      calculatePasswordStrength(value);
    }

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // First validate student data with college database
      const validationResult = await studentService.validateStudent({
        enrollmentNo: formData.enrollmentNo,
        email: formData.email,
        mobileNo: formData.mobileNo,
      });

      if (!validationResult.isValid) {
        Alert.alert('Validation Error', validationResult.message);
        return;
      }

      // If student data is valid, proceed with registration
      const registrationResult = await studentService.registerStudent({
        enrollmentNo: formData.enrollmentNo,
        email: formData.email,
        mobileNo: formData.mobileNo,
        password: formData.password,
      });

      if (!registrationResult.isValid) {
        Alert.alert('Registration Error', registrationResult.message);
        return;
      }

      // If registration is successful, proceed with authentication
      await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('isFirstTime', 'false');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error skipping registration:', error);
    }
  };

  const validateStudentData = async (data: {
    enrollmentNo: string;
    email: string;
    mobileNo: string;
  }) => {
    // TODO: Implement actual college database validation
    // This is a placeholder that should be replaced with your actual API call
    return {
      isValid: true,
      message: 'Student data validated successfully',
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Student Registration</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              editable={!isLoading}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enrollment Number</Text>
            <TextInput
              style={[styles.input, errors.enrollmentNo ? styles.inputError : null]}
              placeholder="Enter your enrollment number"
              value={formData.enrollmentNo}
              onChangeText={(text) => handleChange('enrollmentNo', text)}
              keyboardType="numeric"
              editable={!isLoading}
            />
            {errors.enrollmentNo ? <Text style={styles.errorText}>{errors.enrollmentNo}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={[styles.input, errors.mobileNo ? styles.inputError : null]}
              placeholder="Enter your mobile number"
              value={formData.mobileNo}
              onChangeText={(text) => handleChange('mobileNo', text)}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {errors.mobileNo ? <Text style={styles.errorText}>{errors.mobileNo}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            {formData.password.length > 0 && (
              <View style={styles.strengthIndicator}>
                <View style={[styles.strengthBar, { width: `${(passwordStrength.score / 4) * 100}%` }]} />
                <Text style={styles.strengthText}>{passwordStrength.message}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {!isFirstTime && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={isLoading}
            >
              <Text style={styles.skipButtonText}>Already registered? Login</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  strengthIndicator: {
    marginTop: 5,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  strengthText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default Registration; 